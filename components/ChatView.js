// components/ChatView.js
import React, { useState, useEffect } from "react";
import styles from "./ChatView.module.css";
import ReactMarkdown from "react-markdown";

const ChatView = ({ chatBot }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  chatBot.updateMessages = setMessages;

  // Run this effect when the component mounts
  useEffect(() => {
    // Initial messages load from the file
    setMessages(chatBot.messages);
  }, [chatBot]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConsult = async () => {
    setLoading(true);
    console.log("Consulting...");
    await chatBot.consult();
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting prompt:", inputValue);
    await chatBot.ask(inputValue);
    setInputValue("");
    setLoading(false);
  };

  const archiveChat = async () => {
    setLoading(true);
    console.log("Archiving...");
    await chatBot.archiveChat();
    setMessages(chatBot.messages);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2>{chatBot.botName}</h2>
      {loading ? (
        <div>Loading...</div> // Spinner or loading indicator
      ) : messages && messages.length > 0 ? (
        <div>
          {messages
            .filter((message) => message.role !== "system") // Exclude system messages
            .filter((message) => message.role !== "function") // Exclude function messages
            .filter((message) => !message.function_call) // exclude function calls
            .map((message, index) => (
              <div key={index}>
                <strong>{message.role}: </strong>
                <ReactMarkdown>{message.content}</ReactMarkdown>{" "}
              </div>
            ))}
          <button onClick={archiveChat}>Archive</button>
        </div>
      ) : (
        <button onClick={handleConsult}>Consult</button>
      )}
      <form onSubmit={handleSubmit} className={styles.messageForm}>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          className={styles.inputField}
          disabled={loading} // Disable input during loading
        />
        <button type="submit" disabled={!inputValue || loading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatView;
