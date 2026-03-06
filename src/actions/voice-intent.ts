"use server";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { getCachedResult, setCachedResult, hashNormalizedContent } from "@/lib/cache/redis";
import { addToWorkflow } from "@/actions/workflow";

export async function parseVoiceIntentWithGemini(rawText: string) {
    try {
        if (!rawText || !rawText.trim()) {
            throw new Error("No transcription provided.");
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            throw new Error("Gemini API key not found");
        }

        // ⚡ NORMALIZED CACHE CHECK
        const cacheKey = hashNormalizedContent("voice-intent", rawText, "v1");
        const cached = await getCachedResult<any>(cacheKey);

        let parsedData;
        let cacheStatus = "MISS";

        if (cached) {
            console.log("[CACHE_HIT] // NEURAL_CORE_BYPASS");
            parsedData = cached;
            cacheStatus = "HIT";
        } else {
            const genAI = new GoogleGenerativeAI(geminiKey);
            // Using gemini-2.0-flash as per user request (resolved 1.5-flash 404)
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            const prompt = `Act as a multilingual medical scribe. The following clinical transcript may be in English, Hindi, or Bengali.
            
            Your task:
            1. Detect the source language.
            2. Extract operational intent, specialty, and priority.
            3. Provide a 'summary' and 'instructions' specifically for the patient.
            
            CRITICAL BENGALI/HINDI RULES:
            - If the input is in Bengali, the 'summary' and 'instructions' MUST be in high-quality Bengali native script. 
            - Use accurate medical terminology that remains accessible to patients.
            - The JSON keys MUST be in English.
            - The values for 'summary' and 'instructions' MUST be in the EXACT SAME language as the source input.
            - Include the detected language (e.g., "en", "hi", "bn") in the 'language' field.
            - provide a 'suggested_action' field: Based on the intent (e.g., referral, medicine change, urgent triage), what is the ONE immediate clinical next step?
            - provide a 'verbal_response' field: A concise, conversational response (10-15 words) that the AI will SAY back to the clinician. (e.g., "Understood. I've drafted a pulmonology referral for Room 302. Should I add it to the queue?")
            - Ensure the verbal_response is also in the same language as the input (Bengali/Hindi/English).

            Transcript:
            "${rawText}"`;

            const responseSchema = {
                type: SchemaType.OBJECT,
                properties: {
                    intent: { type: SchemaType.STRING },
                    specialty: { type: SchemaType.STRING },
                    priority: { type: SchemaType.STRING },
                    confidence: { type: SchemaType.NUMBER },
                    summary: { type: SchemaType.STRING },
                    instructions: { type: SchemaType.STRING },
                    language: { type: SchemaType.STRING },
                    languageName: { type: SchemaType.STRING },
                    suggested_action: { type: SchemaType.STRING },
                    verbal_response: { type: SchemaType.STRING }
                },
                required: ["intent", "specialty", "priority", "confidence", "summary", "language", "suggested_action", "verbal_response"]
            };

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    // @ts-ignore
                    responseSchema: responseSchema as any,
                },
            });

            const outputText = result.response.text();
            parsedData = JSON.parse(outputText);

            // 🧬 UPDATE CACHE
            await setCachedResult(cacheKey, parsedData, 86400); // 24h TTL
        }

        // 🧬 ALWAYS AUTO-PUSH TO WORKFLOW QUEUE (Even on cache hits)
        await addToWorkflow({
            id: `VC-${Date.now()}`,
            source: "voice",
            title: parsedData.intent,
            description: parsedData.summary,
            confidence: parsedData.confidence,
            priority: parsedData.priority === "URGENT" ? "URGENT" : "NORMAL",
            status: "PENDING",
            createdAt: Date.now(),
            reasoning: parsedData.suggested_action,
            data: parsedData
        });

        return {
            success: true,
            data: parsedData,
            cacheStatus
        };
    } catch (error: any) {
        console.error("Gemini Intent Extraction error:", error);
        return {
            success: false,
            error: error.message || "An unknown error occurred."
        };
    }
}
