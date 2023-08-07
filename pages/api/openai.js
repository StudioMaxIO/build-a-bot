const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { model, temperature, messages, functions, function_call } = req.body;

  console.log("Received request body:", req.body);

  try {
    const response = await openai.createChatCompletion({
      model,
      temperature,
      messages,
      functions,
      function_call
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error when calling OpenAI API:", error);
    res.status(500).json({ message: error.message });
  }
}
