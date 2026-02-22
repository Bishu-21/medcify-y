"use client";

import { useEffect, useState } from "react";
import {
    BarChart3,
    AlertCircle,
    Truck,
    ScanLine,
    AlertTriangle,
    Search,
    Map,
    Activity
} from "lucide-react";
import { fetchLiveDashboard } from "@/actions/get-dashboard";
import type { DashboardData } from "@/lib/data/dashboard-service";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const result = await fetchLiveDashboard();
            if (result.success && result.data) {
                setData(result.data);
                setError(null);
            } else {
                setError(result.error || "Failed to load dashboard data");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 20000); // Poll every 20s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4 text-emerald-500">
                    <Activity className="w-8 h-8 animate-pulse" />
                    <p className="text-slate-400 animate-pulse font-medium tracking-wide">Aggregating Live Data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6 glass-panel border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center min-h-[30vh]">
                <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Analytics Engine Error</h2>
                <p className="text-slate-400">{error}</p>
            </div>
        );
    }

    if (!data || data.totalPrescriptions === 0) {
        return (
            <div className="max-w-7xl mx-auto p-10 glass-panel border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                    <ScanLine className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Awaiting Data Streams</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    The Medcify analytics engine is ready. Upload and process prescriptions via OCR to generate real-time predictive insights and dynamic stock alerts.
                </p>
                <a href="/dashboard/ocr" className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                    Initialize First Scan
                </a>
            </div>
        );
    }

    const { totalPrescriptions, averageAccuracy, medicinesTodayCount, lowStockPredictions, prescriptionsPerDay } = data;

    // MVP UI Colors for low stock items to keep the nice aesthetic
    const stockColors = [
        { color: "bg-red-500", text: "text-red-400", w: "25%" },
        { color: "bg-amber-500", text: "text-amber-400", w: "15%" },
        { color: "bg-amber-400", text: "text-amber-400", w: "10%" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

            {/* Component A: AI Critical Alert Banner (Show only if low stock exists) */}
            {lowStockPredictions.length > 0 && (
                <section className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between group gap-4 bg-amber-500/10 border-amber-500/20">
                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-amber-400 font-semibold text-lg flex items-center gap-2">
                                Critical Stockout Predicted
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-xs text-amber-300 border border-amber-500/20">High Priority</span>
                            </p>
                            <p className="text-amber-200/70 text-sm">
                                {lowStockPredictions[0]?.name} supplies predicted to deplete soon due to recent surge. Immediate restock advised.
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 relative shrink-0">
                        Auto-Restock
                    </button>
                </section>
            )}

            {/* Component B: KPI Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI Card 1 */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">Total Prescriptions</span>
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded">Live</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-white">{totalPrescriptions}</h3>
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                {/* KPI Card 2 */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">Critical Stockouts</span>
                        <span className="text-rose-500 text-xs font-bold bg-rose-500/10 px-2 py-0.5 rounded">Action Req</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-white">{lowStockPredictions.length}</h3>
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                {/* KPI Card 3 */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">Meds Extracted Today</span>
                        <span className="text-cyan-400 text-xs font-bold bg-cyan-400/10 px-2 py-0.5 rounded">Today</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-white">{medicinesTodayCount}</h3>
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                            <Truck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                {/* KPI Card 4 */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">AI OCR Accuracy</span>
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded">Avg</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-white">{averageAccuracy}%</h3>
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <ScanLine className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Component C: Bento Box Split */}
            <section className="grid grid-cols-12 gap-6">
                {/* 7-Day AI Demand Forecast */}
                <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">7-Day AI Demand Forecast</h3>
                            <p className="text-slate-400 text-sm">Predictive analysis vs actual regional demand</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500/40"></span>
                                <span className="text-xs text-slate-400">Predicted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500/50"></span>
                                <span className="text-xs text-slate-400">Actual</span>
                            </div>
                        </div>
                    </div>
                    {/* CSS Bar Chart (Visual Representation) */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {/* Days Loop */}
                        {prescriptionsPerDay.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                                <div className="w-full flex justify-center items-end gap-1 h-full relative">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 bg-slate-800 border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        Act: {item.actual} | Pred: {item.predicted}
                                    </div>
                                    <div className="w-2 md:w-4 bg-cyan-500/20 rounded-t-sm transition-all duration-500" style={{ height: `${Math.min(item.predicted, 100)}%` }}></div>
                                    <div className="w-2 md:w-4 bg-emerald-500/50 rounded-t-sm transition-all duration-500" style={{ height: `${Math.min(item.actual, 100)}%` }}></div>
                                </div>
                                <span className="text-xs text-slate-500">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Inventory */}
                <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Low Stock Predictions</h3>
                    <div className="space-y-6">
                        {lowStockPredictions.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">No critical stock warnings currently.</p>
                        ) : (
                            lowStockPredictions.map((item, i) => {
                                const style = stockColors[i % stockColors.length];
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-200 font-medium truncate max-w-[150px]">{item.name}</span>
                                            <span className={`${style.text} font-bold`}>{item.count} unreviewed</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${style.color}`} style={{ width: style.w }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {lowStockPredictions.length > 0 && (
                        <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-all">
                            View Full Inventory
                        </button>
                    )}
                </div>
            </section>

            {/* Component D: Distributor Connect (New Layout) */}
            <section className="glass-panel rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Distributor Connect</h3>
                        <p className="text-sm text-slate-400">Available stock within <span className="text-emerald-400 font-medium">50km</span> network.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select className="pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer">
                                <option>Filter by Region</option>
                                <option>North Zone</option>
                                <option>South Zone</option>
                            </select>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 text-black text-sm font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                            Create Bulk Order
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:opacity-100">
                    {/* Distributor Card 1 */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">MR</div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">MediCorp Regional</h4>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Map className="w-3 h-3" /> 2.4km • Immediate Delivery
                                    </p>
                                </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Amoxicillin</span>
                                <span className="text-white">1,200 units</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Paracetamol</span>
                                <span className="text-white">5,000 units</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 relative z-10">
                            <button className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-black transition-colors">
                                Request Quote
                            </button>
                            <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Truck className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Distributor Card 2 */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">RP</div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Rural Pharma Direct</h4>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Map className="w-3 h-3" /> 12.8km • 4h Lead Time
                                    </p>
                                </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Insulin</span>
                                <span className="text-white">400 units</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Metformin</span>
                                <span className="text-white">850 units</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 relative z-10">
                            <button className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500 hover:text-black transition-colors">
                                Request Quote
                            </button>
                            <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Truck className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Distributor Card 3 */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">ER</div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Emergency Reserves</h4>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> State Govt. • Compliance Req.
                                    </p>
                                </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Full Catalog</span>
                                <span className="text-white">Available</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Lead Time</span>
                                <span className="text-white">Priority Dispatch</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 relative z-10">
                            <button className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-black transition-colors">
                                Request Access
                            </button>
                            <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <AlertCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
