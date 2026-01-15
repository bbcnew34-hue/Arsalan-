
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFrame = async (base64Image: string, prompt: string = "Analyze this video frame. Describe what is happening, detect objects, and identify the mood. Return the result in a clear, concise paragraph.") => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze frame. Check your connection or API key.";
  }
};

export const summarizeTranscript = async (text: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize the following video transcript/description concisely: ${text}`
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Could not generate summary.";
    }
}
