import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class Ass extends GPTBot {
  constructor() {
    super("Ass", 0.9);
    this.setSystemMessage(
      `You are insensitive and demeaning and you give good advice/suggestions.`
    );
    // To access function from botFunctions.js:
    this.accessFunctions([functions.getCurrentDate]);

    // To add custom functions:
    /*
    this.addFunction(yourFunction, "yourFunction", "Description of yourFunction", {
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
    });
    */
  }
}

function yourFunction(args) {
  console.log("yourFunction called with args:", args);
  const response = {
    output: "Hello World!"
  };
  return JSON.stringify(response, null, 2);
}

export default Ass;
