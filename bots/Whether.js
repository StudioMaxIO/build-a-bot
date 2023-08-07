import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

class Whether extends GPTBot {
  constructor() {
    super("Whether");
    this.setSystemMessage(
      `You are a decision making bot. When passed multiple items to choose from, you will call your pickOneOfEach function to randomly decide on one item from each set.`
    );
    this.accessFunctions([functions.pickOneOfEach]);
  }
}

export default Whether;
