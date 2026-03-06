"use server";

import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedResult, setCachedResult, hashNormalizedContent } from "@/lib/cache/redis";
import { addToWorkflow } from "@/actions/workflow";

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";
const geminiKey = process.env.GEMINI_API_KEY || "";

export async function processDocumentOCR(base64Image: string) {
    try {
        if (!endpoint || !key) throw new Error("Azure OCR credentials missing");
        if (!geminiKey) throw new Error("Gemini API key missing");

        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        const base64Data = base64Image.split(",")[1] || base64Image;
        const buffer = Buffer.from(base64Data, "base64");

        // PHASE 1: Azure Forensic Extraction
        const poller = await client.beginAnalyzeDocument("prebuilt-document", buffer);
        const { keyValuePairs, content, documents } = await poller.pollUntilDone();

        if (!content) throw new Error("No content extracted from document");

        const docType = documents?.[0]?.docType || "Medical Document";
        const docConfidence = documents?.[0]?.confidence || 0.85;

        // ⚡ NORMALIZED CACHE CHECK (Phase 2 Reasoning)
        const cacheKey = hashNormalizedContent("document-reasoning", content, "v1");
        const cachedGeminiResult = await getCachedResult<any>(cacheKey);

        const azureFields: any[] = [];
        if (keyValuePairs) {
            for (const kv of keyValuePairs) {
                const keyText = kv.key?.content?.toLowerCase() || "";
                const valText = kv.value?.content || "";
                if (!valText) continue;

                let fieldName = "";
                if (keyText.includes("name") || keyText.includes("patient")) fieldName = "PATIENT_NAME";
                else if (keyText.includes("test") || keyText.includes("type") || keyText.includes("report")) fieldName = "TEST_TYPE";
                else if (keyText.includes("date")) fieldName = "DATE";
                else if (keyText.includes("result") || keyText.includes("findings") || keyText.includes("observation")) fieldName = "RESULT";
                else if (keyText.includes("id") || keyText.includes("uhid")) fieldName = "UHID_NUMBER";

                if (fieldName) {
                    azureFields.push({
                        name: fieldName,
                        label: kv.key?.content,
                        value: valText,
                        confidence: kv.confidence || 0.92,
                        boundingBox: kv.value?.boundingRegions?.[0]?.polygon || null,
                    });
                }
            }
        }

        let geminiResult;
        let cacheStatus = "MISS";

        if (cachedGeminiResult) {
            console.log("[CACHE_HIT] // NEURAL_CORE_BYPASS (Document Reasoning)");
            geminiResult = cachedGeminiResult;
            cacheStatus = "HIT";
        } else {
            // PHASE 2: Gemini Semantic Reasoning
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

            const prompt = `
            You are a clinical AI assistant. Analyze the following extracted medical data.
            
            1. Identify if any results are abnormal/anomalous (especially results like Hemoglobin).
            2. Provide a short, technical "Extraction Explanation" for WHY this field was identified.
               FOLLOW THIS EXACT FORMAT: "Detected in [section] of document | Matched [clinical/id] format | Confidence Score Applied"
            3. Provide a 'proposedAction': Based on the findings (especially anomalies), what is the ONE immediate clinical next step? (e.g. Schedule iron profile, immediate consultation, cross-reference previous labs).

            Return ONLY a JSON object:
            {
              "interpretations": [
                { "name": "FIELD_NAME", "abnormal": true/false, "interpretation": "e.g. Low Hemoglobin", "explanation": "string as per format" }
              ],
              "proposedAction": "string"
            }

            DATA:
            ${JSON.stringify(azureFields)}
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanedJson = responseText.replace(/```json|```/g, "").trim();
            geminiResult = JSON.parse(cleanedJson);

            // UPDATE CACHE
            await setCachedResult(cacheKey, geminiResult, 86400); // 24h TTL
        }

        // PHASE 3: Merge and Return
        const finalFields = azureFields.map(field => {
            const interpret = geminiResult.interpretations.find((i: any) => i.name === field.name);
            return {
                ...field,
                validation: interpret?.abnormal ? "ANOMALY_DETECTED" : "NOMINAL",
                interpretation: interpret?.interpretation || "",
                explanation: interpret?.explanation || "Extracted via Azure Neural Document Analysis."
            };
        });

        const finalResult = {
            docType,
            docConfidence,
            fields: finalFields,
            proposedAction: geminiResult.proposedAction,
            cacheStatus,
            metadata: {
                ocr_engine: "Azure Document Intelligence v4.0",
                reasoning_model: "Gemini 3.1 Flash Lite",
                schema: "Clinical Extraction v1"
            }
        };

        // 🧬 ALWAYS AUTO-PUSH TO WORKFLOW QUEUE
        await addToWorkflow({
            id: `DOC-${Date.now()}`,
            source: "document",
            title: docType.toUpperCase(),
            description: `Processed ${finalFields.length} clinical fields with ${finalFields.filter(f => f.validation === "ANOMALY_DETECTED").length} anomalies detected.`,
            confidence: docConfidence,
            priority: finalFields.some(f => f.validation === "ANOMALY_DETECTED") ? "URGENT" : "NORMAL",
            status: "PENDING",
            createdAt: Date.now(),
            reasoning: geminiResult.proposedAction,
            data: finalResult
        });

        return {
            success: true,
            data: finalResult
        };

    } catch (error: any) {
        console.error("Document OCR Error:", error);
        return {
            success: false,
            error: error.message || "Document processing failed"
        };
    }
}
