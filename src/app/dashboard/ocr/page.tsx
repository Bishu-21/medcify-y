"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ScanLine, User } from "lucide-react";

export default function OCRPage() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(false);

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
            setFile(e.dataTransfer.files[0]);
            simulateAnalysis();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            simulateAnalysis();
        }
    };

    const simulateAnalysis = () => {
        setAnalyzing(true);
        setResults(false);
        setTimeout(() => {
            setAnalyzing(false);
            setResults(true);
        }, 2500);
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
                                    {analyzing ? (
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                                    ) : (
                                        <CheckCircle2 className="w-8 h-8" />
                                    )}
                                    <FileText className="w-6 h-6" />
                                </div>
                                <p className="text-slate-200 font-medium">{file.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB • {analyzing ? "Processing..." : "Ready"}</p>
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
                        {results && <span className="ml-auto text-xs py-1 px-2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">98% Confidence</span>}
                    </h2>

                    {!results && !analyzing && (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl m-4">
                            <ScanLine className="w-12 h-12 mb-4 opacity-50" />
                            <p>Upload a document to see AI extraction results</p>
                        </div>
                    )}

                    {analyzing && (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-full max-w-xs h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-cyan-500 animate-pulse-cyan w-1/2"></div>
                            </div>
                            <p className="text-sm text-cyan-400 animate-pulse">Analyzing Handwriting Patterns...</p>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Patient Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-4 h-4" /> Patient Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Name</p>
                                        <p className="text-slate-200 font-medium">Rahul Sharma</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Age / Gender</p>
                                        <p className="text-slate-200 font-medium">42 / Male</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Date</p>
                                        <p className="text-slate-200 font-medium">20 Oct 2023</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Doctor</p>
                                        <p className="text-slate-200 font-medium">Dr. A. K. Verma</p>
                                    </div>
                                </div>
                            </div>

                            {/* Medications */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Detected Medications
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-emerald-300 font-medium">Amoxicillin 500mg</h4>
                                            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Antibiotic</span>
                                        </div>
                                        <div className="flex text-xs text-slate-400 gap-4">
                                            <span><span className="text-slate-500">Freq:</span> 1-0-1</span>
                                            <span><span className="text-slate-500">Instr:</span> After Food</span>
                                            <span><span className="text-slate-500">Dur:</span> 5 Days</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-emerald-300 font-medium">Paracetamol 650mg</h4>
                                            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Analgesic</span>
                                        </div>
                                        <div className="flex text-xs text-slate-400 gap-4">
                                            <span><span className="text-slate-500">Freq:</span> SOS</span>
                                            <span><span className="text-slate-500">Instr:</span> For Fever</span>
                                            <span><span className="text-slate-500">Dur:</span> 3 Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                                Verify & Add to Inventory
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
