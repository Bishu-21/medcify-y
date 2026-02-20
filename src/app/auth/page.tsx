"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Loader2, AlertCircle, Smartphone, KeyRound, Mail, ShieldCheck, CheckCircle2, Building2, FileText, User } from "lucide-react";
import { signInWithEmail, signUpWithEmail, sendPhoneOtp, verifyPhoneOtp } from "@/actions/auth";

type AuthMethod = "password" | "email-otp" | "phone";

export default function AuthPage() {
    const router = useRouter();
    const [authMethod, setAuthMethod] = useState<AuthMethod>("password");

    // Auth State
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Success State (Post-Signup)
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [userId, setUserId] = useState(""); // Needed for verification
    const [otpCode, setOtpCode] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        govtId: "",
        businessName: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (e.target.id === "phone") {
            // Enforce numeric only and max 10 digits
            value = value.replace(/\D/g, '').slice(0, 10);
        }
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtpCode(e.target.value);
    };

    // Handle Password Login/Signup via Server Actions
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage(""); // Clear success message on new attempt

        try {
            // PHONE OTP FLOW
            if (authMethod === "phone") {
                if (!otpSent) {
                    // Send OTP
                    const result = await sendPhoneOtp(formData.phone);
                    if (result.error) {
                        setError(result.error);
                        // If user not found, we could auto-switch to signup, but user requested to "be told"
                        if ('shouldSignUp' in result && result.shouldSignUp) {
                            // Optional: Trigger a UI highlight or visual cue
                        }
                    } else if (result.success && result.userId) {
                        setUserId(result.userId);
                        setOtpSent(true);
                        setSuccessMessage("OTP sent successfully!");
                    }
                } else {
                    // Verify OTP
                    const result = await verifyPhoneOtp(userId, otpCode);
                    if (result.error) {
                        setError(result.error);
                    } else {
                        // Success - Redirect
                        window.location.href = "/dashboard";
                    }
                }
                setLoading(false);
                return;
            }

            // PASSWORD FLOW
            const data = new FormData();
            data.append("email", formData.email);
            data.append("password", formData.password);

            if (isSignUp) {
                data.append("name", formData.name);
                data.append("phone", formData.phone);
                data.append("govtId", formData.govtId);
                data.append("businessName", formData.businessName);
            }

            if (isSignUp) {
                const result = await signUpWithEmail(data);
                if (result?.error) {
                    setError(result.error);
                } else {
                    setIsVerificationSent(true);
                    setSuccessMessage("Account created! Please check your email to verify your identity.");
                }
            } else {
                const result = await signInWithEmail(data);
                if (result?.error) {
                    setError(result.error);
                } else {
                    // Success! Hard redirect to pick up new cookie
                    window.location.href = "/dashboard";
                    return;
                }
            }
        } catch (err: unknown) {
            console.error("Auth Error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-brand-background flex items-center justify-center p-4 overflow-hidden relative font-sans text-slate-200">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="mesh-gradient-animated absolute inset-[-20%]"></div>
            </div>

            {/* Main Card Container */}
            <main className="relative z-10 w-full max-w-5xl glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/10 shadow-2xl">

                {/* Left Column (Brand & Info) */}
                <section className="hidden md:flex md:w-5/12 relative bg-white/[0.02] border-r border-white/5 flex-col p-10 justify-between overflow-hidden">
                    {/* Decorative Visualization */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 100 Q 100 50 200 150 T 400 100" stroke="url(#grad1)" strokeWidth="2" fill="none" />
                            <path d="M0 200 Q 150 250 250 150 T 400 250" stroke="url(#grad1)" strokeWidth="2" fill="none" />
                            <path d="M0 300 Q 50 350 200 250 T 400 350" stroke="url(#grad1)" strokeWidth="2" fill="none" />
                            <defs>
                                <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: "#10B981", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-white font-bold text-xl tracking-tight">Medcify</span>
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
                            {isVerificationSent ? "Almost there." : (isSignUp ? "Join the Network." : "Welcome back.")}
                        </h2>
                        <p className="text-slate-400 font-light leading-relaxed">
                            {isVerificationSent
                                ? "Verify your email to access the dashboard."
                                : "Access predictive inventory insights and local health network data."
                            }
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Enterprise Grade Encryption
                        </div>
                    </div>
                </section>

                {/* Right Column (Auth Form) */}
                <section className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-center bg-brand-background/50 backdrop-blur-sm">

                    {/* Verification Sent State */}
                    {isVerificationSent ? (
                        <div className="text-center space-y-6 animate-fade-in-up">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <Mail className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Check your inbox</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    We sent a verification link to <span className="text-emerald-400">{formData.email}</span>. Please click the link to activate your account.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300">
                                <p>Didn't receive it? <button className="text-emerald-400 hover:underline">Resend Email</button></p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/auth'}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Method Tabs */}
                            {!otpSent && (
                                <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl mb-8 border border-white/5">
                                    <button
                                        onClick={() => setAuthMethod("password")}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${authMethod === "password" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                                    >
                                        <KeyRound className="w-4 h-4" /> Password
                                    </button>
                                    <button
                                        onClick={() => setAuthMethod("email-otp")}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${authMethod === "email-otp" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                                    >
                                        <Mail className="w-4 h-4" /> OTP
                                    </button>
                                    <button
                                        onClick={() => setAuthMethod("phone")}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${authMethod === "phone" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                                    >
                                        <Smartphone className="w-4 h-4" /> Phone
                                    </button>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white">
                                    {otpSent ? "Enter Verification Code" : (isSignUp ? "Create Provider Account" : (authMethod === 'phone' ? "Sign In with Phone" : "Sign In"))}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    {otpSent ? "We sent a 6-digit code to your device." : "Enter your details below to continue."}
                                </p>
                            </div>

                            {/* Sticky Alert Banner */}
                            {(error || successMessage) && (
                                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm animate-fade-in ${error ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
                                    {error ? <AlertCircle className="w-5 h-5 shrink-0 text-red-400" /> : <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />}
                                    <div>
                                        <p className="font-semibold">{error ? "Authentication Error" : "Success"}</p>
                                        <p className="opacity-90">{error || successMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* Main Form */}
                            <form className="space-y-5" onSubmit={handleAuth}>

                                {otpSent ? (
                                    <div className="space-y-1.5 animate-fade-in-up">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="otp">Verification Code</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all font-mono tracking-widest text-lg"
                                                id="otp"
                                                placeholder="123456"
                                                type="text"
                                                maxLength={6}
                                                value={otpCode}
                                                onChange={handleOtpChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {isSignUp && authMethod === "password" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="name">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <input
                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                            id="name"
                                                            placeholder="Dr. John Doe"
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            required={isSignUp}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="phone">Phone</label>
                                                    <div className="relative">
                                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <input
                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                            id="phone"
                                                            placeholder="+91 98765 43210"
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            required={isSignUp}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="businessName">Clinic / Pharmacy Name</label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <input
                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                            id="businessName"
                                                            placeholder="City Care Pharmacy"
                                                            type="text"
                                                            value={formData.businessName}
                                                            onChange={handleInputChange}
                                                            required={isSignUp}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="govtId">Government ID (PAN / Aadhaar / License)</label>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <input
                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                            id="govtId"
                                                            placeholder="ABCDE1234F"
                                                            type="text"
                                                            value={formData.govtId}
                                                            onChange={handleInputChange}
                                                            required={isSignUp}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {authMethod === "phone" ? (
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="phone">Mobile Number</label>
                                                <div className="relative flex items-center">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4 text-slate-500" />
                                                        <span className="text-slate-400 font-mono text-sm border-r border-white/10 pr-2">+91</span>
                                                    </div>
                                                    <input
                                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-16 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all font-mono text-lg tracking-wide"
                                                        id="phone"
                                                        placeholder="98765 43210"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="email">Work Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <input
                                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                        id="email"
                                                        placeholder="name@hospital.com"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {authMethod === "password" && (
                                            <div className="space-y-1.5 animate-fade-in-up">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                                                        {isSignUp ? "Secure Password" : "Password"}
                                                    </label>
                                                    {!isSignUp && <Link className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors" href="#">Forgot password?</Link>}
                                                </div>
                                                <div className="relative">
                                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <input
                                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-0 focus:outline-none input-glow transition-all"
                                                        id="password"
                                                        placeholder="••••••••"
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                {isSignUp && <p className="text-[10px] text-slate-500">Must involve 8+ chars, numbers & symbols.</p>}
                                            </div>
                                        )}
                                    </>
                                )}

                                <button
                                    className="w-full bg-white text-brand-background font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98] shadow-lg shadow-white/5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : (otpSent
                                            ? "Verify & Login"
                                            : (authMethod === "password"
                                                ? (isSignUp ? "Create Provider Account" : "Access Dashboard")
                                                : "Send Verification Code"
                                            )
                                        )
                                    }
                                    {!loading && <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-background" />}
                                </button>
                            </form>

                            {/* Toggle Mode */}
                            <div className="mt-6 text-center text-sm text-slate-400">
                                {isSignUp ? "Already verified?" : "New to Medcify?"}{" "}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                                >
                                    {isSignUp ? "Sign In" : "Apply for Access"}
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </main >
        </div >
    );
}
