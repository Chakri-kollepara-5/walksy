import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, Eye, EyeOff, Plus, Wallet as WalletIcon, Clock, Zap } from "lucide-react";
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
                        { id: "m1", type: "credit", title: "Coffee Run", description: "Starbucks Delivery", amount: 150, date: "Today", time: "10:30 AM" },
                        { id: "m2", type: "credit", title: "Document Courier", description: "Legal Papers", amount: 300, date: "Yesterday", time: "2:15 PM" },
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
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
        { id: "year", label: "This Year" }
    ];

    return (
        <PageTransition className="min-h-screen bg-[#020204] pb-32 relative text-white selection:bg-orange-500/30 overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
            <div className="fixed top-[20%] right-[-20%] w-[600px] h-[600px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative pt-6 px-6 md:px-10 z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-inner backdrop-blur-md">
                                <WalletIcon size={20} className="text-purple-400" />
                            </div>
                            My Wallet
                        </h1>
                        <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white">
                            <Clock size={18} />
                        </Button>
                    </div>

                    {/* Holographic Balance Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative bg-[#0c0c0e] border border-white/10 rounded-[2rem] p-8 shadow-2xl shadow-purple-900/10 overflow-hidden group"
                    >
                        {/* Card Glows */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-purple-500/10 blur-[80px]" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                    <Zap size={12} className="text-orange-400 fill-orange-400" /> Available Balance
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="p-1 h-auto text-zinc-500 hover:text-white hover:bg-white/5 rounded-full"
                                >
                                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                                </Button>
                            </div>

                            <div className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white flex items-baseline gap-1">
                                <span className="text-2xl text-zinc-500 font-bold">₹</span>
                                {showBalance ? walletData.balance.toLocaleString() : "****"}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button className="bg-white text-black hover:bg-zinc-200 font-bold h-14 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] border-0">
                                    <ArrowUpRight size={20} className="mr-2" />
                                    Withdraw
                                </Button>
                                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-white/[0.02] h-14 rounded-2xl font-bold backdrop-blur-sm transition-all hover:border-white/20">
                                    <Plus size={20} className="mr-2" />
                                    Top Up
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <div className="px-6 relative z-10 max-w-2xl mx-auto mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Earned", val: walletData.totalEarned, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: TrendingUp },
                        { label: "Pending", val: walletData.pendingAmount, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: Clock },
                        { label: "This Week", val: walletData.thisWeekEarnings, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: CreditCard },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`bg-white/[0.03] p-4 rounded-2xl border ${stat.border} text-center flex flex-col items-center justify-center gap-2 backdrop-blur-sm`}
                        >
                            <div className={`p-2 rounded-full ${stat.bg} ${stat.color} mb-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                                <stat.icon size={16} />
                            </div>
                            <div>
                                <div className={`text-lg font-bold ${stat.color} tracking-tight`}>₹{stat.val}</div>
                                <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                    {periods.map((period) => (
                        <Button
                            key={period.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPeriod(period.id)}
                            className={`flex-1 rounded-xl transition-all font-bold text-xs ${selectedPeriod === period.id
                                ? "bg-white/10 text-white shadow-sm border border-white/10"
                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {period.label}
                        </Button>
                    ))}
                </div>

                {/* Transaction History */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
                        <Button variant="link" className="text-zinc-500 text-xs h-auto p-0 font-bold hover:text-white transition-colors uppercase tracking-wider">View All</Button>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((transaction, i) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                                className="group bg-[#0c0c0e] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex items-center gap-4"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-black border border-white/5 shadow-inner ${transaction.type === "credit"
                                    ? "text-emerald-400 shadow-emerald-900/10"
                                    : "text-rose-400 shadow-rose-900/10"
                                    }`}>
                                    {transaction.type === "credit" ? (
                                        <ArrowDownLeft size={20} />
                                    ) : (
                                        <ArrowUpRight size={20} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white truncate text-sm">{transaction.title}</h4>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{transaction.description}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className={`text-base font-black tracking-tight ${transaction.type === "credit" ? "text-emerald-400" : "text-rose-400"
                                        }`}>
                                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                                    </div>
                                    <div className="text-[10px] font-bold text-zinc-600 mt-0.5">
                                        {transaction.time}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Gradient Fade */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020204] to-transparent pointer-events-none z-10" />

        </PageTransition>
    );
};

export default Wallet;
