import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Walksy3DModel from "@/components/Walksy3DModel";
import { ArrowRight, Loader2 } from "lucide-react";

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
        <div className="flex min-h-screen bg-[#FCF6EC] overflow-hidden bg-grid-dotted relative">

            {/* LEFT SIDE - 3D VISUALS (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#FFFDF9] border-r border-[#FE4F4F]/10 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40 md:opacity-60 pointer-events-none">
                    <Suspense fallback={<div className="w-full h-full bg-[#FCF6EC] animate-pulse" />}>
                        <Walksy3DModel />
                    </Suspense>
                </div>

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FCF6EC]/80 via-transparent to-transparent z-10" />

                <div className="relative z-20 text-center px-12 mt-[30vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] border border-[#FE4F4F]/20 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FE4F4F] mb-6 shadow-sm"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE4F4F]/80">Join now</span>
                    </motion.div>
                    <h1 className="text-6xl font-black text-[#FE4F4F] tracking-tighter mb-4 leading-tight font-condensed">
                        Walk into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE4F4F] to-[#FF7878]">The Future.</span>
                    </h1>
                    <p className="text-stone-600 text-lg max-w-md mx-auto">
                        Join the elite network of walkers earning crypto for every step. Your journey begins now.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - GLASS FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">

                {/* Moving Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#FE4F4F]/5 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FE4F4F]/5 blur-[150px] rounded-full animate-pulse-slow delay-1000" />

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
                        <h2 className="text-4xl font-black text-[#FE4F4F] mb-2 tracking-tight font-condensed">Welcome Back</h2>
                        <p className="text-stone-500">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="email" className="text-stone-500 text-xs uppercase font-bold tracking-widest group-focus-within:text-[#FE4F4F] transition-colors">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-14 bg-[#FFFDF9] border-[#FE4F4F]/15 text-[#2C2520] placeholder:text-stone-400 focus:border-[#FE4F4F]/50 focus:ring-[#FE4F4F]/20 rounded-xl transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2 group">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-stone-500 text-xs uppercase font-bold tracking-widest group-focus-within:text-[#FE4F4F] transition-colors">Password</Label>
                                <Link to="#" className="text-xs text-[#FE4F4F] hover:text-[#E03A3A] font-bold">Forgot?</Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 bg-[#FFFDF9] border-[#FE4F4F]/15 text-[#2C2520] placeholder:text-stone-400 focus:border-[#FE4F4F]/50 focus:ring-[#FE4F4F]/20 rounded-xl transition-all shadow-sm"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#FE4F4F] text-white hover:bg-[#E03A3A] font-bold text-lg rounded-xl shadow-md shadow-red-200/25 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm">
                            Don't have an account?{" "}
                            <Link to="/sign-up" className="text-[#FE4F4F] font-bold hover:text-[#E03A3A] transition-colors relative inline-block group">
                                Create Account
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FE4F4F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignIn;
