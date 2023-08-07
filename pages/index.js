// index.js
import Chat from "../components/Chat";
import React, { useState, useEffect } from "react";
import WeatherBot from "../bots/Weather";

const Home = ({}) => {
  const [view, setView] = useState("Assistant");

  const weatherBot = new WeatherBot();

  const renderView = () => {
    // add more cases for more bots
    switch (view) {
      case "WeatherBot":
      default:
        return <Chat chatBot={weatherBot} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setView("WeatherBot")}>Weather</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default Home;
