"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ScanLine, User } from "lucide-react";
import { uploadPrescriptionImage } from "@/actions/upload-prescription";
import { runAzureOCR } from "@/actions/run-azure-ocr";
import { parsePrescriptionWithGemini } from "@/actions/parse-with-gemini";
import { savePrescriptionRecord } from "@/actions/save-prescription";
import { getPrescriptionRecord } from "@/actions/get-prescription";

export default function OCRPage() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<any | null>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setStatus("uploading");
        setError(null);
        setExtractedData(null);
        setDocumentId(null);

        try {
            // 1. Upload to Appwrite
            const formData = new FormData();
            formData.append("file", selectedFile);

            const uploadRes = await uploadPrescriptionImage(formData);
            if (!uploadRes.success || !uploadRes.fileId || !uploadRes.imageUrl) {
                throw new Error(uploadRes.error || "Upload failed");
            }

            setStatus("processing");

            // 2. Azure OCR
            const ocrRes = await runAzureOCR(uploadRes.fileId);
            if (!ocrRes.success || !ocrRes.rawText) {
                throw new Error(ocrRes.error || "OCR extraction failed");
            }

            // 3. Parse with Gemini
            const parseRes = await parsePrescriptionWithGemini(ocrRes.rawText);
            if (!parseRes.success || !parseRes.data) {
                throw new Error(parseRes.error || "Gemini parsing failed");
            }

            const { medicines, patientInfo } = parseRes.data;

            // 4. Save the combined Record
            const saveRes = await savePrescriptionRecord({
                imageUrl: uploadRes.imageUrl,
                rawText: ocrRes.rawText,
                parsedMedicines: medicines || [],
                ocrConfidence: ocrRes.ocrConfidence || 0
            });
            if (!saveRes.success || !saveRes.documentId) {
                throw new Error(saveRes.error || "Failed to save record");
            }

            setDocumentId(saveRes.documentId);

            // 5. Fetch to render
            const fetchRes = await getPrescriptionRecord(saveRes.documentId);
            if (!fetchRes.success || !fetchRes.data) {
                throw new Error(fetchRes.error || "Failed to retrieve saved document");
            }

            // Safely parse JSON string output from the DB
            let loadedMedicines = [];
            let loadedCorrections = {};
            try {
                loadedMedicines = JSON.parse(fetchRes.data.parsedMedicines || "[]");
                loadedCorrections = JSON.parse(fetchRes.data.corrections || "{}");
            } catch (e) {
                console.error("DB JSON parsing error", e);
            }

            setExtractedData({
                ...fetchRes.data,
                parsedMedicines: loadedMedicines,
                corrections: loadedCorrections,
                patientInfo: patientInfo || null
            });

            setStatus("completed");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setStatus("error");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2">AI Prescription OCR</h1>
                    <p className="text-slate-400">High-fidelity medical document extraction powered by <span className="text-emerald-400">Medcify Neural Engine</span>.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                    <ScanLine className="w-3 h-3" />
                    v2.4 Model Active
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mt-8">
                {/* Left: Upload Section */}
                <div className="space-y-6">
                    <div
                        className={`relative group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${dragActive ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 hover:border-emerald-500/50 hover:bg-white/[0.02] bg-white/[0.01]"}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleChange}
                            accept="image/png, image/jpeg, application/pdf"
                        />

                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        {!file && (
                            <div className="text-center p-6 space-y-4 relative z-0">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/50 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-slate-200">Upload Document</p>
                                    <p className="text-sm text-slate-500 mt-1">Drag and drop or click to browse</p>
                                </div>
                                <div className="flex gap-2 justify-center mt-4">
                                    <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 uppercase font-mono border border-slate-700">JPG</span>
                                    <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 uppercase font-mono border border-slate-700">PNG</span>
                                    <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 uppercase font-mono border border-slate-700">PDF</span>
                                </div>
                            </div>
                        )}

                        {file && (
                            <div className="text-center z-20">
                                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 relative">
                                    {(status === "uploading" || status === "processing") ? (
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                                    ) : (
                                        <CheckCircle2 className="w-8 h-8" />
                                    )}
                                    <FileText className="w-6 h-6" />
                                </div>
                                <p className="text-slate-200 font-medium">{file.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB • {(status === "uploading" || status === "processing") ? "Processing..." : status === "error" ? "Error" : "Ready"}</p>
                            </div>
                        )}
                    </div>

                    {/* Guidelines */}
                    <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyan-500">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200">Best Practices</h4>
                                <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc pl-4">
                                    <li>Ensure good lighting and no shadows on the document.</li>
                                    <li>Entire prescription should be visible within the frame.</li>
                                    <li>Handwriting should be legible for maximum accuracy.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results Section */}
                <div className="glass-panel p-6 rounded-2xl h-full min-h-[500px] flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        Extraction Results
                    </h2>

                    {status === "error" && error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <div className="leading-relaxed font-medium">{error}</div>
                        </div>
                    )}

                    {(status === "idle" || status === "uploading") && (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl m-4">
                            <ScanLine className="w-12 h-12 mb-4 opacity-50" />
                            <p>Upload a document to see AI extraction results</p>
                        </div>
                    )}

                    {status === "processing" && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-full max-w-xs h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-cyan-500 animate-[scan_1.5s_ease-in-out_infinite] w-1/2"></div>
                            </div>
                            <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mt-4"></div>
                            <p className="text-sm text-cyan-400 animate-pulse">Extracting medication data...</p>
                        </div>
                    )}

                    {status === "completed" && extractedData && (
                        <div className="space-y-6 animate-fade-in-up">

                            <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <div><span className="text-slate-500">Record ID:</span> {documentId}</div>
                                <div className="text-right">
                                    <span className="text-slate-500">Confidence:</span> {extractedData.ocrConfidence ? (extractedData.ocrConfidence * 100).toFixed(1) + "%" : "N/A"}
                                    <span className="mx-2 text-slate-600">|</span>
                                    <span className="text-slate-500">Added:</span> {new Date(extractedData.createdAt).toLocaleString()}
                                </div>
                            </div>

                            {/* Patient Info */}
                            {extractedData.patientInfo && Object.keys(extractedData.patientInfo).some(k => extractedData.patientInfo[k]) && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-4 h-4" /> Detected Patient Information
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                        {['name', 'age', 'gender', 'date'].map(key => extractedData.patientInfo[key] ? (
                                            <div key={key}>
                                                <p className="text-xs text-slate-500 mb-1 capitalize">{key}</p>
                                                <p className="text-slate-200 font-medium">{extractedData.patientInfo[key]}</p>
                                            </div>
                                        ) : null)}
                                    </div>
                                </div>
                            )}

                            {/* Medications */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Detected Medications
                                </h3>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {Array.isArray(extractedData.parsedMedicines) && extractedData.parsedMedicines.map((drug: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500/10 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-emerald-300 text-lg font-medium">{drug.name || "Unknown"} <span className="text-xs ml-2 text-white/50 bg-white/5 px-2 py-0.5 rounded">{drug.strength || ""}</span></h4>
                                                {drug.confidence !== undefined && (
                                                    <span className="text-[10px] text-slate-500 bg-black/20 px-2 py-1 rounded">Conf: {(drug.confidence * 100).toFixed(0)}%</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Dosage</span>
                                                    <span className="text-xs text-slate-300">{drug.dosage || "-"}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Frequency</span>
                                                    <span className="text-xs text-slate-300">{drug.frequency || "-"}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Duration</span>
                                                    <span className="text-xs text-slate-300">{drug.duration || "-"}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Notes</span>
                                                    <span className="text-xs text-slate-400 italic line-clamp-2">{drug.notes || "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!Array.isArray(extractedData.parsedMedicines) || extractedData.parsedMedicines.length === 0) && (
                                        <div className="p-4 bg-white/5 text-slate-400 rounded-xl text-center text-sm border border-white/10">No medications cleanly extracted.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
