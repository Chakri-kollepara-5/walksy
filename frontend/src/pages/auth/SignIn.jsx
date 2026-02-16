import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Walksy3DModel from "@/components/Walksy3DModel";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            toast.success("Welcome back to the future of earning.");
            navigate("/home");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#020204] overflow-hidden">

            {/* LEFT SIDE - 3D VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-black overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={<div className="w-full h-full bg-black animate-pulse" />}>
                        <Walksy3DModel />
                    </Suspense>
                </div>

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

                <div className="relative z-20 text-center px-12 mt-[30vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
                    >
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200/80">Join now</span>
                    </motion.div>
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
                        Walk into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">The Future.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto">
                        Join the elite network of walkers earning crypto for every step. Your journey begins now.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - GLASS FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">

                {/* Moving Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow delay-1000" />

                    {/* Subtle Moving Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-zinc-500">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="email" className="text-zinc-400 text-xs uppercase font-bold tracking-widest group-focus-within:text-orange-500 transition-colors">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2 group">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-400 text-xs uppercase font-bold tracking-widest group-focus-within:text-orange-500 transition-colors">Password</Label>
                                <Link to="#" className="text-xs text-orange-400 hover:text-orange-300 font-bold">Forgot?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-zinc-500 text-sm">
                            Don't have an account?{" "}
                            <Link to="/sign-up" className="text-white font-bold hover:text-orange-400 transition-colors relative inline-block group">
                                Create Account
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignIn;
