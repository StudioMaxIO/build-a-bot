import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class YourBot extends GPTBot {
  constructor() {
    // Change the name of your bot here. This is how it will be referenced throughout the app.
    super("YourBot");
    // Set the system message to describe your bot.
    this.setSystemMessage(`You are a template of a GPT chatbot...`);
    // Add functions from botFunctions.js
    this.accessFunctions([functions.getCurrentDate]);
    // Add custom functions
    this.addFunction(myFunction, "myFunction", "Description of myFunction", {
      type: "object",
      properties: {
        // Add parameters. if none, pass empty object
        someInput: {
          type: "string",
          description: "Some input to myFunction"
        },
        someOtherInput: {
          type: "string",
          description: "Some other input to myFunction",
          enum: ["option1", "option2", "option3"] // can be used to limit input to a set of options
        },
        someOptionalInput: {
          type: "string",
          description: "Some optional input to myFunction"
        }
      },
      required: ["someInput", "someOtherInput"] // Add required parameters here
    });
  }
}

function myFunction(args) {
  // Add function logic here
  console.log("myFunction called with args:", args);
  const response = {
    output: "Hello World!"
  };
  // Return should always be a string. Objects can be stringified.
  return JSON.stringify(response, null, 2);
}

export default YourBot;
