
import { GoogleGenAI, Type } from "@google/genai";
import { AIAction, AICommand } from '../types';

// Ensure the API_KEY is available, otherwise throw an error.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        action: {
            type: Type.STRING,
            enum: [AIAction.CREATE, AIAction.UPDATE, AIAction.DELETE, AIAction.READ, AIAction.UNKNOWN],
            description: "The action to be performed on the calendar.",
        },
        event: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the event." },
                date: { type: Type.STRING, description: "The date of the event in 'yyyy-MM-dd' format." },
                time: { type: Type.STRING, description: "The time of the event in 'HH:mm' 24-hour format." },
                description: { type: Type.STRING, description: "A brief description of the event." },
                calendarId: { type: Type.STRING, enum: ["personal", "work", "team"], description: "The calendar to add the event to. Defaults to 'personal'." },
                reminderMinutesBefore: { type: Type.INTEGER, description: "Number of minutes before the event to send a reminder. e.g., 15 for 'remind me 15 minutes before'." },
            },
            description: "Details of the event to be created or updated. Required for CREATE and UPDATE actions.",
        },
        targetEventTitle: {
            type: Type.STRING,
            description: "The title of the event to be updated or deleted. Required for UPDATE and DELETE actions.",
        },
        responseMessage: {
            type: Type.STRING,
            description: "A friendly message to the user confirming the action.",
        },
    },
};

export async function processNaturalLanguageCommand(command: string, currentDate: Date): Promise<AICommand | null> {
    const systemInstruction = `You are an intelligent calendar assistant. Your task is to interpret user commands and translate them into a structured JSON format.
The current date is ${currentDate.toISOString()}. Use this for relative dates like "tomorrow" or "next Friday".
Analyze the user's request and determine the appropriate action: CREATE, UPDATE, DELETE, or READ.
- For CREATE, you must provide the event title, date, and time.
- For DELETE, you must identify the event by its title in 'targetEventTitle'.
- For UPDATE, you must provide the 'targetEventTitle' and the new 'event' details.
- If the user asks to set a reminder, parse the duration and set 'reminderMinutesBefore'. For example, 'remind me 15 minutes before' should result in reminderMinutesBefore: 15.
- If the user's intent is unclear, set action to UNKNOWN.
- Always respond in the specified JSON format.
- Default calendarId to 'personal' if not specified.
- Date format must be 'yyyy-MM-dd'.
- Time format must be 'HH:mm' (24-hour).
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: command,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Basic validation of the parsed response
        if (parsedResponse && parsedResponse.action) {
            return parsedResponse as AICommand;
        }
        
        console.error("Parsed response is missing 'action' property:", parsedResponse);
        return null;

    } catch (error) {
        console.error("Error processing command with Gemini:", error);
        // This could be a network error or an error from the API itself.
        throw new Error("Failed to get a response from the AI assistant.");
    }
}