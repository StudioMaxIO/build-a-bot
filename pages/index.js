// index.js
import Chat from "../components/Chat";
import React, { useState, useEffect } from "react";
import Assistant from "../bots/Assistant";

const Home = ({}) => {
  const [view, setView] = useState("Assistant");

  const assistant = new Assistant();

  const renderView = () => {
    switch (view) {
      case "Assistant":
      default:
        return <Chat chatBot={assistant} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setView("Assistant")}>Assistant</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default Home;
