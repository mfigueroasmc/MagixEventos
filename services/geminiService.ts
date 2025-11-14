
import { GoogleGenAI } from "@google/genai";
import { getArticulos, getEventos, getDashboardData } from './supabaseService';

// IMPORTANT: This key is managed externally. Do not modify.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  console.warn("Gemini API key not found. Chatbot functionality will be limited.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getChatbotResponse = async (query: string): Promise<string> => {
    if (!API_KEY) {
        return "Chatbot is currently unavailable. API key is missing.";
    }

    try {
        const articulos = await getArticulos();
        const eventos = await getEventos();
        const dashboardData = await getDashboardData();
        
        // Contextual data for the model
        const context = `
        You are a helpful AI assistant for a hotel's audiovisual event management system.
        Your name is 'AV Pro Assistant'.
        Answer the user's questions based on the current data from the system provided below.
        Be concise and friendly. Format your answers in simple markdown. If you list items, use bullet points.

        CURRENT SYSTEM DATA:
        ---
        ARTICULOS (Inventory): ${JSON.stringify(articulos, null, 2)}
        ---
        EVENTOS (Events): ${JSON.stringify(eventos.map(e => ({...e, detalles: undefined})), null, 2)}
        ---
        DASHBOARD KPIs: ${JSON.stringify(dashboardData, null, 2)}
        ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User question: "${query}"`,
            config: {
                systemInstruction: context
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching response from Gemini API:", error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
};
