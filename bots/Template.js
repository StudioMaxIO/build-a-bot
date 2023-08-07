import GPTBot from "./GPTBot";

class YourBot extends GPTBot {
  constructor() {
    super("YourBotName");
    this.setSystemMessage(`You are a...`);
  }
}

export default YourBot;
