// components/ChatView.js
import React, { useState, useEffect } from "react";
import styles from "./ChatView.module.css";
import ReactMarkdown from "react-markdown";

const ChatView = ({ chatBot }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

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
    console.log("Consulting...");
    await chatBot.consult();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting prompt:", inputValue);
    await chatBot.ask(inputValue);
    setInputValue("");
  };

  const archiveChat = async () => {
    console.log("Archiving...");
    // Implementation of archiveChat function goes here
    await chatBot.archiveChat();
    setMessages(chatBot.messages);
  };

  return (
    <div className={styles.container}>
      <h2>{chatBot.botName}</h2>
      {messages &&
      messages.length > 0 &&
      !messages.every((message) => message.role === "system") ? (
        <div>
          {messages
            .filter((message) => message.role !== "system") // Exclude system messages
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
        />
        <button type="submit" disabled={!inputValue}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChatView;
