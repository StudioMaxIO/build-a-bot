import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class YourBot extends GPTBot {
  constructor() {
    super("YourBotName");
    this.setSystemMessage(`You are a...`);
    this.accessFunctions([functions.getCurrentDate]);
  }
}

export default YourBot;
