
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Wallet, X } from "lucide-react";

const TaskSuccess = ({ task, onClose }) => {
    const [totalEarnings, setTotalEarnings] = useState(null);
    const { user } = useAuth();

    // Confetti Effect
    useEffect(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // Fetch Earnings Effect
    useEffect(() => {
        const fetchEarnings = async () => {
            if (!user?.uid) return;
            try {
                const { doc, getDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setTotalEarnings(userDoc.data().totalEarnings || 0);
                }
            } catch (error) {
                console.error("Error fetching earnings:", error);
            }
        };
        fetchEarnings();
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center text-center py-6 px-2">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-3xl font-black text-foreground mb-2">Congratulations!</h2>
                <p className="text-muted-foreground font-medium text-lg">You completed the task!</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-[#FCF6EC] border border-[#FE4F4F]/20 rounded-2xl p-6 w-full max-w-sm"
            >
                <p className="text-sm font-bold text-[#FE4F4F] uppercase tracking-widest mb-1">Tasks Earnings</p>
                <div className="flex items-center justify-center gap-2 text-[#FE4F4F] mb-4">
                    <span className="text-4xl font-black">₹{task.reward}</span>
                </div>

                {totalEarnings !== null && (
                    <div className="bg-[#FFFDF9] rounded-xl p-3 border border-[#FE4F4F]/10">
                        <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">New Wallet Balance</p>
                        <div className="flex items-center justify-center gap-2 text-[#FE4F4F]">
                            <Wallet size={18} />
                            <span className="text-2xl font-black">₹{totalEarnings}</span>
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#FE4F4F]/10 text-[#FE4F4F]/70 font-medium">
                    <p>Commission processed successfully.</p>
                    <p>Funds added to your wallet instantly.</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full mt-8"
            >
                <Button
                    onClick={onClose}
                    className="w-full h-14 text-lg rounded-xl font-bold bg-[#FE4F4F] hover:bg-[#E03A3A] shadow-md shadow-red-200/25 border-0"
                >
                    Awesome, Continue
                </Button>
            </motion.div>
        </div>
    );
};

export default TaskSuccess;
