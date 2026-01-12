
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const fetchMusicRecommendations = async (theme: string): Promise<Song[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    당신은 세계적인 음악 큐레이터이자 에디터입니다. 
    사용자가 입력한 테마: "${theme}"에 맞춰 출퇴근 시간(지하철, 버스 등)에 듣기 좋은 음악 7곡을 추천해주세요.
    
    규칙:
    1. 총 7곡을 선정하세요.
    2. 한국어 노래(K-pop 포함) 5곡, 해외 노래(Pop/Rock 등) 2곡으로 비율을 5:2(약 7:3)로 맞추세요.
    3. 각 노래가 왜 이 테마와 출퇴근 상황에 어울리는지 감각적인 에디터의 문체로 한 문장씩 설명해주세요.
    4. 노래 제목과 가수 이름은 정확해야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
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
                  origin: { 
                    type: Type.STRING,
                    description: "Korean or International"
                  },
                },
                required: ["title", "artist", "reason", "origin"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const jsonStr = response.text;
    const parsed = JSON.parse(jsonStr);
    return parsed.recommendations;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
