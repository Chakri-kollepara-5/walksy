import { useState, useEffect, useRef, Suspense } from "react";
import { Clock, MapPin, ArrowRight, Search, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { LogoText } from "@/components/Logo";

import StepCounter from "@/components/StepCounter";
import TaskCard from "@/components/TaskCard";
import PostTaskModal from "@/components/PostTaskModal";
import RequesterTaskListener from "@/components/RequesterTaskListener";
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
    <div className={`relative backdrop-blur-3xl bg-[#FFFDF9]/80 border border-[#FE4F4F]/15 rounded-[2rem] shadow-lg shadow-red-200/5 ${className}`}>
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

    // Data Fetching - Real-time listener for Active Tasks
    useEffect(() => {
        const loadData = async () => {
            try {
                const { collection, query, where, orderBy, limit, onSnapshot, getDocs } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // Fetch Nearby Tasks with real-time updates - ordered by creation time (newest first)
                const q = query(
                    collection(db, "tasks"),
                    orderBy("createdAt", "desc"),
                    limit(6)
                );

                const unsubscribe = onSnapshot(q, (snap) => {
                    const tasks = snap.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                        distance: d.data().distance || "0.5",
                        isNew: isTaskNew(d.data().createdAt)
                    }));

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
                                status: "open",
                                isNew: false
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
                                status: "open",
                                isNew: false
                            }
                        ]);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Home Firestore listener error:", error);
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
                        status: "open",
                        isNew: false
                    }
                ]);
            }
        };
        loadData();
    }, [user]);

    // Helper function to check if a task is new (posted within last 5 minutes)
    const isTaskNew = (createdAt) => {
        if (!createdAt) return false;
        const taskTime = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        const now = new Date();
        const diffMinutes = (now - taskTime) / (1000 * 60);
        return diffMinutes < 5;
    };

    const handleTaskAccept = async (taskId) => {
        try { await acceptTask(taskId, user.uid, user.name || "Walker"); } catch (e) { }
    };

    return (
        <PageTransition className="min-h-screen bg-[#FCF6EC] text-[#2C2520] selection:bg-[#FE4F4F]/30 overflow-x-hidden pb-32 bg-grid-dotted relative">
            <RequesterTaskListener />
            <WalkerTracker />

            {/* How It Works Sidebar */}
            <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />

            {/* HEADER - Floating & Minimal */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
                <GlassPanel className="px-6 py-4 flex items-center justify-between !rounded-full bg-[#FFFDF9]/90 border-[#FE4F4F]/15 backdrop-blur-xl">
                    <LogoText variant="default" className="scale-90" />

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
                        <Link to="/tasks" className="hover:text-[#FE4F4F] transition-colors">Tasks</Link>
                        <Link to="/leaderboard" className="hover:text-[#FE4F4F] transition-colors">Leaderboard</Link>
                        <Link to="/wallet" className="hover:text-[#FE4F4F] transition-colors">Wallet</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FE4F4F]/5 border border-[#FE4F4F]/15">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold text-[#FE4F4F] tracking-wide">System Online</span>
                        </div>
                        <Avatar className="h-9 w-9 ring-2 ring-[#FE4F4F]/15 hover:ring-[#FE4F4F] transition-all">
                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                </GlassPanel>
            </header>

            {/* HERO SECTION - Webflow Style (Immersive 3D Center) */}
            <section className="relative h-[110vh] flex flex-col items-center justify-center overflow-hidden">

                {/* 3D Background Layer */}
                <div className="absolute inset-0 z-0 opacity-40 md:opacity-60 pointer-events-none">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#FE4F4F]/25 backdrop-blur-md mb-8 shadow-sm"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE4F4F]">The Future of Gig Walking</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-[#FE4F4F] mb-8 leading-[0.9] font-condensed"
                    >
                        WALK <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE4F4F] to-[#FF7878]">
                            AND EARN
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-2xl text-stone-600 font-light max-w-xl mx-auto leading-relaxed mb-10"
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
                            className="h-14 px-10 rounded-full bg-[#FE4F4F] hover:bg-[#E03A3A] text-white text-lg font-bold shadow-[0_0_30px_rgba(254,79,79,0.3)] transition-all hover:scale-105 w-full sm:w-auto border-0"
                        >
                            Start Earning Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowHowItWorks(true)}
                            className="h-14 px-10 rounded-full border border-[#FE4F4F]/25 bg-[#FFFDF9] hover:bg-[#FE4F4F]/5 text-stone-600 font-medium w-full sm:w-auto transition-all"
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
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#FE4F4F]/50 z-20"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="animate-bounce" />
                </motion.div>
            </section>

            {/* TASKS SCROLL SECTION - HIGH EMPHASIS (Moved Above Features) */}
            <section id="tasks-preview" className="relative z-20 pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE4F4F]/10 border border-[#FE4F4F]/20">
                                <span className="w-2 h-2 rounded-full bg-[#FE4F4F] animate-pulse" />
                                <span className="text-[#FE4F4F] font-bold tracking-[0.2em] text-[10px] uppercase">Live Feed</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#FE4F4F]/15">
                                <span className="text-[#FE4F4F]/80 font-bold text-[10px] uppercase tracking-wider">
                                    {quickTasks.length} Active Tasks
                                </span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#FE4F4F] mb-2 tracking-tight font-condensed">Available Nearby</h2>
                        <p className="text-stone-500 text-lg">Real-time opportunities in your vicinity.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/tasks')}
                        variant="ghost"
                        className="text-[#FE4F4F] hover:text-[#E03A3A] hover:bg-[#FE4F4F]/5 text-lg px-6 py-6 rounded-2xl border border-[#FE4F4F]/20"
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
                        className="md:col-span-1 min-h-[300px] rounded-[2rem] border-2 border-dashed border-[#FE4F4F]/20 hover:border-[#FE4F4F]/60 hover:bg-[#FE4F4F]/5 transition-all group cursor-pointer relative overflow-hidden bg-[#FFFDF9] shadow-md shadow-red-200/5"
                        onClick={() => navigate('/tasks')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FE4F4F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center justify-center h-full gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-full bg-[#FE4F4F]/10 flex items-center justify-center group-hover:scale-110 transition-transform text-[#FE4F4F] border border-[#FE4F4F]/20 shadow-lg shadow-red-200/5">
                                <Search size={32} />
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-2xl text-[#FE4F4F] block mb-1">Explore More</span>
                                <span className="text-stone-500">View 50+ tasks nearby</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURE CARDS - Glassmorphism Grid */}
            <section className="relative z-20 px-6 py-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500">
                        <h3 className="font-condensed text-3xl font-black text-[#FE4F4F] tracking-wide mb-4">Precision<br />Tracking</h3>
                        <p className="text-stone-600 leading-relaxed">
                            Our advanced step algorithms ensure every movement is verified and monetized instantly.
                        </p>
                    </GlassPanel>
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500 delay-100">
                        <h3 className="font-condensed text-3xl font-black text-[#FE4F4F] tracking-wide mb-4">Market<br />Rewards</h3>
                        <p className="text-stone-600 leading-relaxed">
                            Dynamic reward scaling based on location demand. Earning potential increases in high-traffic zones.
                        </p>
                    </GlassPanel>
                    <GlassPanel className="p-10 hover:translate-y-[-10px] transition-transform duration-500 delay-200">
                        <h3 className="font-condensed text-3xl font-black text-[#FE4F4F] tracking-wide mb-4">Instant<br />Payouts</h3>
                        <p className="text-stone-600 leading-relaxed">
                            Complete tasks and get paid immediately to your wallet. No waiting periods, just instant crypto or fiat.
                        </p>
                    </GlassPanel>
                </div>
            </section>

            {/* FLOATING ACTION BAR - "Start Earning" */}
            <motion.div
                style={{ opacity: showFloatingBar }}
                className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md pointer-events-none"
            >
                <div className="pointer-events-auto bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#FE4F4F]/15 p-2 rounded-full shadow-xl shadow-red-200/10 flex items-center gap-2 pr-2 ring-1 ring-[#FE4F4F]/5">
                    <div className="flex-1 pl-4">
                        <p className="text-[#2C2520] font-bold text-sm leading-tight">Ready to earn?</p>
                        <p className="text-[#FE4F4F] text-[10px] font-bold uppercase tracking-wide">Tasks Available Now</p>
                    </div>
                    <Button
                        onClick={() => navigate('/tasks')}
                        size="sm"
                        className="rounded-full bg-[#FE4F4F] hover:bg-[#E03A3A] text-white font-bold px-6 h-10 border-0 shadow-md"
                    >
                        Go
                    </Button>
                </div>
            </motion.div>

        </PageTransition>
    );
};

export default Home;
