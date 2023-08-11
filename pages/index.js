// index.js
import Chat from "../components/Chat";
import React, { useState } from "react";
import YourBot from "../bots/Template";
// import WeatherBot from "../bots/Weather";
// import WhetherBot from "../bots/Whether";

const ChatBot = ({}) => {
  const [view, setView] = useState("YourBot");

  const yourBot = new YourBot();
  // const weatherBot = new WeatherBot();
  // const whetherBot = new WhetherBot();

  const renderView = () => {
    switch (view) {
      /* 
      case "WhetherBot":
         return <Chat chatBot={whetherBot} />;
      */
      /*
      case "WeatherBot":
         return <Chat chatBot={weatherBot} />;
      */
      case "YourBot":
      default:
        return <Chat chatBot={yourBot} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <nav>
          <button onClick={() => setView("WeatherBot")}>Weather</button>
        </nav> */}
        {/* <nav>
          <button onClick={() => setView("WhetherBot")}>Whether</button>
        </nav> */}
        <nav>
          <button onClick={() => setView("YourBot")}>Your Bot</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default ChatBot;
