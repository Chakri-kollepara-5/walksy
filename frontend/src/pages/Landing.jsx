import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Walksy3DModel from "@/components/Walksy3DModel";

const Landing = () => {
    const [stats, setStats] = useState({
        totalWalkers: 3,
        totalTasksCompleted: 3,
        totalEarnings: 555
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRealStats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                let usersList = [];
                querySnapshot.forEach((doc) => {
                    usersList.push(doc.data());
                });

                if (usersList.length === 0) {
                    console.log("No users found in Firestore. Seeding original data...");
                    const { seedFirestoreData } = await import("@/lib/seed");
                    const seedSuccess = await seedFirestoreData();
                    if (seedSuccess) {
                        // Refetch
                        const refetchedSnapshot = await getDocs(collection(db, "users"));
                        usersList = [];
                        refetchedSnapshot.forEach((doc) => {
                            usersList.push(doc.data());
                        });
                    }
                }

                let totalWalkers = 0;
                let totalTasksCompleted = 0;
                let totalEarnings = 0;

                usersList.forEach((data) => {
                    if (data.role === "walker" || (data.totalSteps || 0) > 0 || (data.totalEarnings || 0) > 0) {
                        totalWalkers++;
                    }
                    totalTasksCompleted += (data.totalTasksCompleted || 0);
                    totalEarnings += (data.totalEarnings || 0);
                });

                setStats({
                    totalWalkers: totalWalkers || 3,
                    totalTasksCompleted: totalTasksCompleted || 3,
                    totalEarnings: totalEarnings || 555
                });
                setLoading(false);
            } catch (firestoreError) {
                console.warn("Firestore stats fetch blocked by rules. Falling back to Express backend stats...", firestoreError);
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                    const response = await fetch(`${apiUrl}/stats`);
                    if (response.ok) {
                        const data = await response.json();
                        setStats({
                            totalWalkers: data.totalWalkers || 3,
                            totalTasksCompleted: data.totalTasksCompleted || 3,
                            totalEarnings: data.totalEarnings || 555
                        });
                    } else {
                        setStats({
                            totalWalkers: 3,
                            totalTasksCompleted: 3,
                            totalEarnings: 555
                        });
                    }
                } catch (backendError) {
                    console.error("Backend stats fallback fetch failed:", backendError);
                    setStats({
                        totalWalkers: 3,
                        totalTasksCompleted: 3,
                        totalEarnings: 555
                    });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRealStats();
    }, []);

    return (
        <PageTransition className="min-h-screen bg-[#FCF6EC] text-[#FE4F4F] overflow-x-hidden font-sans bg-grid-dotted relative">
            {/* Header / Navbar */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-20">
                <Link to="/" className="font-condensed text-4xl font-black tracking-wider text-[#FE4F4F] hover:scale-105 transition-all duration-200">
                    WALKSY
                </Link>
                
                {/* Center Links (Desktop only) */}
                <div className="hidden md:flex items-center gap-10">
                    <a href="#features" className="font-condensed text-xl font-bold text-stone-600 hover:text-[#FE4F4F] transition-colors tracking-wide uppercase">
                        Features
                    </a>
                    <a href="#tokenomics" className="font-condensed text-xl font-bold text-stone-600 hover:text-[#FE4F4F] transition-colors tracking-wide uppercase">
                        Tokenomics
                    </a>
                    <a href="#platform" className="font-condensed text-xl font-bold text-stone-600 hover:text-[#FE4F4F] transition-colors tracking-wide uppercase">
                        Platform
                    </a>
                    <a href="#staking" className="font-condensed text-xl font-bold text-stone-600 hover:text-[#FE4F4F] transition-colors tracking-wide uppercase">
                        Staking
                    </a>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-4">
                    <Button 
                        asChild 
                        className="rounded-full bg-[#FE4F4F] hover:bg-[#E03A3A] text-white border-0 font-condensed text-lg px-6 py-2 h-10 shadow-md shadow-red-200/25 transition-all duration-300"
                    >
                        <Link to="/sign-in">LAUNCH APP</Link>
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-white border border-[#FE4F4F]/25 flex items-center justify-center text-[#FE4F4F] cursor-pointer hover:scale-105 transition-transform shadow-sm">
                        <Globe className="w-5 h-5" />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto overflow-hidden">
                {/* 3D Running Soldier Background (Transparent background) */}
                <div className="absolute inset-0 z-0 opacity-30 md:opacity-45 pointer-events-none">
                    <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FE4F4F]"></div>
                        </div>
                    }>
                        <Walksy3DModel />
                    </Suspense>
                </div>

                <div className="relative z-10 w-full flex flex-col items-center justify-center">
                    {/* Floating Status Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FE4F4F]/25 text-xs font-bold mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FE4F4F] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FE4F4F]"></span>
                        </span>
                        <span className="uppercase tracking-wider text-[#FE4F4F]">SECURE PEER-TO-PEER WALK FLOW LIVE</span>
                    </div>

                    {/* Big Wordmark Layer */}
                    <div className="relative w-full flex flex-col md:flex-row items-center justify-center font-condensed text-[7rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-bold text-[#FE4F4F] leading-none select-none tracking-tighter drop-shadow-[0_4px_8px_rgba(254,79,79,0.15)]">
                        {/* WALK */}
                        <span className="z-10 md:mr-4">WALK</span>
                        
                        {/* Custom Orange/Red Equal Sign (=) */}
                        <div className="z-10 flex flex-col gap-2 md:gap-4 justify-center items-center px-4 md:px-8 my-4 md:my-0">
                            <div className="w-16 h-3 sm:w-24 sm:h-5 md:w-32 md:h-6 bg-[#FE4F4F] rounded-full shadow-[0_0_12px_rgba(254,79,79,0.3)]"></div>
                            <div className="w-16 h-3 sm:w-24 sm:h-5 md:w-32 md:h-6 bg-[#FE4F4F] rounded-full shadow-[0_0_12px_rgba(254,79,79,0.3)]"></div>
                        </div>
                        
                        {/* EARN */}
                        <span className="z-10 md:ml-4 text-[#FE4F4F]">EARN</span>
                    </div>
                </div>

                {/* Subtitle */}
                <h2 className="relative z-10 font-condensed text-xl sm:text-2xl md:text-3xl tracking-[0.15em] text-stone-600 text-center mt-8 uppercase max-w-3xl leading-relaxed">
                    Turn your daily steps into crypto & real cash earnings
                </h2>

                {/* Main Action Button */}
                <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        size="lg" 
                        className="h-14 px-10 rounded-full bg-[#FE4F4F] hover:bg-[#E03A3A] text-white font-condensed text-xl shadow-[0_0_30px_rgba(254,79,79,0.3)] hover:scale-105 transition-all duration-300 border-0"
                        asChild
                    >
                        <Link to="/sign-up" className="flex items-center">
                            START EARNING NOW <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-[#FE4F4F]/10">
                <div className="text-center mb-16">
                    <h2 className="font-condensed text-4xl sm:text-5xl font-black text-[#FE4F4F] tracking-wide uppercase">
                        The Walksy Ecosystem
                    </h2>
                    <p className="text-[#FE4F4F] font-semibold opacity-85 mt-2 uppercase tracking-wider text-sm">
                        Walk to earn, gig to live
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Interactive Tasks Nearby map route mockup */}
                    <motion.div 
                        whileHover={{ y: -6 }}
                        className="bg-[#FFFDF9] p-8 rounded-[2rem] border-2 border-[#FE4F4F]/25 hover:border-[#FE4F4F]/60 shadow-lg shadow-red-200/5 transition-all duration-300 flex flex-col items-center text-center"
                    >
                        {/* Interactive map route visual instead of icon */}
                        <div className="relative w-full h-32 bg-[#FDFBF7] border border-[#FE4F4F]/15 rounded-2xl overflow-hidden mb-6 flex items-center justify-center bg-grid-dotted">
                            <svg className="absolute inset-0 w-full h-full">
                                <path 
                                    d="M 40,90 Q 110,35 210,65" 
                                    fill="none" 
                                    stroke="#FE4F4F" 
                                    strokeWidth="2.5" 
                                    strokeDasharray="4,4"
                                    className="opacity-75"
                                />
                            </svg>
                            {/* Start Location Node */}
                            <div className="absolute left-[35px] top-[80px] w-4 h-4 bg-[#FE4F4F] rounded-full flex items-center justify-center shadow-md">
                                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-[#FE4F4F] opacity-75"></span>
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            {/* Destination Node */}
                            <div className="absolute right-[40px] top-[55px] w-6 h-6 bg-[#FE4F4F] rounded-full flex items-center justify-center text-white shadow-md text-xs font-bold font-condensed">
                                A
                            </div>
                            {/* Floating Task Earning Badge */}
                            <div className="absolute left-[70px] top-[15px] bg-white border border-[#FE4F4F]/25 shadow-md rounded-xl py-1 px-2.5 flex items-center gap-1.5 scale-90">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="font-condensed font-bold text-[10px] text-[#FE4F4F] uppercase tracking-wide">OTP GIG: +₹450</span>
                            </div>
                        </div>

                        <h3 className="font-condensed text-2xl font-bold text-[#FE4F4F] mb-3 uppercase tracking-wide">Tasks Nearby</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Find high-paying local tasks within walking distance using our interactive real-time map.
                        </p>
                    </motion.div>

                    {/* Card 2: Interactive Wallet Ledger mockup */}
                    <motion.div 
                        whileHover={{ y: -6 }}
                        className="bg-[#FFFDF9] p-8 rounded-[2rem] border-2 border-[#FE4F4F]/25 hover:border-[#FE4F4F]/60 shadow-lg shadow-red-200/5 transition-all duration-300 flex flex-col items-center text-center"
                    >
                        {/* Interactive Wallet Balance & Ledger mockup instead of icon */}
                        <div className="relative w-full h-32 bg-[#FDFBF7] border border-[#FE4F4F]/15 rounded-2xl overflow-hidden mb-6 p-4 flex flex-col justify-between">
                            {/* Balance visual */}
                            <div className="flex justify-between items-center border-b border-[#FE4F4F]/15 pb-2">
                                <span className="font-condensed font-bold text-[11px] text-zinc-500 uppercase tracking-wider">Wallet Balance</span>
                                <span className="font-condensed font-black text-sm text-[#FE4F4F]">₹12,480.00</span>
                            </div>
                            {/* Mini Ledger */}
                            <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-semibold text-stone-600">UPI Payout Success</span>
                                    <span className="font-bold text-emerald-600">+₹3,500</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-semibold text-stone-600">Walk Reward Credited</span>
                                    <span className="font-bold text-emerald-600">+₹1,250</span>
                                </div>
                            </div>
                            {/* Tag */}
                            <div className="absolute right-4 bottom-2 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                                Instant UPI
                            </div>
                        </div>

                        <h3 className="font-condensed text-2xl font-bold text-[#FE4F4F] mb-3 uppercase tracking-wide">Instant Payouts</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Withdraw your earnings directly to your bank account, UPI, or connected crypto wallet instantly.
                        </p>
                    </motion.div>

                    {/* Card 3: Interactive OTP grid verification mockup */}
                    <motion.div 
                        whileHover={{ y: -6 }}
                        className="bg-[#FFFDF9] p-8 rounded-[2rem] border-2 border-[#FE4F4F]/25 hover:border-[#FE4F4F]/60 shadow-lg shadow-red-200/5 transition-all duration-300 flex flex-col items-center text-center"
                    >
                        {/* Interactive Secure OTP input layout instead of icon */}
                        <div className="relative w-full h-32 bg-[#FDFBF7] border border-[#FE4F4F]/15 rounded-2xl overflow-hidden mb-6 p-4 flex flex-col justify-center items-center">
                            {/* OTP Digits */}
                            <div className="flex gap-2 mb-2.5">
                                <div className="w-8 h-8 rounded-lg border-2 border-[#FE4F4F] flex items-center justify-center font-condensed font-black text-sm text-[#FE4F4F] bg-white shadow-sm">7</div>
                                <div className="w-8 h-8 rounded-lg border-2 border-[#FE4F4F] flex items-center justify-center font-condensed font-black text-sm text-[#FE4F4F] bg-white shadow-sm">9</div>
                                <div className="w-8 h-8 rounded-lg border-2 border-[#FE4F4F] flex items-center justify-center font-condensed font-black text-sm text-[#FE4F4F] bg-white shadow-sm">2</div>
                                <div className="w-8 h-8 rounded-lg border-2 border-dashed border-[#FE4F4F]/30 flex items-center justify-center font-condensed font-black text-sm text-[#FE4F4F]/30 bg-white">?</div>
                            </div>
                            {/* Security Tag */}
                            <div className="flex items-center gap-1.5 bg-[#FE4F4F]/10 border border-[#FE4F4F]/25 px-2.5 py-1 rounded-full scale-90">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FE4F4F] animate-pulse"></div>
                                <span className="font-condensed font-bold text-[10px] text-[#FE4F4F] uppercase tracking-wider">P2P OTP SECURED</span>
                            </div>
                        </div>

                        <h3 className="font-condensed text-2xl font-bold text-[#FE4F4F] mb-3 uppercase tracking-wide">Safe & Secure</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Every transaction and gig is fully verified by our smart contract and secure OTP verification protocols.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Platform Stats / Tokenomics Section */}
            <section id="tokenomics" className="py-24 bg-[#FE4F4F] text-[#FCF6EC] px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-dotted opacity-25 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="font-condensed text-7xl font-bold mb-2">
                                {loading ? "..." : stats.totalWalkers}
                            </div>
                            <div className="font-condensed text-xl tracking-wider uppercase opacity-90">Active Walkers</div>
                        </div>
                        <div>
                            <div className="font-condensed text-7xl font-bold mb-2">
                                {loading ? "..." : stats.totalTasksCompleted}
                            </div>
                            <div className="font-condensed text-xl tracking-wider uppercase opacity-90">Completed Tasks</div>
                        </div>
                        <div>
                            <div className="font-condensed text-7xl font-bold mb-2">
                                {loading ? "..." : `₹${stats.totalEarnings.toLocaleString()}`}
                            </div>
                            <div className="font-condensed text-xl tracking-wider uppercase opacity-90">Commissions Earned</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#FCF6EC] text-[#FE4F4F] py-16 px-6 border-t border-[#FE4F4F]/10 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link to="/" className="font-condensed text-3xl font-black tracking-wider text-[#FE4F4F] hover:opacity-75 transition-opacity">
                            WALKSY
                        </Link>
                        <p className="text-xs font-semibold opacity-75">
                            Walk-to-earn, redefined for the modern economy.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 font-condensed text-lg font-bold">
                        <Link to="/about" className="hover:opacity-75 transition-opacity">About</Link>
                        <Link to="/privacy" className="hover:opacity-75 transition-opacity">Privacy</Link>
                        <Link to="/terms" className="hover:opacity-75 transition-opacity">Terms</Link>
                        <Link to="/contact" className="hover:opacity-75 transition-opacity">Contact</Link>
                    </div>

                    <div className="text-xs font-semibold opacity-60">
                        © {new Date().getFullYear()} Walksy Technologies. All rights reserved.
                    </div>
                </div>
            </footer>
        </PageTransition>
    );
};

export default Landing;
