import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface RenovationAdvice {
  title: string;
  description: string;
  styles: string[];
  tips: string[];
}

export async function getRenovationAdvice(prompt: string): Promise<RenovationAdvice> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Tu es un expert en architecture d'intérieur et en rénovation pour "Spoof BTP & Adhésif". 
    Un client décrit son projet : "${prompt}".
    Fournis des conseils structurés en JSON avec les champs suivants :
    - title: Un titre accrocheur pour le projet.
    - description: Une description inspirante des possibilités.
    - styles: Une liste de 3 styles architecturaux recommandés.
    - tips: 3 conseils pratiques pour réussir cette rénovation.
    Réponds uniquement en JSON.`,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}") as RenovationAdvice;
  } catch (e) {
    console.error("Failed to parse advice", e);
    return {
      title: "Votre Projet de Rénovation",
      description: "Nous analysons vos besoins pour vous proposer les meilleures solutions.",
      styles: ["Moderne", "Classique", "Industriel"],
      tips: ["Consultez un expert", "Définissez votre budget", "Choisissez des matériaux durables"],
    };
  }
}

export async function generateVisualIdea(prompt: string, style: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          text: `A high-quality architectural visualization of a renovation project: ${prompt}. Style: ${style}. Professional photography, interior design magazine style, soft natural lighting, elegant atmosphere.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
