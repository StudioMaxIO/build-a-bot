// /bots/gptBot.js
import axios from "axios";

const temperatureDefault = 0.3;
const systemMessageDefault = "You are a witty and helpful assistant.";

class GPTBot {
  constructor(botName, updateMessages) {
    this.botName = botName;
    this.messages = require(`../data/chats/${botName}.json`).messages;
    this.updateMessages = updateMessages;
    this.fileName = botName;
    this.filePath = `${process.cwd()}/data/chats/${botName}.json`;
    this.filePath2 = `${process.cwd()}data/chats/${botName}.json`;
    this.archiveFilePath = `${process.cwd()}/data/chats/archive/`;
    this.systemMessageExtra = `Only use the functions you have been provided with.
      Any time you require information you do not have access to or have a required task you cannot perform, you should suggest a function that would allow you to gather that information or perform that task.`;
    this.functions = [];
    this.availableFunctions = {};
  }

  // setters
  setSystemMessage(message) {
    this.systemMessage = `${message}\n\n${this.systemMessageExtra}`;
  }

  addFunction(
    functionToCall,
    functionName,
    functionDescription,
    functionParameters
  ) {
    this.functions.push(
      new Object({
        name: functionName,
        description: functionDescription,
        parameters: functionParameters
      })
    );
    this.availableFunctions[functionName] = functionToCall;
  }

  // user functions
  async ask(prompt) {
    let message;
    if (this.messages.length === 0) {
      message = await this.initialResponse(prompt);
    } else {
      message = await this.followUp(prompt);
    }
    return message;
  }

  async consult() {
    let message = await this.consultation();
    return message;
  }

  async evaluate() {
    let message = await this.evaluation();
    return message;
  }

  // save chat log
  async writeToFile(data, reset = true, filePath = this.filePath) {
    try {
      const existingMessages = reset
        ? [] // If reset is true, start with an empty array
        : require(`../data/chats/${this.fileName}.json`).messages; // Otherwise, start with the existing messages

      // Append the new data to the existing messages
      const allMessages = existingMessages.concat(data);

      const result = await axios.post("/api/writeToFile", {
        filePath: filePath,
        data: {
          messages: allMessages
        }
      });

      console.log(result.data.message); // 'File successfully written'
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  }

  async archiveChat() {
    try {
      const datedFileName = `${this.fileName}-${Date.now()}`;
      const archiveFilePath = `${this.archiveFilePath}${datedFileName}.json`;
      const result = await axios.post("/api/writeToFile", {
        filePath: archiveFilePath,
        data: {
          messages: require(`../data/chats/${this.fileName}.json`).messages
        }
      });
      console.log(result.data.message); // 'File successfully written'

      const result2 = await axios.post("/api/writeToFile", {
        filePath: this.filePath,
        data: {
          messages: []
        }
      });
      console.log(result2.data.message);
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  }

  // internal
  async initialResponse(prompt, temperature = temperatureDefault) {
    const initialMessages = [
      {
        role: "system",
        content: this.systemMessage || systemMessageDefault
      },
      {
        role: "user",
        content: prompt
      }
    ];

    this.messages = initialMessages;

    let message = await this.createCompletion(temperature);
    // await this.appendMessagesToFile(this.messages);
    return message;
  }

  async consultation(temperature = temperatureDefault) {
    const systemMessage = {
      role: "system",
      content: `${this.systemMessage || systemMessageDefault}
        Before you can provide the user with advice, you will need to gather some information from them.

        ####
        To begin, you will provide the user with an initial consultation to assess their current situation and future goals and to help them
        understand how to gather and track relevant information pertaining to your specialty and their goals. 
        
        During this consultation you will do the following:
        1. Start the conversation by asking the user for any information you need to guide them. You can ask for any information required to assess their current situation, future goals, or any data in order provide them with the best possible advice in relation to your expertise.
        2. Suggest specific metrics the user should track and deliver to you over time and suggest how often they should provide you with updates. 
        3. You can ask for current information or data on any topic that you need to provide the best possible advice if needed. Feel free to guide the user through the process of providing you with the information you need. Suggest a format such as a spreadsheet or a document that the user can use to provide you with the information you need and give an example of how they can structure the information they should provide you with.
        4. Create a list of functions that would be useful for you to have access to in order to provide the user with the best possible advice in real time. The format of a function is as follows:
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {
                      "type": "string",
                      "enum": ["celsius", "fahrenheit"]
                    },
                },
                "required": ["location"],
            },
        }
        
        You can also ask the user for any other information you need to provide the best possible advice. Once you have established the
        information you need, you can begin to provide the user with advice. 
        
        Provide an overview of the user's current situation and future goals to show your understanding then provide the user with a plan of action to help them achieve their goals.

        Encourage the user to return regularly so you can continue to evaluate their progress and provide them with the best possible advice at each stage of their journey.
        ####
        `
    };
    this.messages = [systemMessage];

    let assistantMessageContent = await this.createCompletion(temperature);

    // Reset the file with both the system and assistant message
    // await this.resetFileWithMessage(this.messages);

    return assistantMessageContent;
  }

  async evaluation(temperature = temperatureDefault) {
    this.messages.push({
      role: "user",
      content: `I have been tracking my progress and I am ready for an evaluation. Let me know
      if there is any additional information you need from me in order to provide an accurate 
      evaluation. If you do not need any more information you can proceed to provide me with an
      evaluation of my current situation, future goals, and progress so far.`
    });
    // await this.appendMessagesToFile([this.messages[this.messages.length - 1]]);
    let message = await this.createCompletion(temperature);
    return message;
  }

  async followUp(prompt, temperature = temperatureDefault) {
    this.messages.push({
      role: "user",
      content: prompt
    });
    // await this.appendMessagesToFile([this.messages[this.messages.length - 1]]);
    let messages = await this.createCompletion(temperature);
    return messages;
  }

  async createCompletion(temperature = temperatureDefault) {
    try {
      const params = {};
      params.model = "gpt-4-0613";
      params.temperature = temperature;
      params.messages = this.messages;
      if (this.functions.length > 0) {
        (params.functions = this.functions), (params.function_call = "auto");
      }
      console.log("GPT params:", params);
      const response = await axios.post("/api/openai", params);
      // const response = await axios.post("/api/openai", {
      //   model: "gpt-4-0613",
      //   temperature: temperature,
      //   messages: this.messages,
      // });
      const responseOutput = response.data.choices
        ? response.data.choices[0]
        : response.data.choices;
      const message = responseOutput.message;
      this.messages.push(message);
      console.log("GPT response:", message);
      if (message.function_call) {
        let result;
        // call function
        let function_to_call =
          this.availableFunctions[message.function_call.name];
        let functionArgs = JSON.parse(message.function_call.arguments);
        try {
          result = await function_to_call(functionArgs);
        } catch (error) {
          result = error;
        }
        // append result to messages
        this.messages.push({
          role: "function",
          name: message.function_call.name,
          content: result
        });
        // call createCompletion again
        await this.createCompletion(temperature);
      } else {
        this.writeToFile(this.messages);
        this.updateMessages(this.messages);
        return message.content;
      }
    } catch (error) {
      console.error("GPT error:", error);
    }
  }

  clearMessages() {
    this.messages = [];
  }
}

module.exports = GPTBot;
