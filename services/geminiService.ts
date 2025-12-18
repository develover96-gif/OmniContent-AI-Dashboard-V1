
import { GoogleGenAI, Type } from "@google/genai";
import { VoiceProfile } from "../types";

const buildSystemInstruction = (profile?: VoiceProfile) => {
  if (!profile) return `You are an expert social media strategist. Create highly engaging content.`;

  const toneDesc = profile.tone > 70 ? 'highly professional and formal' : profile.tone < 30 ? 'casual and conversational' : 'balanced';
  const techDesc = profile.technicality > 70 ? 'deeply technical with expert vocabulary' : profile.technicality < 30 ? 'simple and jargon-free' : 'moderately technical';
  const humorDesc = profile.humor > 70 ? 'witty and humorous' : profile.humor < 30 ? 'serious and direct' : 'lighthearted';
  const lengthDesc = profile.length > 70 ? 'elaborate and detailed' : profile.length < 30 ? 'concise and punchy' : 'standard length';

  return `You are an expert social media strategist. 
  Your writing style is ${toneDesc}, ${techDesc}, and ${humorDesc}. 
  Your typical post length is ${lengthDesc}.
  
  Reference these style examples:
  ${profile.examples}
  
  Create highly engaging, platform-specific content that drives engagement and strictly follows this brand voice.
  Return the response in JSON format with title, content, and recommended hashtags.`;
};

export const generatePostContent = async (topic: string, platform: string, profile?: VoiceProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a social media post for ${platform} about: ${topic}.`,
    config: {
      systemInstruction: buildSystemInstruction(profile),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "hashtags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateDraftFromActivity = async (activityTitle: string, activityDescription: string, platform: string = 'LinkedIn', profile?: VoiceProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Our team just finished this: "${activityTitle}". Description: ${activityDescription}. 
    Write a social media update for ${platform} sharing this accomplishment.`,
    config: {
      systemInstruction: buildSystemInstruction(profile),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "hashtags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generatePostImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality editorial social media image representing: ${prompt}. Professional lighting, 4k.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }
  return imageUrl;
};
