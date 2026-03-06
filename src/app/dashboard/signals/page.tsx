"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignalNetworkPage() {
    const [signalsCount, setSignalsCount] = useState(6);
    const [streamDensity, setStreamDensity] = useState(840);
    const [uptime, setUptime] = useState("423:12:08");

    useEffect(() => {
        const interval = setInterval(() => {
            setStreamDensity(prev => prev + Math.floor(Math.random() * 10 - 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in -mt-4 pb-12 min-h-screen bg-white font-display text-slate-900 overflow-hidden flex flex-col relative">
            <style jsx global>{`
                .graph-paper {
                    background-size: 24px 24px;
                    background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
                }
                .dotted-border {
                    border-style: dotted;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Header Section */}
            <header className="h-14 border-b border-black flex items-center justify-between px-6 bg-white z-50">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 hover:text-teal transition-colors border border-gray-100 px-2 py-1 uppercase tracking-widest mr-4 group"
                    >
                        <span className="material-symbols-outlined text-[14px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                        Dashboard
                    </Link>
                    <span className="font-mono text-xs md:text-sm font-bold tracking-tighter uppercase">Mystic Maitri | Signal Network</span>
                </div>
                <div className="hidden md:flex items-center gap-6 font-mono text-[10px] font-bold">
                    <div className="flex items-center gap-2">
                        <span className="size-2 bg-teal rounded-full"></span>
                        <span>NETWORK STATUS: <span className="text-teal">ACTIVE</span></span>
                    </div>
                    <div className="border-l border-slate-300 h-4"></div>
                    <span>SIGNALS DETECTED: {signalsCount}</span>
                    <div className="border-l border-slate-300 h-4"></div>
                    <span>DATA STREAM: <span className="text-teal">LIVE</span></span>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative graph-paper">
                {/* Central Radar Visualization Area */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
                    {/* Outline Map Mockup */}
                    <div className="relative w-full md:w-4/5 h-4/5 border border-slate-200 dotted-border flex items-center justify-center transition-all">
                        <svg className="w-full h-full opacity-20" viewBox="0 0 800 600">
                            <path d="M100,100 L200,80 L350,120 L500,90 L700,150 L750,300 L650,500 L400,550 L150,480 L50,300 Z" fill="none" stroke="black" strokeDasharray="4 4" strokeWidth="1"></path>
                            <line stroke="black" strokeDasharray="2 2" strokeWidth="0.5" x1="400" x2="400" y1="0" y2="600"></line>
                            <line stroke="black" strokeDasharray="2 2" strokeWidth="0.5" x1="0" x2="800" y1="300" y2="300"></line>
                        </svg>

                        {/* Signal Markers */}
                        <div className="absolute top-1/4 left-1/3 text-teal">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                        </div>
                        <div className="absolute top-1/2 left-1/4 text-teal">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>square</span>
                        </div>
                        <div className="absolute bottom-1/3 left-1/2 text-teal">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                        </div>
                        <div className="absolute top-1/3 right-1/4 text-teal">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>square</span>
                        </div>

                        {/* Anomaly Marker (Amber) */}
                        <div className="absolute top-[42%] right-[38%] text-amber-500">
                            <span className="material-symbols-outlined text-4xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                            {/* Tooltip Overlay */}
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-black p-3 shadow-none z-40 hidden md:block">
                                <div className="font-mono text-[10px] font-bold leading-tight">
                                    <div className="flex justify-between border-b border-slate-100 pb-1 mb-1">
                                        <span className="text-amber-600 uppercase tracking-tighter">Fever_Spike</span>
                                        <span>700015</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between uppercase"><span>Cases</span><span>450</span></div>
                                        <div className="flex justify-between uppercase"><span>Conf</span><span>High</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Panel (Floating) */}
                    <div className="absolute top-6 right-6 w-48 md:w-64 bg-white border border-black p-4 font-mono text-[10px] hidden sm:block">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500 uppercase">Active Signals</span>
                                <span className="font-bold">{signalsCount.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 uppercase">Nodes Online</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-2 text-teal">
                                <span className="text-slate-500 uppercase">Event Stream</span>
                                <span className="font-bold">{streamDensity}/sec</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend (Desktop) */}
                    <div className="absolute bottom-12 left-6 bg-white border border-black p-3 flex flex-col gap-2 font-mono text-[9px] uppercase tracking-wider hidden md:flex">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-teal text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                            <span>Respiratory</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-teal text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>square</span>
                            <span>Cardiology</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-teal text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                            <span>Diagnostics</span>
                        </div>
                    </div>
                </div>

                {/* Signal Feed Panel (Right Sidebar on Desktop, Bottom on Mobile) */}
                <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-black bg-white flex flex-col z-50 h-auto md:h-full">
                    <div className="p-6 border-b border-black">
                        <h2 className="font-serif italic font-bold text-2xl">Signal Feed</h2>
                        <p className="font-mono text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Live Operations Buffer</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[40vh] md:max-h-none no-scrollbar">
                        {/* Urgent Card */}
                        <div className="border-2 border-amber-500 p-4 bg-white shadow-[2px_2px_0px_0px_#f59e0b]">
                            <div className="flex items-start justify-between mb-3 text-amber-600">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>change_history</span>
                                <span className="font-mono text-[8px] border border-amber-500 px-1 uppercase font-bold">Urgent</span>
                            </div>
                            <h3 className="font-mono text-xs font-bold leading-tight">RESPIRATORY_CLUSTER</h3>
                            <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-600">
                                <div className="flex justify-between"><span>ZIP_CODE</span><span className="text-black font-bold">700015</span></div>
                                <div className="flex justify-between"><span>EVENT_COUNT</span><span className="text-black font-bold">43</span></div>
                                <div className="flex justify-between"><span>CONFIDENCE</span><span className="text-teal font-bold">0.88</span></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Link
                                    href="/dashboard/workflow"
                                    className="flex-1 h-9 bg-black text-white text-[10px] flex items-center justify-center font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                                >
                                    Investigate
                                </Link>
                            </div>
                        </div>

                        {/* Standard Signals */}
                        <div className="border border-black p-4 opacity-70 hover:opacity-100 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <span className="material-symbols-outlined text-teal" style={{ fontVariationSettings: "'FILL' 1" }}>square</span>
                            </div>
                            <h3 className="font-mono text-xs font-bold leading-tight uppercase">Cardiology_Signal</h3>
                            <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-500">
                                <div className="flex justify-between"><span>ZIP_CODE</span><span className="text-black">422001</span></div>
                                <div className="flex justify-between"><span>EVENT_COUNT</span><span className="text-black">12</span></div>
                            </div>
                        </div>

                        <div className="border border-black p-4 opacity-70 hover:opacity-100 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <span className="material-symbols-outlined text-teal" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                            </div>
                            <h3 className="font-mono text-xs font-bold leading-tight uppercase">Diagnostics_Ref</h3>
                            <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-500">
                                <div className="flex justify-between"><span>ZIP_CODE</span><span className="text-black">110023</span></div>
                                <div className="flex justify-between"><span>EVENT_COUNT</span><span className="text-black">08</span></div>
                            </div>
                        </div>
                    </div>
                    {/* Uptime Footer */}
                    <div className="p-4 bg-slate-50 border-t border-black hidden md:block">
                        <div className="flex items-center gap-2">
                            <div className="size-2 bg-teal animate-pulse"></div>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-widest">System Uptime: {uptime}</span>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Map UI Controls (Floating Mobile/Desktop) */}
            <div className="absolute bottom-20 md:bottom-8 left-6 flex flex-col gap-2 z-50">
                <button className="size-10 bg-white border border-black flex items-center justify-center hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] shadow-sm">
                    <span className="material-symbols-outlined">add</span>
                </button>
                <button className="size-10 bg-white border border-black flex items-center justify-center hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] shadow-sm">
                    <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="size-10 bg-white border border-black flex items-center justify-center hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] shadow-sm">
                    <span className="material-symbols-outlined">near_me</span>
                </button>
            </div>
        </div>
    );
}
