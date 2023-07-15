import GPTBot from "./GPTBot";

class YourBot extends GPTBot {
  constructor() {
    super("YourBotName");
    this.setSystemMessage(`Explain what your bot does here.`);
  }
}

export default Assistant;
