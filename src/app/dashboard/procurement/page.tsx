"use client";

import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Layers,
    MapPin,
    TrendingUp,
    Zap
} from "lucide-react";

export default function ProcurementPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2">Predictive Stock Tower</h1>
                    <p className="text-slate-400">Live algorithmic demand forecasting & <span className="text-cyan-400">automated replenishment</span>.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 flex items-center gap-2 text-sm font-medium">
                        <Activity className="w-4 h-4 animate-pulse" />
                        Active OCR Data Streams
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Scans / Hour", value: "1,248", icon: Layers, color: "text-slate-200" },
                    { label: "Predicted Stockouts (72h)", value: "2 Critical", icon: AlertTriangle, color: "text-amber-400" },
                    { label: "Automated Procurement", value: "$1,450 Drafted", icon: DollarSign, color: "text-emerald-400" },
                    { label: "Demand Horizon", value: "14-Day", icon: TrendingUp, color: "text-cyan-400" },
                ].map((metric, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${metric.color}`}>
                            <metric.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{metric.label}</p>
                            <p className="text-xl font-bold text-slate-100">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Regional Anomalies List */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-1 flex flex-col h-[500px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-400" /> Regional PIN Code Anomalies
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {[
                            { region: "Sector 44, 45 Distribution", issue: "Seasonal Influenza", impact: "High", trend: "+240%" },
                            { region: "East PIN Cluster 11002", issue: "Type 2 Diabetes (Insulin)", impact: "Critical", trend: "Stockout Risk" },
                            { region: "Urban Center Radius", issue: "Upper Respiratory", impact: "Medium", trend: "+85%" },
                            { region: "North Zone Industrial", issue: "Trauma / First Aid", impact: "Low", trend: "Stable" },
                            { region: "West Tech Park", issue: "Migraine / Stress", impact: "Medium", trend: "+120%" },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-slate-200 text-sm group-hover:text-cyan-300 transition-colors">{item.region}</h4>
                                    {item.impact === 'Critical' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">CRITICAL</span>}
                                    {item.impact === 'High' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">HIGH</span>}
                                    {item.impact === 'Medium' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">MED</span>}
                                </div>
                                <p className="text-xs text-slate-400 mb-2">{item.issue}</p>
                                <div className="flex items-center gap-2 text-xs">
                                    <TrendingUp className="w-3 h-3 text-slate-500" />
                                    <span className="text-slate-300">{item.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Procurement Action Center */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Zap className="w-64 h-64 text-emerald-500" />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-emerald-400" /> AI Procurement Action Center
                        </h3>
                        <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">3 Actions Pending</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {/* Action Card 1: Critical */}
                        <div className="p-5 rounded-xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Emergency Restock: Insulin Glargine</h4>
                                        <p className="text-sm text-rose-200/70 mt-1">Predicted stockout in <span className="font-bold text-rose-400">48 hours</span>. East Cluster outbreak detected.</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                            <span>Vendor: <span className="text-slate-200">BioMed Supply Co.</span></span>
                                            <span>Qty: <span className="text-slate-200">500 Units</span></span>
                                            <span>Cost: <span className="text-slate-200">$4,200</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 shrink-0">
                                    <button className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-900/20">
                                        Approve Order
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium text-sm hover:bg-white/10 transition-colors">
                                        Review Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Card 2: Routine */}
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Routine Replenishment: Paracetamol</h4>
                                        <p className="text-sm text-slate-400 mt-1">Monthly bulk order. Demand stable (+2%).</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                            <span>Vendor: <span className="text-slate-200">Generics Ltd.</span></span>
                                            <span>Qty: <span className="text-slate-200">10,000 Units</span></span>
                                        </div>
                                    </div>
                                </div>
                                <button className="self-start sm:self-center p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Action Card 3: Routine */}
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Routine Replenishment: Cetirizine</h4>
                                        <p className="text-sm text-slate-400 mt-1">Quarterly stock update. Seasonal allergy prep.</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                            <span>Vendor: <span className="text-slate-200">AllerGen Pharma</span></span>
                                            <span>Qty: <span className="text-slate-200">2,500 Units</span></span>
                                        </div>
                                    </div>
                                </div>
                                <button className="self-start sm:self-center p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
