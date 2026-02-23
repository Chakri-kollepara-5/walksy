import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, Eye, EyeOff, Plus, Wallet as WalletIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

const Wallet = () => {
    const [showBalance, setShowBalance] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState("week");

    const { user } = useAuth();
    const [walletData, setWalletData] = useState({
        balance: 0,
        totalEarned: 0,
        pendingAmount: 0,
        thisWeekEarnings: 0
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchWalletData = async () => {
            if (!user?.uid) return;
            try {
                const { doc, getDoc, collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // 1. Fetch User Stats
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setWalletData(prev => ({
                        ...prev,
                        balance: data.totalEarnings || 0,
                        totalEarned: data.totalEarnings || 0,
                        pendingAmount: 0
                    }));
                }

                // 2. Fetch Recent Transactions
                const q = query(
                    collection(db, "tasks"),
                    where("assignedTo", "==", user.uid),
                    where("status", "==", "completed"),
                    orderBy("completedAt", "desc"),
                    limit(10)
                );

                const snapshot = await getDocs(q);
                const txns = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const date = data.completedAt?.toDate();
                    return {
                        id: doc.id,
                        type: "credit",
                        title: "Task Completed",
                        description: data.title,
                        amount: data.reward,
                        date: date ? date.toLocaleDateString() : "Today",
                        time: date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
                        status: "completed"
                    };
                });

                // Fallback Mock Transactions if empty
                if (txns.length === 0) {
                    setTransactions([
                        { id: "m1", type: "credit", title: "Grocery Delivery", description: "Market Order #429", amount: 150, date: "Today", time: "10:30 AM" },
                        { id: "m2", type: "credit", title: "Package Courier", description: "Swift Delivery", amount: 300, date: "Yesterday", time: "2:15 PM" },
                        { id: "m3", type: "debit", title: "Withdrawal", description: "Transfer to Bank", amount: 2000, date: "12 Oct", time: "09:00 AM" }
                    ]);
                } else {
                    setTransactions(txns);
                }

            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        fetchWalletData();
    }, [user]);

    const periods = [
        { id: "week", label: "Week" },
        { id: "month", label: "Month" },
        { id: "year", label: "Year" }
    ];

    return (
        <PageTransition className="min-h-screen bg-[#020204] pb-32 text-white selection:bg-orange-500/30 overflow-hidden font-sans">

            {/* Lava Aesthetic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 blur-[140px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
                <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-orange-400/5 blur-[100px] rounded-full animate-float" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Wallet
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Manage your earnings & rewards</p>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white w-12 h-12">
                        <Clock size={20} />
                    </Button>
                </header>

                {/* Primary Balance Card - Lava Glassmorphism */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent border border-white/10 mb-8 overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[#0c0c0e]/80 backdrop-blur-3xl rounded-[2.4rem] -z-10" />

                    {/* Interior Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 blur-[80px] group-hover:bg-orange-500/30 transition-all duration-700" />

                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">Available Funds</span>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors"
                            >
                                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-3xl font-bold text-orange-500">₹</span>
                            <span className="text-6xl md:text-7xl font-black tracking-tighter">
                                {showBalance ? walletData.balance.toLocaleString() : "••••"}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex-1 h-14 rounded-2xl bg-orange-500 text-black hover:bg-orange-400 font-bold text-base shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]">
                                <ArrowUpRight size={20} className="mr-2" />
                                Withdraw
                            </Button>
                            <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold text-base backdrop-blur-md">
                                <Plus size={20} className="mr-2" />
                                Top Up
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Total Earned", val: walletData.totalEarned, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10" },
                        { label: "Pending", val: walletData.pendingAmount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "This Week", val: walletData.thisWeekEarnings, icon: CreditCard, color: "text-orange-300", bg: "bg-orange-500/10" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl flex flex-col items-center text-center gap-2 hover:bg-white/[0.05] transition-colors"
                        >
                            <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color} mb-1`}>
                                <stat.icon size={18} />
                            </div>
                            <div>
                                <div className="text-lg font-black leading-none mb-1">₹{stat.val}</div>
                                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider whitespace-nowrap">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Activity List */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                            {periods.map((period) => (
                                <button
                                    key={period.id}
                                    onClick={() => setSelectedPeriod(period.id)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${selectedPeriod === period.id
                                            ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                                            : "text-zinc-500 hover:text-white"
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {transactions.map((txn, i) => (
                                <motion.div
                                    key={txn.id}
                                    layout
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group bg-[#0c0c0e] p-5 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all flex items-center gap-5 shadow-xl"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${txn.type === "credit"
                                            ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                        }`}>
                                        {txn.type === "credit" ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-white text-base truncate">{txn.title}</h4>
                                            <div className={`text-lg font-black ${txn.type === "credit" ? "text-orange-500" : "text-zinc-400"}`}>
                                                {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-zinc-500 truncate font-medium">{txn.description}</p>
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{txn.time} • {txn.date}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 font-bold uppercase tracking-[0.2em] text-[10px]">
                            View Comprehensive History
                        </Button>
                    </div>
                </section>
            </div>

            {/* Bottom Fade */}
            <div className="fixed bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-transparent pointer-events-none z-20" />
        </PageTransition>
    );
};

export default Wallet;
