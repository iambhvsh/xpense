import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, ReceiptData, Category } from "../types";

const getApiKey = () => {
  return localStorage.getItem('xpense-api-key') || process.env.API_KEY || '';
};

const createAI = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
};

export const analyzeReceipt = async (
  base64Image: string, 
  mimeType: string = 'image/jpeg'
): Promise<ReceiptData> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please add your Gemini API key in Settings.");
  }
  
  const ai = createAI();
  
  const prompt = `Extract the merchant name, transaction date (YYYY-MM-DD format), and total amount (in INR/₹) from this receipt image.
  The currency is Indian Rupee. Look for 'Total', 'Amount', 'Grand Total'.
  Also, suggest the most appropriate category from this list: Food, Transport, Shopping, Utilities, Entertainment, Health, Other.
  Return pure JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            date: { type: Type.STRING },
            total: { type: Type.NUMBER },
            category: { type: Type.STRING, enum: Object.values(Category) },
            items: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["total", "merchant"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ReceiptData;
  } catch (error) {
    console.error("Gemini Receipt Analysis Error:", error);
    throw error;
  }
};

export const generateInsights = async (transactions: Transaction[]): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Please add your Gemini API key in Settings to get AI insights.";
  if (transactions.length === 0) return "No transactions found to analyze.";

  const ai = createAI();
  
  const summary = transactions.map(t => 
    `${t.date.split('T')[0]}: ${t.description} - ₹${t.amount} (${t.category})`
  ).join('\n');

  const prompt = `You are a financial assistant. Analyze these transactions (in Indian Rupees ₹).
  Provide 3 short, encouraging, and actionable tips to save money.
  Keep the tone friendly and professional (Apple-style).
  Do not use Markdown headers. Just plain text or bullet points.
  
  Transactions:
  ${summary}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights right now.";
  }
};

export const suggestCategory = async (description: string): Promise<Category> => {
  const apiKey = getApiKey();
  if (!apiKey) return Category.OTHER;
  
  const ai = createAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Categorize this expense: "${description}". 
      Options: ${Object.values(Category).join(', ')}. 
      Return only the category name.`,
      config: {
        responseMimeType: "text/plain"
      }
    });
    
    const text = response.text?.trim();
    const foundCategory = Object.values(Category).find(
      c => c.toLowerCase() === text?.toLowerCase()
    );
    return foundCategory || Category.OTHER;
  } catch (error) {
    return Category.OTHER;
  }
};
