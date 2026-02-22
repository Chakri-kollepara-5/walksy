import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, X, MapPin, Sparkles } from "lucide-react";

/**
 * TopTaskNotification - Premium "Dynamic Island" style notification
 * Appears floaty at the top, ensures only ONE notification per new task EVER (using localStorage).
 */
const TopTaskNotification = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const isInitialized = useRef(false);

    // Load seen IDs from localStorage or initialize with a new set
    const getSeenIds = () => {
        try {
            const stored = localStorage.getItem("walksy_seen_tasks");
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (e) {
            return new Set();
        }
    };

    const saveSeenId = (id) => {
        try {
            const seen = getSeenIds();
            seen.add(id);
            // Limit stored IDs to avoid bloating localStorage (keep last 100)
            const array = Array.from(seen).slice(-100);
            localStorage.setItem("walksy_seen_tasks", JSON.stringify(array));
        } catch (e) {
            console.error("Storage error:", e);
        }
    };

    useEffect(() => {
        if (!user) return;

        // Query for open tasks
        const q = query(
            collection(db, "tasks"),
            where("status", "==", "open"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const seen = getSeenIds();

            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const taskData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };

                    // Initial load: mark all current tasks as seen to avoid flood
                    if (!isInitialized.current) {
                        saveSeenId(taskData.id);
                        return;
                    }

                    // Skip if seen before (in this or previous session)
                    if (seen.has(taskData.id)) {
                        return;
                    }

                    // Skip if creator
                    if (taskData.createdBy === user.uid) {
                        saveSeenId(taskData.id);
                        return;
                    }

                    // Show it!
                    saveSeenId(taskData.id);
                    setNotification(taskData);

                    // Small vibration if supported
                    if ('vibrate' in navigator) {
                        navigator.vibrate([10, 30, 10]);
                    }
                }
            });

            if (!isInitialized.current) {
                isInitialized.current = true;
            }

        }, (error) => {
            if (error.code !== 'permission-denied') {
                console.error("Top notifier error:", error);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Auto-dismiss
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 7000);
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
                <div className="fixed top-4 md:top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
                    <motion.div
                        initial={{ y: -120, opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ y: -120, opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8
                        }}
                        onClick={handleView}
                        className="pointer-events-auto w-full max-w-[380px] group"
                    >
                        {/* Premium Floating Capsule */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group-hover:border-orange-500/30 transition-colors duration-500">

                            {/* Animated Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent opacity-50" />
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />

                            {/* Moving Shine Effect */}
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                            />

                            {/* Reward & Distance Indicator */}
                            <div className="relative p-3.5 flex items-center gap-4">
                                {/* Icon with pulsing ring */}
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full animate-pulse" />
                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg border border-orange-400/30">
                                        <Bell className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">Available Now</span>
                                        <Sparkles className="w-3 h-3 text-orange-400" />
                                    </div>
                                    <h3 className="text-white font-black text-sm tracking-tight truncate mb-0.5">
                                        {notification.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                            <span className="text-[11px] font-black text-white">₹{notification.reward}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-zinc-500">
                                            <MapPin size={10} />
                                            <span className="text-[10px] font-bold">{notification.distance || '1.2'} km</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={handleDismiss}
                                    className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Sophisticated Progress Bar */}
                            <motion.div
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: 7, ease: "linear" }}
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 origin-left"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TopTaskNotification;
