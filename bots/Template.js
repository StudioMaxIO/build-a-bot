import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class YourBot extends GPTBot {
  constructor() {
    super("YourBot", 0.1);
    this.setSystemMessage(`You are a template of a GPT chatbot...`);
    // To access function from botFunctions.js:
    // this.accessFunctions([functions.getCurrentDate]);

    // To add custom functions:
    /*
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
    */
  }
}

function myFunction(args) {
  console.log("myFunction called with args:", args);
  const response = {
    output: "Hello World!"
  };
  return JSON.stringify(response, null, 2);
}

export default YourBot;
