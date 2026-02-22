import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, limit, onSnapshot, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, X, MapPin, Sparkles } from "lucide-react";

/**
 * TopTaskNotification - Premium "Dynamic Island" style notification
 * Periodic reminders: Shows an open task every 10 seconds to keep users engaged.
 */
const TopTaskNotification = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [openTasks, setOpenTasks] = useState([]);
    const currentIndex = useRef(0);

    // Sync open tasks from Firestore
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "tasks"),
            where("status", "==", "open"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasks = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(t => t.createdBy !== user.uid); // Exclude posted user

            setOpenTasks(tasks);
        }, (error) => {
            if (error.code !== 'permission-denied') {
                console.error("Top notifier listener error:", error);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Periodic Notification Trigger (Every 10 Seconds)
    useEffect(() => {
        if (!user || openTasks.length === 0) return;

        const triggerNotification = () => {
            // Pick next task in circular fashion
            const task = openTasks[currentIndex.current % openTasks.length];
            setNotification(task);
            currentIndex.current += 1;

            // NOTE: Removed navigator.vibrate to prevent browser [Intervention]
            // as it requires a user gesture which doesn't exist for auto-intervals.
        };

        // Initial trigger
        triggerNotification();

        // 10s Interval as requested
        const interval = setInterval(triggerNotification, 10000);

        return () => clearInterval(interval);
    }, [user, openTasks]);

    // Auto-dismiss within the 10s window (to allow gap between notifications)
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 8000); // Hide after 8s, leaving 2s gap before next interval
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleDismiss = (e) => {
        e.stopPropagation();
        setNotification(null);
    };

    const handleView = () => {
        setNotification(null);
        navigate('/tasks');
    };

    return (
        <AnimatePresence>
            {notification && (
                <div className="fixed top-[90px] right-4 md:right-8 z-[100] flex justify-end pointer-events-none px-4">
                    <motion.div
                        initial={{ x: 120, opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ x: 120, opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        transition={{
                            x: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
                            opacity: { duration: 0.3 },
                            scale: { type: "spring", stiffness: 400, damping: 30 },
                            filter: { duration: 0.3, ease: "easeOut" }
                        }}
                        onClick={handleView}
                        className="pointer-events-auto w-full max-w-[260px] group"
                    >
                        {/* Premium "Micro-Island" Capsule */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-black/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] group-hover:border-orange-500/30 transition-colors duration-500">

                            {/* Animated Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent opacity-50" />

                            {/* Moving Shine Effect */}
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                            />

                            {/* Ultra-Compact Content */}
                            <div className="relative p-2 flex items-center gap-2.5">
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full animate-pulse" />
                                    <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg border border-orange-400/30">
                                        <Bell className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[8px] font-black tracking-widest text-orange-500 uppercase">Live</span>
                                        <Sparkles className="w-2 h-2 text-orange-400" />
                                    </div>
                                    <h3 className="text-white font-bold text-[11px] tracking-tight truncate leading-none mb-1">
                                        {notification.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-orange-400">₹{notification.reward}</span>
                                        <div className="w-[3px] h-[3px] rounded-full bg-zinc-700" />
                                        <span className="text-[9px] font-bold text-zinc-500">{notification.distance || '1.2'} km</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDismiss}
                                    className="shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all font-black"
                                >
                                    <X size={12} />
                                </button>
                            </div>

                            {/* Timer Progress Bar (Thinner) */}
                            <motion.div
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 origin-left"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TopTaskNotification;
