import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize safe client - checking key presence in components
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBlogContent = async (title: string, context?: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  const model = "gemini-2.5-flash";
  const prompt = `
    You are a fun, witty, and engaging blog writer for a cartoon-styled tech blog.
    Write a blog post content (Markdown format) for the title: "${title}".
    ${context ? `Additional context/instructions: ${context}` : ''}
    Keep it lighthearted, maybe use some emojis, and structure it with H2 headings. 
    Keep it under 300 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const generateSummary = async (content: string): Promise<string> => {
  if (!ai) throw new Error("API Key missing");
  
  const model = "gemini-2.5-flash";
  const prompt = `
    Summarize the following blog post in 2 sentences. Make it sound exciting!
    
    Content:
    ${content.substring(0, 1000)}...
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    throw error;
  }
};

export const getChatSession = (): Chat => {
  if (!ai) throw new Error("API Key missing");
  
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
        systemInstruction: "You are a helpful, witty, and slightly cartoonish assistant living inside a blog. Keep answers concise and fun."
    }
  });
};
