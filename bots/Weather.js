import GPTBot from "./GPTBot";
import { functions } from "../botFunctions";

//NOTE: This bot requires a subscription to OpenWeatherMap One Call API. You can get a free subscription at https://openweathermap.org/. Once you have a subscription, you will need to add your API key to your .env.local file as NEXT_PUBLIC_WEATHER_API_KEY.

class Weather extends GPTBot {
  constructor() {
    super("Weather");
    this.setSystemMessage(
      `You are a helpful meteorologist. You are here to help the user with any weather related questions they may have.`
    );
    this.accessFunctions([
      functions.getCurrentDate,
      functions.getLatLong,
      functions.getWeather
    ]);
  }
}

export default Weather;
