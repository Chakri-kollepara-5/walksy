import { useState, useEffect, useRef, Suspense } from "react";
import { Clock, Sparkles, MapPin, ArrowRight, TrendingUp, Activity, Search, ChevronDown, Wallet, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { LogoText } from "@/components/Logo";

import StepCounter from "@/components/StepCounter";
import TaskCard from "@/components/TaskCard";
import PostTaskModal from "@/components/PostTaskModal";
import RequesterTaskListener from "@/components/RequesterTaskListener";
import WalkerTaskListener from "@/components/WalkerTaskListener";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePedometer } from "@/hooks/usePedometer";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { acceptTask } from "@/services/taskService";
import WalkerTracker from "@/components/WalkerTracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Walksy3DModel from "@/components/Walksy3DModel";
import HowItWorks from "@/components/HowItWorks";

const GlassPanel = ({ children, className = "" }) => (
    <div className={`relative backdrop-blur-3xl bg-black/40 border border-white/10 rounded-[2rem] shadow-2xl ${className}`}>
        {children}
    </div>
);

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: user?.name || "Walker",
        steps: 0,
        goal: 10000,
        totalUsers: 0,
        earnings: user?.totalEarnings || 0,
    });
    const [quickTasks, setQuickTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHowItWorks, setShowHowItWorks] = useState(false); // NEW STATE
    const userLocation = useGeoLocation();
    const { steps, isTracking, startTracking, setSteps } = usePedometer(userData.steps);

    // Scroll Animations
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
    const showFloatingBar = useTransform(scrollYProgress, [0.1, 1], [0, 1]); // Show bar after scrolling

    useEffect(() => {
        setUserData(prev => ({ ...prev, steps: steps }));
    }, [steps]);

    // Data Fetching 
    useEffect(() => {
        const loadData = async () => {
            try {
                const { collection, query, where, limit, onSnapshot, getDocs } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // Fetch Nearby Tasks
                const q = query(collection(db, "tasks"), limit(3));
                const unsubscribe = onSnapshot(q, (snap) => {
                    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data(), distance: "0.5 km" }));

                    if (tasks.length > 0) {
                        setQuickTasks(tasks);
                    } else {
                        // Fallback Mock Data if DB is empty
                        setQuickTasks([
                            {
                                id: "mock1",
                                title: "Urgent: Coffee Run",
                                description: "Need a Starbucks pickup from Indiranagar. Extra tip for speed!",
                                reward: "150",
                                pickupLocation: "Starbucks, 100ft Road",
                                dropLocation: "WeWork Galaxy",
                                distance: "0.8",
                                category: "delivery",
                                createdAt: new Date(),
                                creatorName: "Sarah K.",
                                status: "open"
                            },
                            {
                                id: "mock2",
                                title: "Document Delivery",
                                description: "Pick up legal documents from Koramangala and drop at HSR.",
                                reward: "300",
                                pickupLocation: "Koramangala 4th Block",
                                dropLocation: "HSR Layout Sector 2",
                                distance: "2.4",
                                category: "delivery",
                                createdAt: new Date(),
                                creatorName: "Law Firm X",
                                status: "open"
                            }
                        ]);
                    }
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (e) {
                console.error("Home data load error", e);
                setLoading(false);
                // Fallback on error too
                setQuickTasks([
                    {
                        id: "mock1",
                        title: "Urgent: Coffee Run",
                        description: "Need a Starbucks pickup from Indiranagar. Extra tip for speed!",
                        reward: "150",
                        pickupLocation: "Starbucks, 100ft Road",
                        dropLocation: "WeWork Galaxy",
                        distance: "0.8",
                        category: "delivery",
                        createdAt: new Date(),
                        creatorName: "Sarah K.",
                        status: "open"
                    }
                ]);
            }
        };
        loadData();
    }, [user]);

    const handleTaskAccept = async (taskId) => {
        try { await acceptTask(taskId, user.uid, user.name || "Walker"); } catch (e) { }
    };

    return (
        <PageTransition className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden pb-32">
            <RequesterTaskListener />
            <WalkerTaskListener />
            <WalkerTracker />

            {/* How It Works Sidebar */}
            <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />

            {/* HEADER - Floating & Minimal */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
                <GlassPanel className="px-6 py-4 flex items-center justify-between !rounded-full bg-black/60 border-white/5 backdrop-blur-xl">
                    <LogoText variant="white" className="scale-90" />

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
                        <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                        <Link to="/wallet" className="hover:text-white transition-colors">Wallet</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold text-white tracking-wide">System Online</span>
                        </div>
                        <Link to="/profile">
                            <Avatar className="h-9 w-9 ring-2 ring-white/10 hover:ring-orange-500 transition-all">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </GlassPanel>
            </header>

            {/* HERO SECTION - Webflow Style (Immersive 3D Center) */}
            <section className="relative h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-[#020202]">

                {/* 3D Background Layer */}
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={null}>
                        <Walksy3DModel />
                    </Suspense>
                </div>

                {/* Hero Content Layer */}
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale, y: contentY }}
                    className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-[-10vh]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200/80">The Future of Gig Walking</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
                    >
                        WALK <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-400 bg-[length:200%_auto] animate-text-shimmer">
                            AND EARN
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-2xl text-zinc-400 font-light max-w-xl mx-auto leading-relaxed mb-10"
                    >
                        Transform your daily steps into real currency.
                        Join the decentralized network of walkers delivering value, one step at a time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            onClick={() => navigate('/tasks')}
                            className="h-14 px-10 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white text-lg font-bold shadow-[0_0_50px_rgba(249,115,22,0.4)] transition-all hover:scale-105 w-full sm:w-auto"
                        >
                            Start Earning Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowHowItWorks(true)}
                            className="h-14 px-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-medium backdrop-blur-sm w-full sm:w-auto"
                        >
                            How it Works
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-20"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="animate-bounce" />
                </motion.div>
            </section>

            {/* FEATURE CARDS - Glassmorphism Grid */}
            <section className="relative z-20 px-6 py-32 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500 bg-gradient-to-br from-white/5 to-transparent">
                        <Activity className="w-10 h-10 text-orange-500 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Precision<br />Tracking</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Our advanced step algorithms ensure every movement is verified and monetized instantly.
                        </p>
                    </GlassPanel>
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500 delay-100 bg-gradient-to-br from-white/5 to-transparent">
                        <TrendingUp className="w-10 h-10 text-blue-500 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Market<br />Rewards</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Dynamic reward scaling based on location demand. Earning potential increases in high-traffic zones.
                        </p>
                    </GlassPanel>
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500 delay-200 bg-gradient-to-br from-white/5 to-transparent">
                        <Wallet className="w-10 h-10 text-green-500 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Instant<br />Payouts</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Complete tasks and get paid immediately to your wallet. No waiting periods, just instant crypto or fiat.
                        </p>
                    </GlassPanel>
                </div>
            </section>

            {/* TASKS SCROLL SECTION - HIGH EMPHASIS */}
            <section id="tasks-preview" className="relative z-20 pb-40 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                            <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Live Feed</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-2">Active Tasks</h2>
                        <p className="text-zinc-500 text-lg">Real-time opportunities in your vicinity.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/tasks')}
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 text-lg px-6 py-6 rounded-2xl border border-orange-500/20"
                    >
                        View All Tasks <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickTasks.map((task, i) => (
                        <motion.div
                            key={task.id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <TaskCard task={task} onAccept={handleTaskAccept} />
                        </motion.div>
                    ))}

                    {/* Primary CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-1 min-h-[300px] rounded-[2rem] border border-dashed border-white/20 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden"
                        onClick={() => navigate('/tasks')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center justify-center h-full gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform text-orange-500 border border-orange-500/20 shadow-xl shadow-orange-500/5">
                                <Search size={32} />
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl text-white block mb-1">Explore More</span>
                                <span className="text-zinc-500">View 50+ tasks nearby</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FLOATING ACTION BAR - "Start Earning" */}
            <motion.div
                style={{ opacity: showFloatingBar }}
                className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md pointer-events-none"
            >
                <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-2 pr-2 ring-1 ring-white/5">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                        <Zap size={24} className="text-white fill-white" />
                    </div>
                    <div className="flex-1 pl-1">
                        <p className="text-white font-bold text-sm leading-tight">Ready to earn?</p>
                        <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wide">Tasks Available Now</p>
                    </div>
                    <Button
                        onClick={() => navigate('/tasks')}
                        size="sm"
                        className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-6 h-10 border-0 shadow-lg"
                    >
                        Go
                    </Button>
                </div>
            </motion.div>

        </PageTransition>
    );
};

export default Home;
