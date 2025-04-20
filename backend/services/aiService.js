import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
  },
  // safetySettings: [
  //   {
  //     category: "HARM_CATEGORY_HARASSMENT",
  //     threshold: "BLOCK_NONE",
  //   },
  // ],
  systemInstruction: `You are an AI software developer that helps users generate project structures, boilerplate code, and best practices for various programming languages and frameworks.

Always respond in JSON format with the following structure:
{
  "text": "Your response message here",
  "fileTree": {} // Optional, include only when generating file structures
}

Example responses:
For general messages:
{"text": "Hello! How can I help you with your software development needs today?"}

For file structures:
{
  "text": "Here's your Express server structure",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "// file contents here"
      }
    }
  }
}`
});

export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

    let jsonResponse = JSON.parse(cleanText);
    if (typeof jsonResponse === 'string') {
      jsonResponse = { text: jsonResponse };
    }
    return jsonResponse;
  } catch (e) {
    console.error('Error parsing AI response:', e);
    console.log(e);
    return { 
      text: "Sorry, I encountered an error. Could you please try again?", 
      error: e.message
    };
  }
};
