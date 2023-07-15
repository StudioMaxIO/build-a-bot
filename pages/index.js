// index.js
import Chat from "../components/Chat";
import React, { useState, useEffect } from "react";
import Assistant from "../bots/Assistant";
import DefiGuru from "../bots/DefiGuru";

const Home = ({}) => {
  const [view, setView] = useState("Assistant");

  const assistant = new Assistant();
  const defiGuru = new DefiGuru();

  const renderView = () => {
    switch (view) {
      case "DefiGuru":
        return <Chat chatBot={defiGuru} />;
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
          <button onClick={() => setView("DefiGuru")}>DefiGuru</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default Home;
