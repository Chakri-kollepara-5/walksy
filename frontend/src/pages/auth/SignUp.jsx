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

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("requester");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                setLoading(false);
                return;
            }
            await register({ name, email, password, role });
            toast.success("Account created! Welcome to Walksy.");
            navigate("/home");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
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

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FCF6EC]/80 via-transparent to-transparent z-10" />

                <div className="relative z-20 text-center px-12 mt-[30vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] border border-[#FE4F4F]/20 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FE4F4F] mb-6 shadow-sm"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE4F4F]/80">Join The Movement</span>
                    </motion.div>
                    <h1 className="text-6xl font-black text-[#FE4F4F] tracking-tighter mb-4 leading-tight font-condensed">
                        Redefine <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE4F4F] to-[#FF7878]">Your Limits.</span>
                    </h1>
                    <p className="text-stone-600 text-lg max-w-md mx-auto">
                        Create an account to start earning, trading, and competing in the global walking economy.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - GLASS FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 overflow-y-auto">

                {/* Moving Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#FE4F4F]/5 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FE4F4F]/5 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10 my-auto"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-[#FE4F4F] mb-2 tracking-tight font-condensed">Create Account</h2>
                        <p className="text-stone-500">Begin your journey today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 group">
                            <Label htmlFor="name" className="text-stone-500 text-xs uppercase font-bold tracking-widest group-focus-within:text-[#FE4F4F] transition-colors">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 bg-[#FFFDF9] border-[#FE4F4F]/15 text-[#2C2520] placeholder:text-stone-400 focus:border-[#FE4F4F]/50 focus:ring-[#FE4F4F]/20 rounded-xl transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2 group">
                            <Label htmlFor="email" className="text-stone-500 text-xs uppercase font-bold tracking-widest group-focus-within:text-[#FE4F4F] transition-colors">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-[#FFFDF9] border-[#FE4F4F]/15 text-[#2C2520] placeholder:text-stone-400 focus:border-[#FE4F4F]/50 focus:ring-[#FE4F4F]/20 rounded-xl transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2 group">
                            <Label htmlFor="password" className="text-stone-500 text-xs uppercase font-bold tracking-widest group-focus-within:text-[#FE4F4F] transition-colors">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-[#FFFDF9] border-[#FE4F4F]/15 text-[#2C2520] placeholder:text-stone-400 focus:border-[#FE4F4F]/50 focus:ring-[#FE4F4F]/20 rounded-xl transition-all shadow-sm"
                                required
                            />
                        </div>

                        {/* Custom Role Selection Cards */}
                        <div className="space-y-2">
                            <Label className="text-stone-500 text-xs uppercase font-bold tracking-widest">I want to...</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setRole("walker")}
                                    className={`cursor-pointer p-4 h-24 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${role === "walker" ? "bg-[#FE4F4F] text-white border-[#FE4F4F] shadow-md shadow-red-200/20" : "bg-[#FFFDF9] border-[#FE4F4F]/15 text-stone-500 hover:bg-[#FE4F4F]/5"}`}
                                >
                                    <span className="text-sm font-black uppercase tracking-wider font-condensed">Walk & Earn</span>
                                    <span className={`text-[10px] ${role === "walker" ? "text-red-100" : "text-stone-400"}`}>Earn rewards daily</span>
                                </div>
                                <div
                                    onClick={() => setRole("requester")}
                                    className={`cursor-pointer p-4 h-24 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${role === "requester" ? "bg-[#FE4F4F] text-white border-[#FE4F4F] shadow-md shadow-red-200/20" : "bg-[#FFFDF9] border-[#FE4F4F]/15 text-stone-500 hover:bg-[#FE4F4F]/5"}`}
                                >
                                    <span className="text-sm font-black uppercase tracking-wider font-condensed">Post Tasks</span>
                                    <span className={`text-[10px] ${role === "requester" ? "text-red-100" : "text-stone-400"}`}>Hire local walkers</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 mt-4 bg-[#FE4F4F] text-white hover:bg-[#E03A3A] font-bold text-lg rounded-xl shadow-md shadow-red-200/25 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign Up"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm">
                            Already have an account?{" "}
                            <Link to="/sign-in" className="text-[#FE4F4F] font-bold hover:text-[#E03A3A] transition-colors relative inline-block group">
                                Sign In
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FE4F4F] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;
