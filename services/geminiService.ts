
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

// Fix: Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFoodRecommendation = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this menu: ${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, desc: p.description, price: p.price })))}
      User request: "${userPrompt}"
      Recommend 2 items that best fit the request. Explain why concisely.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["name", "reason"]
          }
        }
      }
    });

    // Fix: Access response.text as a property and handle potential undefined values
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
