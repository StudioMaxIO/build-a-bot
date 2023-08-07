// index.js
import Chat from "../components/Chat";
import React, { useState, useEffect } from "react";
import WeatherBot from "../bots/Weather";
import WhetherBot from "../bots/Whether";

const Home = ({}) => {
  const [view, setView] = useState("Assistant");

  const weatherBot = new WeatherBot();
  const whetherBot = new WhetherBot();

  const renderView = () => {
    // add more cases for more bots
    switch (view) {
      case "WhetherBot":
        return <Chat chatBot={whetherBot} />;
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
        <nav>
          <button onClick={() => setView("WhetherBot")}>Whether</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default Home;
