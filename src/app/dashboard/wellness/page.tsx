"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Heart, Utensils, Zap, Wind, User, Brain, AlertCircle, PlayCircle, PauseCircle, Upload, CheckCircle2 } from "lucide-react";
import { fetchWellnessIntelligence } from "@/actions/get-wellness";
import type { WellnessEngineOutput } from "@/lib/ai/wellness-engine";

export default function WellnessHubPage() {
    const [payload, setPayload] = useState<{
        ai: WellnessEngineOutput,
        audioUrl: string | null,
        context: any
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Audio Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Image Upload State 
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadWellnessData = async (imageBase64?: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchWellnessIntelligence(imageBase64);
            if (result.success && result.data) {
                setPayload(result.data as any);
                if (audioRef.current && result.data.audioUrl) {
                    audioRef.current.src = result.data.audioUrl;
                    // Don't auto-play immediately per strict browser policies, let user click
                }
            } else {
                setError(result.error || "Failed to establish neural link.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        // Initial load without image
        loadWellnessData();
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current || !payload?.audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);

            // Re-run the entire pipeline with the new visual context
            loadWellnessData(base64String);
        };

        reader.readAsDataURL(file);
    };


    if (loading && !payload) {
        return (
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">Synthesizing Wellness Profile</h2>
                <p className="text-slate-400 text-sm max-w-sm text-center">
                    Analyzing latest prescription markers and cross-referencing with biological vitals to generate your optimal recovery plan...
                </p>
                <div className="flex gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6 glass-panel border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center min-h-[30vh]">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Neural Engine Error</h2>
                <p className="text-slate-400">{error}</p>
                <button onClick={() => loadWellnessData()} className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors">
                    Retry Connection
                </button>
            </div>
        );
    }

    if (!payload) return null;

    const { ai, context, audioUrl } = payload;
    const { meal, movement, warnings, tags, uncertainty } = ai;
    const { vitals, medicines } = context;

    const medNames = medicines.map((m: any) => m.name || "Unknown Med").join(" & ");

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2 flex items-center gap-3">
                        Namaste, <span className="text-emerald-400">Friend</span>.
                        {audioUrl && (
                            <button
                                onClick={toggleAudio}
                                className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                                aria-label="Play daily audio summary"
                            >
                                {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                            </button>
                        )}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 text-sm md:text-base">
                        <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="leading-relaxed">
                            {ai.dailySummaryText.length > 80 ? ai.dailySummaryText.substring(0, 80) + '...' : ai.dailySummaryText}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium ${uncertainty ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        {uncertainty ? <AlertTriangle className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                        <span>{uncertainty ? 'Low Confidence Mode' : 'AI Coach Active'}</span>
                    </div>
                </div>
            </div>

            {/* Multimodal Meal Upload Banner */}
            <div className="glass-panel p-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium text-sm">Analyze Your Plate</h4>
                        <p className="text-slate-400 text-xs mt-0.5">Upload a photo of your meal to let Gemini verify interactions against your {medicines.length} prescriptions.</p>
                    </div>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="whitespace-nowrap px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                    {uploadingImage ? <Activity className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? "Analyzing Vision..." : "Upload Meal Photo"}
                </button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Vitals & Context */}
                <div className="space-y-6 lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "100ms" }}>

                    {/* Vitals Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />
                            Live Vitals
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-slate-400 text-sm">Heart Rate</span>
                                <span className="text-white font-mono font-bold">{vitals.hr} BPM</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-slate-400 text-sm">Blood Pressure</span>
                                <span className="text-white font-mono font-bold">{vitals.bp}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-slate-400 text-sm">SpO2</span>
                                <span className="text-emerald-400 font-mono font-bold">{vitals.spo2}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Medical Context Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className={`w-5 h-5 ${warnings.length > 0 ? 'text-amber-500' : 'text-indigo-400'}`} />
                            {warnings.length > 0 ? 'Interaction Alerts' : 'Medical Grounding'}
                        </h3>
                        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
                            {medicines.length > 0 && (
                                <p>
                                    Optimizing metabolic pathways for <span className="text-indigo-300 font-medium">{medNames}</span>.
                                </p>
                            )}

                            {warnings.length > 0 ? (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200/90 text-xs font-medium relative mt-4">
                                    <div className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </div>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <p className="opacity-80 flex items-center gap-2 text-emerald-400/80">
                                    <CheckCircle2 className="w-4 h-4" /> No severe interaction flags detected.
                                </p>
                            )}

                        </div>
                    </div>
                </div>

                {/* Right Column: AI Suggestions */}
                <div className="space-y-6 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>

                    {/* Nutrition Card */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                        {imagePreview && (
                            <div className="absolute inset-0 z-0 opacity-10">
                                <img src={imagePreview} alt="Meal Background" className="w-full h-full object-cover filter blur-sm grayscale" />
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-8 opacity-10 z-0">
                            <Utensils className="w-32 h-32 text-emerald-500 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" />
                        </div>

                        <div className="relative z-10 w-full md:w-4/5">
                            <h3 className="text-2xl font-bold text-white mb-2">{meal.title}</h3>
                            <p className="text-emerald-400 text-sm mb-6 uppercase tracking-wider font-semibold">Recommended Nutrition Profile</p>

                            <p className="text-slate-300 leading-relaxed max-w-lg mb-4 text-lg">
                                {meal.description}
                            </p>

                            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl mb-6 backdrop-blur-md">
                                <p className="text-sm text-slate-400 italic">
                                    <span className="font-semibold text-emerald-500 not-italic mr-2">Why?</span>
                                    {meal.why}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {meal.nutrients.map((n, i) => (
                                    <span key={`n-${i}`} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                                        {n}
                                    </span>
                                ))}
                                {tags.map((tag, i) => (
                                    <span key={`t-${i}`} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Movement Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {movement.map((m, i) => {
                            // Assign random icon structurally
                            const icons = [User, Wind, Zap, Activity];
                            const IconTag = icons[i % icons.length];

                            return (
                                <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors group relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                        <IconTag className="w-24 h-24 text-teal-500 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <IconTag className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-1 text-sm">{m.name}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{m.focus}</p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}

// Temporary import for AlertTriangle since it's not in the main UI import block
import { AlertTriangle } from "lucide-react";
