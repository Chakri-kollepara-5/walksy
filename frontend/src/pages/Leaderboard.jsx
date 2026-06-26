import { useState, useEffect } from "react";
import { Trophy, Medal, TrendingUp, User, Award, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Leaderboard = () => {
    const { user: currentUser } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("earnings");

    const periods = [
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
        { id: "all", label: "All Time" }
    ];

    const categories = [
        { id: "earnings", label: "Earnings", icon: Trophy },
        { id: "tasks", label: "Tasks", icon: Award },
        { id: "steps", label: "Steps", icon: TrendingUp },
    ];

    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const { collection, getDocs, query, orderBy, limit, where } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                let sortField = "totalEarnings";
                if (selectedCategory === "tasks") sortField = "totalTasksCompleted";
                if (selectedCategory === "steps") sortField = "totalSteps";

                const q = query(collection(db, "users"), orderBy(sortField, "desc"), limit(50));
                const querySnapshot = await getDocs(q);

                const users = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    rank: index + 1,
                    name: doc.data().name || "Anonymous User",
                    avatar: (doc.data().name || "U").substring(0, 2).toUpperCase(),
                    steps: doc.data().totalSteps || 0,
                    earnings: doc.data().totalEarnings || 0,
                    tasks: doc.data().totalTasksCompleted || 0,
                    level: Math.floor((doc.data().totalEarnings || 0) / 1000) + 1,
                    streak: doc.data().streak || 0
                }));

                setLeaderboardData(users);

                if (currentUser) {
                    const myRankIndex = users.findIndex(u => u.id === currentUser.uid);
                    if (myRankIndex !== -1) {
                        setUserRank(users[myRankIndex]);
                    } else {
                        setUserRank({
                            rank: "50+",
                            name: currentUser.name || "You",
                            avatar: (currentUser.name || "Y").substring(0, 2).toUpperCase(),
                            earnings: currentUser.totalEarnings || 0,
                            tasks: currentUser.totalTasksCompleted || 0,
                            steps: currentUser.totalSteps || 0,
                            level: Math.floor((currentUser.totalEarnings || 0) / 1000) + 1,
                        });
                    }
                }

            } catch (error) {
                console.error("Error fetching leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [selectedCategory, currentUser]);

    const getDisplayValue = (user) => {
        switch (selectedCategory) {
            case "steps": return (user.steps || 0).toLocaleString();
            case "earnings": return `₹${user.earnings || 0}`;
            case "tasks": return user.tasks || 0;
            default: return `₹${user.earnings || 0}`;
        }
    };

    const getDisplayUnit = () => {
        switch (selectedCategory) {
            case "steps": return "steps";
            case "earnings": return "earned";
            case "tasks": return "completed";
            default: return "earned";
        }
    };

    return (
        <PageTransition className="min-h-screen bg-[#FCF6EC] pb-32 relative text-[#2C2520] selection:bg-[#FE4F4F]/30 overflow-hidden bg-grid-dotted">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#FE4F4F]/5 to-transparent pointer-events-none" />
            <div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#FE4F4F]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

            {/* Header */}
            <header className="relative pt-8 pb-10 px-6 z-10">
                <div className="max-w-2xl mx-auto text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#FE4F4F]/15 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FE4F4F] mb-4 shadow-sm"
                    >
                        Top Performers
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#FE4F4F] mb-2 font-condensed">Leaderboard</h1>
                    <p className="text-stone-500 font-medium">Rise through the ranks and earn prestige.</p>
                </div>

                {/* Filters */}
                <div className="max-w-md mx-auto flex flex-col gap-4 relative z-10">
                    <div className="flex bg-[#FFFDF9] p-1 rounded-2xl border border-[#FE4F4F]/15 shadow-sm backdrop-blur-md">
                        {periods.map((period) => (
                            <Button
                                key={period.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPeriod(period.id)}
                                className={`flex-1 rounded-xl transition-all text-xs font-bold tracking-wide ${selectedPeriod === period.id
                                    ? "bg-[#FE4F4F] text-white shadow-sm"
                                    : "text-stone-500 hover:text-[#FE4F4F]"
                                    }`}
                            >
                                {period.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Button
                                    key={category.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 border rounded-full px-5 h-9 text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === category.id
                                        ? "bg-[#FE4F4F]/10 text-[#FE4F4F] border-[#FE4F4F]/35 shadow-sm"
                                        : "bg-transparent text-stone-500 border-[#FE4F4F]/15 hover:border-[#FE4F4F]/30 hover:text-[#FE4F4F]"
                                        }`}
                                >
                                    <Icon size={12} />
                                    {category.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <div className="px-6 relative z-20 max-w-2xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FE4F4F]"></div>
                        <p className="text-stone-500 font-bold text-xs uppercase tracking-widest animate-pulse">Calculating Ranks...</p>
                    </div>
                ) : leaderboardData.length === 0 ? (
                    <div className="text-center py-20 bg-[#FFFDF9] rounded-[2rem] border border-[#FE4F4F]/15 shadow-sm">
                        <Trophy className="w-12 h-12 text-[#FE4F4F]/30 mx-auto mb-4" />
                        <p className="text-stone-500 font-bold">No data available yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Podium (Top 3) */}
                        <div className="grid grid-cols-3 gap-4 items-end mb-12 relative">
                            {/* Glow behind podium */}
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FE4F4F]/5 to-transparent blur-3xl rounded-full pointer-events-none" />

                            {/* 2nd Place */}
                            {leaderboardData[1] && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col items-center relative z-10"
                                >
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 rounded-2xl border border-[#FE4F4F]/15 bg-[#FFFDF9] flex items-center justify-center font-bold text-stone-700 shadow-lg relative rotate-3">
                                            {leaderboardData[1].avatar}
                                        </div>
                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#C0C0C0] text-white text-xs font-black flex items-center justify-center rounded-lg shadow-md rotate-[-10deg] border-0">2</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-stone-700 mb-1">{leaderboardData[1].name.split(" ")[0]}</div>
                                        <div className="text-xs font-black text-stone-500 tracking-wider">{getDisplayValue(leaderboardData[1])}</div>
                                    </div>
                                    <div className="mt-4 h-24 w-full bg-gradient-to-t from-[#FE4F4F]/10 to-transparent rounded-t-2xl border-x border-t border-[#FE4F4F]/10" />
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {leaderboardData[0] && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-col items-center relative z-20 scale-110"
                                >
                                    <div className="relative mb-5">
                                        <div className="w-20 h-20 rounded-2xl border border-[#FE4F4F]/30 bg-gradient-to-b from-[#FFFDF9] to-[#FCF6EC] flex items-center justify-center font-bold text-[#FE4F4F] shadow-lg shadow-red-200/10 relative">
                                            {leaderboardData[0].avatar}
                                        </div>
                                        <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-[#FE4F4F] to-[#FF7878] text-white text-sm font-black flex items-center justify-center rounded-xl shadow-lg border-0 rotate-[15deg]">1</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-base text-[#FE4F4F] mb-1">{leaderboardData[0].name.split(" ")[0]}</div>
                                        <div className="text-sm font-black text-[#FE4F4F] tracking-wider drop-shadow-sm">{getDisplayValue(leaderboardData[0])}</div>
                                    </div>
                                    <div className="mt-4 h-32 w-full bg-gradient-to-t from-[#FE4F4F]/15 to-transparent rounded-t-2xl border-x border-t border-[#FE4F4F]/15 shadow-[0_0_20px_rgba(254,79,79,0.05)]" />
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {leaderboardData[2] && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col items-center relative z-10"
                                >
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 rounded-2xl border border-[#FE4F4F]/15 bg-[#FFFDF9] flex items-center justify-center font-bold text-stone-700 shadow-lg relative -rotate-3">
                                            {leaderboardData[2].avatar}
                                        </div>
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#CD7F32] text-white text-xs font-black flex items-center justify-center rounded-lg shadow-md rotate-[5deg] border-0">3</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-stone-700 mb-1">{leaderboardData[2].name.split(" ")[0]}</div>
                                        <div className="text-xs font-black text-stone-500 tracking-wider">{getDisplayValue(leaderboardData[2])}</div>
                                    </div>
                                    <div className="mt-4 h-20 w-full bg-gradient-to-t from-[#FE4F4F]/10 to-transparent rounded-t-2xl border-x border-t border-[#FE4F4F]/10" />
                                </motion.div>
                            )}
                        </div>

                        {/* Rank List */}
                        <div className="space-y-3 pb-32">
                            {leaderboardData.slice(3).map((user, i) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all group backdrop-blur-sm ${currentUser?.uid === user.id
                                        ? "bg-[#FE4F4F]/10 border-[#FE4F4F]/20 shadow-md shadow-red-200/5"
                                        : "bg-[#FFFDF9] border-[#FE4F4F]/10 hover:bg-[#FE4F4F]/5 hover:border-[#FE4F4F]/20"
                                        }`}
                                >
                                    <div className="font-bold text-stone-500 w-6 text-center text-sm font-mono">
                                        {user.rank}
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#FCF6EC] flex items-center justify-center text-xs font-bold text-stone-600 border border-[#FE4F4F]/10 shadow-inner">
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#2C2520] flex items-center gap-2 text-sm">
                                            {user.name}
                                            {currentUser?.uid === user.id && <span className="text-[9px] bg-[#FE4F4F] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">You</span>}
                                        </div>
                                        <div className="text-[10px] text-stone-500 flex gap-2 font-medium">
                                            <span>Lvl {user.level}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-[#FE4F4F] tracking-tight">{getDisplayValue(user)}</div>
                                        <div className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">{getDisplayUnit()}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Sticky Current User Rank */}
            {userRank && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="fixed bottom-24 md:bottom-10 left-1/2 md:left-auto md:right-10 -translate-x-1/2 md:translate-x-0 w-[88%] max-w-sm md:w-80 z-40"
                >
                    <div className="bg-[#FFFDF9]/95 backdrop-blur-2xl p-1.5 rounded-[2rem] shadow-xl shadow-red-200/10 border border-[#FE4F4F]/15 ring-1 ring-[#FE4F4F]/5 relative group overflow-hidden">
                        {/* Animated background accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FE4F4F]/5 via-transparent to-[#FE4F4F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="bg-[#FCF6EC]/85 rounded-[1.6rem] p-3 flex items-center gap-4 border border-[#FE4F4F]/10 relative z-10 transition-all duration-300">
                            <div className="flex flex-col items-center justify-center min-w-[48px] h-12 rounded-xl bg-[#FE4F4F]/10 border border-[#FE4F4F]/25 shadow-inner">
                                <span className="text-[9px] font-black text-[#FE4F4F]/60 uppercase leading-none mb-0.5">Rank</span>
                                <span className="text-xl font-black text-[#FE4F4F] leading-none">#{userRank.rank}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-[#2C2520] text-sm">YOU</span>
                                    <div className="w-1 h-1 rounded-full bg-[#FE4F4F]/30" />
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest truncate">Lvl {userRank.level || 1}</span>
                                </div>
                                <div className="text-[11px] text-stone-600 font-bold truncate">
                                    {Number(userRank.rank) <= 10 ? "Top Tier Performer" : "Rising Star"}
                                </div>
                            </div>

                            <div className="text-right pl-2 border-l border-[#FE4F4F]/10">
                                <div className="font-black text-[#FE4F4F] text-base tracking-tighter leading-none mb-1">{getDisplayValue(userRank)}</div>
                                <div className="text-[9px] text-[#FE4F4F]/80 uppercase font-black tracking-widest leading-none">{getDisplayUnit()}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Footer Gradient Fade */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FCF6EC] to-transparent pointer-events-none z-10" />

        </PageTransition>
    );
};

export default Leaderboard;
