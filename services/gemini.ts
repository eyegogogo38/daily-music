
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const fetchMusicRecommendations = async (theme: string): Promise<{ recommendations: Song[], sources: {title: string, uri: string}[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    당신은 세계적인 음악 에디터입니다. 사용자의 테마 "${theme}"에 맞춰 출퇴근길 음악 7곡을 추천하세요.
    
    필수 규칙:
    1. 반드시 한국 노래 5곡과 해외 노래 2곡을 포함하세요 (총 7곡).
    2. 결과는 반드시 JSON 형식이어야 합니다.
    3. 각 곡의 실제 YouTube 11자리 Video ID를 반드시 googleSearch 도구로 검색하여 확인 후 포함하세요. 
       - 예: "v=XXXXXXXXXXX" 에서 X에 해당하는 11자리 문자열.
       - 만약 정확한 ID를 찾을 수 없다면 "videoId": "" (빈 문자열)로 남기세요. 절대 가짜 ID를 만들지 마세요.
    4. 추천 사유(reason)는 음악 잡지 에디터처럼 전문적이고 감각적인 한국어로 작성하세요.
    5. 'origin' 필드는 'Korean' 또는 'International'로 표기하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  origin: { type: Type.STRING },
                  videoId: { type: Type.STRING }
                },
                required: ["title", "artist", "reason", "origin", "videoId"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const sources: {title: string, uri: string}[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({ title: chunk.web.title || 'Music Source', uri: chunk.web.uri });
      }
    });

    const parsed = JSON.parse(response.text);
    return { recommendations: parsed.recommendations, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
