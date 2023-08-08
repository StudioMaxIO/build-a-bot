// Common functions available for any bot

import axios from "axios";
require("dotenv").config();

module.exports.functions = {
  getCurrentDate: {
    function: () => {
      return new Date().toISOString();
    },
    name: "getCurrentDate",
    description: "Get the current date.",
    parameters: {
      type: "object",
      properties: {}
    }
  }
};

module.exports.functions = {
  getCurrentDate: {
    function: () => {
      return new Date().toISOString();
    },
    name: "getCurrentDate",
    description: "Get the current date.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  getWeather: {
    function: async (args) => {
      const lat = args.lat;
      const lon = args.lon;
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (apiKey) {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        try {
          const response = await axios.get(url);
          return JSON.stringify(response.data);
        } catch (error) {
          return JSON.stringify(error);
        }
      } else {
        return "No OpenWeather API key found. Make sure to set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file.";
      }
    },
    name: "getWeather",
    description: "Get the current weather for a specified city.",
    parameters: {
      type: "object",
      properties: {
        lat: {
          type: "string",
          description: "The latitude of the location for which to get weather."
        },
        lon: {
          type: "string",
          description: "The longitude of the location for which to get weather."
        }
      }
    }
  },
  getLatLong: {
    function: async (args) => {
      const city = args.city;
      const stateCode = args.stateCode;
      const countryCode = args.countryCode;
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const limit = 1;
      if (apiKey) {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;
        try {
          const response = await axios.get(url);
          return JSON.stringify(response.data);
        } catch (error) {
          return JSON.stringify(error);
        }
      } else {
        return "No OpenWeather API key found. Make sure to set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file.";
      }
    },
    name: "getLatLong",
    description: "Get the latitude and longitude for a specified city.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city for which to get latitude and longitude."
        },
        stateCode: {
          type: "string",
          description:
            "The state code (US only) for which to get latitude and longitude."
        },
        countryCode: {
          type: "string",
          description:
            "The ISO 3166 country code for which to get latitude and longitude."
        }
      },
      required: ["city", "stateCode", "countryCode"]
    }
  },

  pickOneOfEach: {
    function: (args) => {
      const choices = args.choices ? args.choices : [];
      const selections = {};
      for (let i = 0; i < choices.length; i++) {
        const choiceGroup = choices[i];
        const options = choiceGroup.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        const optionChoice = options[randomIndex];
        selections[choiceGroup.category] = optionChoice;
      }
      // always return a string for GPT compatibility
      return JSON.stringify(selections);
    },
    name: "pickOneOfEach",
    description:
      "Selects an item at random from each group of choices and returns the selections.",
    parameters: {
      type: "object",
      properties: {
        choices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "The category of the choice group."
              },
              options: {
                type: "array",
                items: {
                  type: "string",
                  description: "The options to choose from."
                }
              }
            }
          },
          description: "The choices to pick from and corresponding categories."
        }
      },
      required: ["choices"]
    }
  }
};
