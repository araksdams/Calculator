import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

let ai: GoogleGenAI | null = null;

// Initialize the client only if the key is present.
// We do not throw immediately to allow the UI to show a helpful message.
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const solveMathWithGemini = async (input: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key not found. Please check your configuration.");
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: input,
      config: {
        systemInstruction: `You are a highly efficient calculator assistant. 
        Your task is to solve the mathematical expression or answer the natural language query provided by the user.
        
        Rules:
        1. If the input is a math expression (e.g., "5 + 5", "sqrt(16)"), return ONLY the numerical result.
        2. If the input is a unit conversion or natural language query (e.g., "50 USD in EUR", "distance to mars in km"), return the result followed by the unit if applicable.
        3. Be concise. Do not add "Here is the answer" or markdown formatting like bolding.
        4. If the query is non-mathematical or impossible to calculate, return "Error" or a very short (max 5 words) explanation.
        5. For complex calculations, use standard scientific notation if the number is very large or small.
        `,
        temperature: 0.1, // Low temperature for deterministic math results
        maxOutputTokens: 50, // Keep it short
      },
    });

    const text = response.text;
    return text ? text.trim() : "Error";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error";
  }
};