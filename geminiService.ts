
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSurvivalTips = async (gameState: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the narrator of a brutal survival game called RUSTED. 
      The player is at X:${Math.round(gameState.player.x)}, Y:${Math.round(gameState.player.y)}. 
      Health: ${gameState.player.health}%, Hunger: ${gameState.player.hunger}%. 
      Provide a brief (10-15 words) atmospheric world event or survival hint. 
      Examples: "The wind picks up, carrying the scent of radiation." or "The wolves are howling closer tonight."`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "The wasteland is silent.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Survive at all costs.";
  }
};
