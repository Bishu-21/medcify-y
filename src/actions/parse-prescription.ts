"use server";

import { DocumentIntelligenceClient } from "@azure/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzePrescription(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file uploaded");
        }

        // Convert the file to an ArrayBuffer and then to a Uint8Array
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Azure OCR Phase
        const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
        const apiKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

        if (!endpoint || !apiKey) {
            throw new Error("Azure Document Intelligence credentials not found");
        }

        // Initialize DocumentIntelligenceClient using the Azure Endpoint and AzureKeyCredential
        const client = new DocumentIntelligenceClient(endpoint, new AzureKeyCredential(apiKey));

        // Call the prebuilt-read model, passing the image buffer
        const poller = await client.beginAnalyzeDocument("prebuilt-read", uint8Array);
        const result = await poller.pollUntilDone();

        // Extract and concatenate all the recognized text lines into a single rawText string
        let rawText = "";
        if (result.pages) {
            for (const page of result.pages) {
                if (page.lines) {
                    for (const line of page.lines) {
                        rawText += line.content + "\n";
                    }
                }
            }
        }

        if (!rawText.trim()) {
            throw new Error("No text could be extracted from the image");
        }

        // Gemini Structuring Phase
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            throw new Error("Gemini API key not found");
        }

        // Initialize GoogleGenerativeAI using the Gemini API key
        const genAI = new GoogleGenerativeAI(geminiKey);
        // Use the gemini-3.1-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro" });

        // Prompt as requested
        const prompt = `You are an expert medical AI. Parse this raw OCR text extracted from a messy handwritten prescription: ${rawText}. Extract the medications and return ONLY a valid JSON array of objects with the keys: 'name', 'dosage', 'frequency', 'duration'. Return raw JSON only, no markdown.`;

        const aiResponse = await model.generateContent(prompt);
        let outputText = aiResponse.response.text();

        // Clean JSON string (remove markdown blocks if present)
        outputText = outputText.replace(/```json/gi, "").replace(/```/gi, "").trim();

        // Return the response as parsed JSON object inside { success: true, data: ... }
        const parsedArray = JSON.parse(outputText);

        return { success: true, data: parsedArray };
    } catch (error: any) {
        console.error("Prescription analysis error:", error);
        return { success: false, error: error.message || "An unknown error occurred during parsing." };
    }
}
