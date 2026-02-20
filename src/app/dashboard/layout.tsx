"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { getCurrentUser } from "@/lib/appwrite/api";
import {
    Activity,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Bell,
    LogOut,
    Search,
    TrendingUp,
    Map,
    Heart,
} from "lucide-react";

interface User {
    $id: string;
    name: string;
    email: string;
    prefs?: Record<string, unknown>;
    [key: string]: unknown;
}

const FALLBACK_USER: User = {
    $id: "local",
    name: "Medcify User",
    email: "",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            router.push("/auth");
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            // Try client-side Appwrite SDK first (most reliable)
            try {
                const clientUser = await getCurrentUser();
                if (clientUser) {
                    setUser(clientUser as unknown as User);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Client auth check failed:", err);
            }

            // If no session found, use fallback user to allow dashboard access
            // This ensures the dashboard is always accessible during development
            setUser(FALLBACK_USER);
            setLoading(false);
        };
        checkSession();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-background flex items-center justify-center text-emerald-500">
                <Activity className="w-8 h-8 animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center text-slate-400 gap-4">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-brand-background overflow-hidden relative font-sans text-slate-200">
            {/* Background Mesh (Stitch Style) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] opacity-20"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-72 glass-sidebar flex flex-col z-20 shrink-0">
                {/* Logo Section */}
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                            <Activity className="h-5 w-5 text-slate-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Medcify <span className="text-cyan-400">OS</span></span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="/dashboard/ocr" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all">
                        <Search className="w-5 h-5" />
                        <span className="font-medium">OCR Scan</span>
                    </a>
                    <a href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Inventory</span>
                    </a>
                    <a href="/dashboard/procurement" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">AI Forecasts</span>
                    </a>
                    <a href="/dashboard/wellness" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Wellness Hub</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Orders</span>
                        <span className="ml-auto w-5 h-5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full flex items-center justify-center">3</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                        <Map className="w-5 h-5" />
                        <span className="font-medium">Network Map</span>
                    </a>
                </nav>

                {/* Profile Footer */}
                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel group relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white uppercase">
                                {user.name ? String(user.name).charAt(0) : "U"}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{String(user.name || "User")}</p>
                            <p className="text-xs text-slate-400 truncate">{String(user.email || "")}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 z-10">
                {/* Top Navbar */}
                <header className="h-20 glass-navbar flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-slate-50">Overview</h1>
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-cyan"></div>
                            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">AI Sync: Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                className="w-full bg-white/[0.04] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 placeholder:text-slate-500 transition-all"
                                placeholder="Search inventory..."
                                type="text"
                            />
                        </div>
                        {/* Notification */}
                        <button className="relative p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
                            <Bell className="text-slate-300 w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0B0F19]"></span>
                        </button>
                        {/* Date */}
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-200">Oct 24, 2023</p>
                            <p className="text-xs text-slate-500 uppercase">10:45 AM GMT+5</p>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
