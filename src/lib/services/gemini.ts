/**
 * Gemini AI Service
 * 
 * This service integrates Google's Gemini 2.5 Flash model for AI-powered features:
 * 1. Receipt Scanning - OCR with automatic currency conversion using Google Search
 * 2. Financial Insights - Personalized spending analysis
 * 3. Smart Categorization - Context-aware expense categorization
 * 
 * Key Features:
 * - Currency: Supports 10 currencies with automatic conversion
 * - Date Format: Returns dates in user's preferred format
 * - Regional Context: Considers spending patterns based on currency region
 * - Google Search Grounding: Fetches real-time exchange rates for accurate conversion
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, ReceiptData, Category } from "../types";

const getApiKey = () => {
  return localStorage.getItem('xpense-api-key') || process.env.API_KEY || '';
};

const createAI = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
};

// Currency configuration - supports 10 major currencies
const CURRENCY_INFO: Record<string, { name: string; symbol: string; code: string }> = {
  'USD': { name: 'US Dollar', symbol: '$', code: 'USD' },
  'EUR': { name: 'Euro', symbol: '€', code: 'EUR' },
  'GBP': { name: 'British Pound', symbol: '£', code: 'GBP' },
  'JPY': { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  'CNY': { name: 'Chinese Yuan', symbol: '¥', code: 'CNY' },
  'INR': { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  'CAD': { name: 'Canadian Dollar', symbol: '$', code: 'CAD' },
  'AUD': { name: 'Australian Dollar', symbol: '$', code: 'AUD' },
  'CHF': { name: 'Swiss Franc', symbol: 'Fr', code: 'CHF' },
  'KRW': { name: 'South Korean Won', symbol: '₩', code: 'KRW' },
};

const getUserCurrency = () => {
  const currencyCode = localStorage.getItem('xpense-currency') || 'USD';
  return CURRENCY_INFO[currencyCode] || CURRENCY_INFO['USD'];
};

const getUserDateFormat = () => {
  return localStorage.getItem('xpense-date-format') || 'MM/DD/YYYY';
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
  const userCurrency = getUserCurrency();
  const dateFormat = getUserDateFormat();
  
  // Get current date for context
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  
  try {
    // Two-step approach required because Gemini API doesn't support
    // Google Search tools with structured JSON output (responseMimeType: "application/json")
    
    // Step 1: Detect currency and get exchange rate using Google Search
    const detectionPrompt = `Analyze this receipt image and identify:
1. The currency shown on the receipt (look for symbols: $, €, £, ¥, ₹, Fr, ₩, etc.)
2. The total amount
3. If the currency is NOT ${userCurrency.code}, use Google Search to find the current exchange rate.

Search query format: "1 [DETECTED_CURRENCY] to ${userCurrency.code} exchange rate today"

Return ONLY a JSON object with:
{
  "detectedCurrency": "XXX",
  "originalAmount": 123.45,
  "exchangeRate": 1.23,
  "convertedAmount": 152.05
}

If the currency is already ${userCurrency.code}, set exchangeRate to 1 and convertedAmount equal to originalAmount.`;

    const detectionResponse = await ai.models.generateContent({
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
            text: detectionPrompt
          }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const detectionText = detectionResponse.text;
    let conversionData;
    try {
      // Extract JSON from the response (might have markdown code blocks)
      const jsonMatch = detectionText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        conversionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.warn("Could not parse currency detection, using original amount:", parseError);
      conversionData = { convertedAmount: null };
    }

    // Step 2: Extract full receipt details with the converted amount
    const extractionPrompt = `Extract detailed information from this receipt image.

INSTRUCTIONS:
1. **Merchant**: Extract the business/store name
2. **Date**: Return in ${dateFormat} format
   - Current context: ${today.toISOString().split('T')[0]} (Year: ${currentYear}, Month: ${currentMonth})
   - If year is missing, use ${currentYear}
   - If date is unclear, use today's date
3. **Amount**: Look for 'Total', 'Amount', 'Grand Total', 'Net Total', 'Balance Due'
   ${conversionData.convertedAmount ? `- The converted amount in ${userCurrency.code} is: ${conversionData.convertedAmount}` : ''}
4. **Category**: Choose from: Food, Transport, Shopping, Utilities, Entertainment, Health, Other
5. **Items**: List of items purchased (if visible)

Return pure JSON matching the schema.`;

    const extractionResponse = await ai.models.generateContent({
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
            text: extractionPrompt
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

    const extractionText = extractionResponse.text;
    if (!extractionText) throw new Error("No response from AI");
    
    const receiptData = JSON.parse(extractionText) as ReceiptData;
    
    // Override the amount with converted amount if we have it
    if (conversionData.convertedAmount) {
      receiptData.total = conversionData.convertedAmount;
    }
    
    return receiptData;
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
  const userCurrency = getUserCurrency();
  const dateFormat = getUserDateFormat();
  
  // Format transactions with user's currency and date format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (dateFormat) {
      case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
      case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
      case 'MMM DD, YYYY': {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[date.getMonth()]} ${day}, ${year}`;
      }
      case 'MM/DD/YYYY':
      default: return `${month}/${day}/${year}`;
    }
  };
  
  const summary = transactions.map(t => 
    `${formatDate(t.date)}: ${t.description} - ${userCurrency.symbol}${t.amount.toFixed(2)} (${t.category})`
  ).join('\n');

  const totalIncome = transactions.filter(t => !t.isExpense).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.isExpense).reduce((sum, t) => sum + t.amount, 0);

  const prompt = `You are a friendly financial assistant. Analyze these transactions in ${userCurrency.name} (${userCurrency.code}, symbol: ${userCurrency.symbol}).

CONTEXT:
- Total Income: ${userCurrency.symbol}${totalIncome.toFixed(2)}
- Total Expenses: ${userCurrency.symbol}${totalExpense.toFixed(2)}
- Net Balance: ${userCurrency.symbol}${(totalIncome - totalExpense).toFixed(2)}
- Number of Transactions: ${transactions.length}
- Date Format: ${dateFormat}

TRANSACTIONS:
${summary}

INSTRUCTIONS:
1. Provide 3 short, encouraging, and actionable tips to save money or improve financial health.
2. Use the currency symbol ${userCurrency.symbol} when mentioning amounts.
3. Keep the tone friendly, warm, and professional (Apple-style).
4. Be specific and reference actual spending patterns from the data.
5. Do not use Markdown headers (no # symbols). Use plain text with bullet points or numbered lists.
6. Keep each tip to 1-2 sentences maximum.

Focus on practical advice that the user can implement immediately.`;

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
  const userCurrency = getUserCurrency();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a smart expense categorization assistant.

TASK: Categorize this transaction: "${description}"

AVAILABLE CATEGORIES:
- Food: Restaurants, groceries, dining, cafes, food delivery
- Transport: Fuel, parking, public transit, ride-sharing, vehicle maintenance
- Shopping: Clothes, electronics, general shopping, online purchases
- Utilities: Electricity, water, internet, phone bills, rent
- Entertainment: Movies, games, subscriptions, hobbies, events
- Health: Medical, pharmacy, fitness, wellness, insurance
- Other: Anything that doesn't fit the above categories

CONTEXT:
- User's currency: ${userCurrency.name} (${userCurrency.code})
- Consider common spending patterns in ${userCurrency.code} regions

Return ONLY the category name (one word) from the list above. No explanation needed.`,
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
