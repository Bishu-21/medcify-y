"use client";

import React, { useState, useRef } from "react";
import { Sparkles, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";
import { analyzePrescription } from "@/actions/parse-prescription";

export default function OCRPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
    const [extractedData, setExtractedData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await handleProcessFile(file);
    };

    const handleProcessFile = async (file: File) => {
        // Reset state before processing
        setExtractedData(null);
        setError(null);
        setStatus("uploading");

        // Set preview
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        setStatus("processing");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await analyzePrescription(formData);

            if (result.success) {
                setExtractedData(result.data);
                setStatus("completed");
            } else {
                setError(result.error);
                setStatus("error");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setStatus("error");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await handleProcessFile(file);
    };

    const openFileDialog = () => {
        // Only allow clicking if not currently analyzing
        if (status === "idle" || status === "error" || status === "completed") {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="min-h-screen bg-[#0B101A] text-white p-8">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    AI Prescription OCR
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column (Input - col-span-5) */}
                <div className="lg:col-span-5 flex flex-col">
                    <div
                        onClick={openFileDialog}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-white/[0.01] rounded-2xl h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${status === "processing" || status === "uploading" ? "pointer-events-none cursor-default" : "cursor-pointer"
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        {!imagePreview && (
                            <div className="flex flex-col items-center gap-4 text-white/50">
                                <UploadCloud className="w-12 h-12" />
                                <p className="font-medium text-lg">Drag & Drop prescription</p>
                                <p className="text-sm">or click to browse files</p>
                            </div>
                        )}

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Prescription Scan"
                                className="w-full h-full object-contain p-2"
                            />
                        )}

                        {(status === "processing" || status === "uploading") && (
                            <>
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="text-cyan-400 font-semibold tracking-wider text-lg animate-pulse">
                                            {status === "uploading" ? "Uploading image..." : "Azure + Gemini 3.1 Pro processing..."}
                                        </div>
                                    </div>
                                </div>
                                {/* Responsive scanning animation line over the image */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.8)] z-20 animate-[scan_2.5s_ease-in-out_infinite]" />
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column (Results - col-span-7) */}
                <div className="lg:col-span-7">
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-6 h-[400px] flex flex-col">

                        {/* Error Message */}
                        {status === "error" && error && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/20 backdrop-blur-md text-red-400 p-4 rounded-xl flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <div className="leading-relaxed font-medium">{error}</div>
                            </div>
                        )}

                        {/* Empty State */}
                        {(status === "idle" || status === "uploading") && (
                            <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-4">
                                <Sparkles className="w-10 h-10 opacity-20" />
                                <p className="text-lg">Structured results will appear here</p>
                            </div>
                        )}

                        {/* Processing Skeleton State */}
                        {status === "processing" && (
                            <div className="flex-1 flex flex-col items-center justify-center text-cyan-400/50 gap-4">
                                <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                <p className="text-lg animate-pulse">Extracting medication data...</p>
                            </div>
                        )}

                        {/* Results State */}
                        {status === "completed" && extractedData && (
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white/90">Extracted Medications</h2>
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Data Verified
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {extractedData.map((drug, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-xl flex justify-between items-center group hover:bg-white/[0.03] transition-colors"
                                        >
                                            <div className="w-full">
                                                <div className="text-xl font-medium text-cyan-300 mb-2">
                                                    {drug.name || "Unknown Name"}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm mt-1">
                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Dosage</span>
                                                        <span className="text-white/80">{drug.dosage || "N/A"}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Frequency</span>
                                                        <span className="text-white/80">{drug.frequency || "N/A"}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Duration</span>
                                                        <span className="text-white/80">{drug.duration || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 pt-5 border-t border-white/[0.05] shrink-0">
                                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all active:scale-[0.98]">
                                        Sync to Appwrite Inventory
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { transform: translateY(380px); opacity: 1; } /* Slightly less than the 400px container to keep it within bounds */
          100% { transform: translateY(400px); opacity: 0; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
        </div>
    );
}
