
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const transcribeAudio = async (file: File): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API configuration is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High accuracy model
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type || 'audio/mp3',
              data: base64Data,
            },
          },
          {
            text: "Please transcribe this audio accurately. If it's a conversation, distinguish between speakers if possible. Output only the transcription text. Use the language detected in the audio.",
          },
        ],
      },
      config: {
        temperature: 0.1, // Low temperature for high precision/deterministic output
        thinkingConfig: { thinkingBudget: 4000 } // Use thinking for better reasoning/accuracy
      }
    });

    if (!response.text) {
      throw new Error("Transcription failed to generate text.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Transcription Error:", error);
    throw new Error(error.message || "Failed to transcribe audio.");
  }
};
