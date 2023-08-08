# 🤖💬 Build-a-Bot 🤖💬

### _Quickly prototype custom chatbots connected to OpenAI's API._

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

### Create a New Bot File

Copy `Template.js` in the `bots` directory and rename it something useful, e.g. `CareerCoach.js` or `CustomerSupport.js`. Replace `YourBot.js` with the name of your bot file.

```bash
cp bots/Template.js bots/YourBot.js
```

### Customize Your Bot

```javascript
import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class YourBot extends GPTBot {
  constructor() {
    // Change the name of your bot here. This is how it will be referenced throughout the app.
    // Second argument is the default temperature to use for this bot.
    super("YourBot", 0.2);
    // You can also set the temperature with the temperatureDefault property.
    this.temperatureDefault = 0.2;
    // Set the system message to describe your bot.
    this.setSystemMessage(`You are a template of a GPT chatbot...`);
    // Add functions from botFunctions.js
    this.accessFunctions([functions.getCurrentDate]);
    // Add custom functions
    this.addFunction(
      yourFunction,
      "yourFunction",
      "Description of yourFunction",
      {
        type: "object",
        properties: {
          // Add parameters. if none, pass empty object
          someInput: {
            type: "string",
            description: "Some input to yourFunction"
          },
          someOtherInput: {
            type: "string",
            description: "Some other input to yourFunction",
            enum: ["option1", "option2", "option3"] // can be used to limit input to a set of options
          },
          someOptionalInput: {
            type: "string",
            description: "Some optional input to yourFunction"
          }
        },
        required: ["someInput", "someOtherInput"] // Add required parameters here
      }
    );
  }
}

function yourFunction(args) {
  // Add function logic here
  console.log("yourFunction called with args:", args);
  const response = {
    output: "Hello World!"
  };
  // Should always return a string. Objects can be stringified.
  return JSON.stringify(response, null, 2);
}

export default YourBot;
```

### Import Your Chatbot

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
