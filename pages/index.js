// index.js
import Chat from "../components/Chat";
import React, { useState, useEffect } from "react";

const Home = ({}) => {
  const [view, setView] = useState("Chat");

  const renderView = () => {
    switch (view) {
      case "Chat":
      default:
        return <Chat />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setView("Chat")}>Chat</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default Home;
