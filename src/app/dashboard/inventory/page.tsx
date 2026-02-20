import {
    AlertTriangle,
    Package,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Zap
} from "lucide-react";

export default function InventoryPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2">Stock Intelligence</h1>
                    <p className="text-slate-400">Real-time predictive analytics based on <span className="text-emerald-400">10km radius</span> health trends.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center gap-2 text-sm font-bold shadow-lg shadow-emerald-500/20">
                        <Package className="w-4 h-4" /> Add Stock
                    </button>
                </div>
            </div>

            {/* Top Section: Charts & AI Action */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Demand vs Supply Horizon (Chart) */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Demand vs Supply Horizon</h3>
                            <p className="text-slate-400 text-xs">Projected vs Actual (Last 6 Months)</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                                <span className="text-xs text-slate-400">Demand</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-xs text-slate-400">Supply</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Visual */}
                    <div className="flex-1 flex items-end justify-between gap-4 h-64 px-2">
                        {[
                            { month: "May", d: 40, s: 60 },
                            { month: "Jun", d: 55, s: 50 },
                            { month: "Jul", d: 70, s: 65 },
                            { month: "Aug", d: 60, s: 75 },
                            { month: "Sep", d: 85, s: 50 },
                            { month: "Oct", d: 90, s: 40 },
                        ].map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                                <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-10">
                                        Gap: {item.d - item.s}%
                                    </div>
                                    <div className="w-3 md:w-6 bg-cyan-500 rounded-t-sm transition-all duration-500 hover:bg-cyan-400" style={{ height: `${item.d}%` }}></div>
                                    <div className="w-3 md:w-6 bg-emerald-500 rounded-t-sm transition-all duration-500 hover:bg-emerald-400" style={{ height: `${item.s}%` }}></div>
                                </div>
                                <span className="text-xs text-slate-500">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Action Center */}
                <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-32 h-32 text-amber-500" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" /> AI Action Center
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">Highest Risk Asset</p>
                            <h2 className="text-2xl font-bold text-white">Insulin Glargine</h2>
                            <p className="text-sm text-slate-400">100IU/mL Solution, 3mL Pen</p>
                        </div>

                        <div className="p-4 rounded-xl bg-black/20 border border-amber-500/20 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-300">AI Confidence</span>
                                <span className="text-sm font-bold text-amber-400">94%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[94%]"></div>
                            </div>
                            <p className="text-xs text-amber-200/80 mt-3 flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                Stockout predicted within 72 hours due to regional viral outbreak.
                            </p>
                        </div>

                        <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg">
                            Trigger Auto-Restock
                        </button>
                    </div>
                </div>
            </div>

            {/* Inventory Insights List */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">Detailed Inventory Insights</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 font-medium uppercase tracking-wider">Medication Name</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Category</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Stock Level</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Demand Trend</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Status</th>
                                <th className="p-4 font-medium uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {[
                                { name: "Amoxicillin 500mg", cat: "Antibiotics", stock: 124, trend: "up", status: "Healthy" },
                                { name: "Metformin 500mg", cat: "Antidiabetic", stock: 45, trend: "stable", status: "Low Stock" },
                                { name: "Paracetamol 650mg", cat: "Analgesic", stock: 890, trend: "up", status: "Healthy" },
                                { name: "Atorvastatin 10mg", cat: "Cardio", stock: 210, trend: "down", status: "Excess" },
                                { name: "Insulin Glargine", cat: "Antidiabetic", stock: 12, trend: "surge", status: "Critical" },
                            ].map((item, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 font-medium text-slate-200">{item.name}</td>
                                    <td className="p-4 text-slate-400">
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                                            {item.cat}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        {item.stock} <span className="text-xs text-slate-500">units</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {item.trend === "up" && <span className="text-emerald-400 flex items-center text-xs"><ArrowUpRight className="w-3 h-3 mr-1" /> +12%</span>}
                                            {item.trend === "down" && <span className="text-rose-400 flex items-center text-xs"><ArrowDownRight className="w-3 h-3 mr-1" /> -5%</span>}
                                            {item.trend === "stable" && <span className="text-slate-400 flex items-center text-xs"><MoreHorizontal className="w-3 h-3 mr-1" /> 0%</span>}
                                            {item.trend === "surge" && <span className="text-amber-400 flex items-center text-xs font-bold"><Zap className="w-3 h-3 mr-1" /> SURGE</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {item.status === "Healthy" && <span className="text-emerald-400 text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">Healthy</span>}
                                        {item.status === "Low Stock" && <span className="text-amber-400 text-xs font-bold px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">Low Stock</span>}
                                        {item.status === "Critical" && <span className="text-rose-400 text-xs font-bold px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">Critical</span>}
                                        {item.status === "Excess" && <span className="text-blue-400 text-xs font-bold px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">Excess</span>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-white/5 text-center">
                    <button className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                        View All 1,248 Assets
                    </button>
                </div>
            </div>
        </div>
    );
}
