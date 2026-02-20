"use client";

import { Activity, Heart, Utensils, Zap, Wind, User, Brain, AlertCircle } from "lucide-react";

export default function WellnessHubPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2">
                        Namaste, <span className="text-emerald-400">Priya</span>.
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Your vitals are stable. Here is your AI-curated daily plan.</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
                    <Brain className="w-4 h-4" />
                    <span>AI Health Coach Active</span>
                </div>
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
                                <span className="text-white font-mono font-bold">72 BPM</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-slate-400 text-sm">Blood Pressure</span>
                                <span className="text-white font-mono font-bold">120/80</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-slate-400 text-sm">SpO2</span>
                                <span className="text-emerald-400 font-mono font-bold">98%</span>
                            </div>
                        </div>
                    </div>

                    {/* Medical Context Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-400" />
                            Medical Context
                        </h3>
                        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Optimizing for <span className="text-indigo-300 font-medium">Metformin</span> & <span className="text-indigo-300 font-medium">Lisinopril</span> interactions.
                            </p>
                            <p className="opacity-80">
                                Avoid high potassium intake today due to ACE inhibitor interaction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Suggestions */}
                <div className="space-y-6 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>

                    {/* Nutrition Card */}
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Utensils className="w-32 h-32 text-emerald-500" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Lemon Herb Salmon & Quinoa</h3>
                        <p className="text-emerald-400 text-sm mb-6 uppercase tracking-wider font-semibold">Recommended Lunch</p>

                        <p className="text-slate-300 leading-relaxed max-w-lg mb-6">
                            A heart-healthy choice rich in Omega-3 fatty acids, complex carbohydrates, and essential micronutrients.
                            Portion-sized and optimized for metabolic balance.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">Omega-3 Rich</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">Low Glycemic Index</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">Heart Healthy</span>
                        </div>
                    </div>

                    {/* Movement Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <User className="w-5 h-5 text-teal-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-1">Tadasana</h4>
                            <p className="text-xs text-slate-500">Posture & Breath</p>
                        </div>

                        <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Wind className="w-5 h-5 text-teal-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-1">Vrikshasana</h4>
                            <p className="text-xs text-slate-500">Balance & Focus</p>
                        </div>

                        <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Zap className="w-5 h-5 text-teal-400" />
                            </div>
                            <h4 className="text-white font-semibold mb-1">Balasana</h4>
                            <p className="text-xs text-slate-500">Stress Relief</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
