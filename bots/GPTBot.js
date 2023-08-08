import axios from "axios";

const systemMessageDefault = "You are a helpful assistant.";

class GPTBot {
  constructor(botName, temperature = 0.1, updateMessages) {
    this.temperatureDefault = temperature;
    this.botName = botName;

    this.updateMessages = updateMessages;
    this.fileName = botName;
    this.filePath = `${process.cwd()}/data/chats/${botName}.json`;
    this.filePath2 = `${process.cwd()}data/chats/${botName}.json`;
    this.archiveFilePath = `${process.cwd()}/data/archive/`;

    let chatLog;

    try {
      chatLog = require(`../data/chats/${botName}.json`);
      this.messages = chatLog.messages;
    } catch (error) {
      // console.error(`Error loading chat log: ${error}`);
      this.messages = [];

      const axios = require("axios");
      axios
        .post("/api/writeToFile", {
          filePath: this.filePath,
          data: { messages: this.messages }
        })
        .then((response) => {
          console.log(`Successfully wrote ${botName} to file: ${response}`);
        })
        .catch((error) => {
          console.error(`Error writing ${botName} to file: ${error}`);
        });
    }

    this.systemMessageExtra = `
      Always use the functions you have been provided with to gather information before you ask the user for anything. The user should only be prompted for information that you cannot gather yourself.

      Any time you require information you do not have access to or have a required task you cannot perform using your available functions, you should suggest a function that would allow you to gather that information or perform that task. These should be functions that you currently do not have access to. If you already have access, do not request a function.
      
      Functions should be realistic with a tangible return value. Here are some examples:
      ####
      Good function: "Search the internet for the best De-Fi projects. Return a list of top 5 projects by market cap." 
      Bad function: "Incentivize early holders to contribute to the liquidity pool." 
      
      Good function: "Send an email to someone with a particular message.
      Bad function: "Create and manage social media accounts, a function to manage these social media accounts and engage with the community."
      ####`;
    this.consultationMessage = `Before you can provide the user with advice, you may need to gather some information from them.

    To begin, you will provide the user with an initial consultation to assess their current situation and future goals and to help them understand how to gather and track relevant information pertaining to your specialty and their goals. 
    
    During this consultation you will do go through the following steps. As you perform each step, you do not need to describe what you are doing, just do it. You can describe what you are doing if you want to, but it is not necessary. Always speak in your own voice.

    ####
    1. Think about what information you might need that you will be able to gather from your provided functions. Do not output this information to the user, just think about it.
    
    2. Introduce yourself and ask the user for any information you will still need beyond those functions in order to guide them and provide the best possible advice in relation to your expertise.
    
    3. Suggest specific metrics the user should track and deliver to you over time and suggest how often they should provide you with updates. 
    
    4. You can ask for data on any topic that you need to provide the best possible advice if needed. Feel free to guide the user through the process of providing you with the information you need. For example, you might suggest a spreadsheet format that the user can use and give an example of how they can structure the information they should provide you with.
    
    5. If you will regularly need access to more information than your provided functions can deliver, create a list of any additional functions that would be useful for you to have access to. The format of a function is as follows:
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
    ####

    Wait for the user to provide you with any information or followup questions before you continue.
    
    ***Only after the user has responded and you have received any information from your available functions, you can provide the user with advice.***
    
    Here is how you will respond after the user has responded and you have gathered your information. Do not speak these exact words, follow the instructions in your own voice:
    ####
    Provide an overview of the user's current situation and future goals to show your understanding then provide the user with a plan of action to help them achieve their goals.

    Encourage the user to return regularly so you can continue to evaluate their progress and provide them with the best possible advice at each stage of their journey.
    ####
    `;
    this.functions = [];
    this.availableFunctions = {};
  }

  // set the system message
  setSystemMessage(message) {
    this.systemMessage = `${message}\n\n${this.systemMessageExtra}`;
  }

  // add a custom function
  addFunction(
    functionToCall,
    functionName,
    functionDescription,
    functionParameters
  ) {
    // first, make sure function doesn't already exist in availableFunctions
    if (this.availableFunctions[functionName]) {
      console.log(
        `Function ${functionName} already exists. Please choose a different name.`
      );
      return;
    } else {
      this.functions.push(
        new Object({
          name: functionName,
          description: functionDescription,
          parameters: functionParameters
        })
      );
      this.availableFunctions[functionName] = functionToCall;
    }
  }

  // set access to existing functions
  // functions is an array of objects with they keys: function, name, description, parameters
  accessFunctions(functions) {
    for (let func of functions) {
      if (
        func &&
        func.function &&
        func.name &&
        func.description &&
        func.parameters &&
        !this.availableFunctions[func.name]
      ) {
        this.addFunction(
          func.function,
          func.name,
          func.description,
          func.parameters
        );
      }
    }
    // console.log("available functions:", this.availableFunctions);
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

      console.log(result.data.message);
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
      console.log(result.data.message);

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

  // internal prompt functions
  async initialResponse(prompt, temperature = this.temperatureDefault) {
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
    return message;
  }

  async consultation(temperature = this.temperatureDefault) {
    const systemMessage = {
      role: "system",
      content: `${this.systemMessage || systemMessageDefault}
      ${this.consultationMessage}`
    };
    this.messages = [systemMessage];

    let assistantMessageContent = await this.createCompletion(temperature);

    return assistantMessageContent;
  }

  async evaluation(temperature = this.temperatureDefault) {
    this.messages.push({
      role: "user",
      content: `I have been tracking my progress and I am ready for an evaluation. Let me know
      if there is any additional information you need from me in order to provide an accurate 
      evaluation. If you do not need any more information you can proceed to provide me with an
      evaluation of my current situation, future goals, and progress so far.`
    });
    let message = await this.createCompletion(temperature);
    return message;
  }

  async followUp(prompt, temperature = this.temperatureDefault) {
    this.messages.push({
      role: "user",
      content: prompt
    });
    let messages = await this.createCompletion(temperature);
    return messages;
  }

  async createCompletion(temperature = this.temperatureDefault) {
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
      const responseOutput = response.data.choices
        ? response.data.choices[0]
        : response.data.choices;
      const message = responseOutput.message;
      console.log("Going to push message:", message);

      this.messages.push(message);
      console.log("GPT response:", message);
      if (message.function_call) {
        console.log("GPT function call:", message.function_call.name);
        let result;
        // call function
        let function_to_call =
          this.availableFunctions[message.function_call.name];
        let functionArgs = JSON.parse(message.function_call.arguments);
        try {
          console.log("GPT function args:", functionArgs);
          result = await function_to_call(functionArgs);
        } catch (error) {
          result = error;
        }
        console.log("GPT function result:", result);
        // append result to messages
        this.messages.push({
          role: "function",
          name: message.function_call.name,
          content: result
        });

        console.log("Calling createCompletion again");
        // call createCompletion again
        await this.createCompletion(temperature);
      } else {
        await this.writeToFile(this.messages);
        await this.updateMessages(this.messages);
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
