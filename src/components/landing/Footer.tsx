import Link from "next/link";
import { Activity, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 pt-20 pb-12 bg-brand-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">Medcify</span>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-6">
                            Empowering the last-mile healthcare infrastructure with Silicon Valley grade AI and logistics intelligence.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-slate-400 hover:text-emerald-400">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-slate-400 hover:text-emerald-400">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">OCR Engine</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Forecasting API</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Distributor Sync</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Case Studies</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2024 Medcify AI Systems Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-slate-300 transition-colors">Status</Link>
                        <Link href="#" className="hover:text-slate-300 transition-colors">Cookies</Link>
                        <Link href="#" className="hover:text-slate-300 transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
