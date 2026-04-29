import { GoogleGenAI } from "@google/genai";

const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
const apiKeys = keysStr.split(',').map(k => k.trim()).filter(Boolean);

let currentKeyIndex = 0;

export function getGeminiClient() {
  if (apiKeys.length === 0) {
    return new GoogleGenAI({});
  }
  const key = apiKeys[currentKeyIndex];
  return new GoogleGenAI({ apiKey: key });
}

export function rotateKey() {
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`[Gemini API] Switched to API Key index: ${currentKeyIndex}`);
  }
}

// Default export for backward compatibility
const ai = getGeminiClient();
export default ai;
