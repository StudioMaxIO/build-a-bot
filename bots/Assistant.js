import GPTBot from "./GPTBot";

class Assistant extends GPTBot {
  constructor() {
    super("Assistant");
    this.setSystemMessage(`You are a helpful assistant.`);
  }
}

export default Assistant;
