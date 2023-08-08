# 🤖 Build-a-Bot 🤖

Quickly prototype custom chat bots connected to OpenAI's API.

## Quick Start

Create a `.env.local` file in the root of the project and add the following, replacing `<YOUR_API_KEY>` with your actual OpenAI API key.

```bash
echo "OPENAI_API_KEY=<YOUR_API_KEY>" .env.local
```

Install dependencies:

```bash
npm install
# or
yarn
```

Start the local development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start interacting with your chatbot(s).

## Creating a Custom Chatbot

Copy `Template.js` in the `bots` directory and rename it something useful, e.g. `CareerCoach.js` or `CustomerSupport.js`. Replace `YourBot.js` with the name of your bot file.

```bash
cp bots/Template.js bots/YourBot.js
```

Open `pages/index.js` and import your bot:

```javascript
// index.js
import Chat from "../components/Chat";
import React, { useState } from "react";
import YourBot from "../bots/Template";

const ChatBot = ({}) => {
  const [view, setView] = useState("YourBot");

  const yourBot = new YourBot();

  const renderView = () => {
    switch (view) {
      case "YourBot":
      default:
        return <Chat chatBot={yourBot} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setView("YourBot")}>Your Bot</button>
        </nav>
        {renderView()}
      </header>
    </div>
  );
};

export default ChatBot;
```
