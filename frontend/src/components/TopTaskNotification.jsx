import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, X, MapPin } from "lucide-react";

/**
 * TopTaskNotification - Premium "Dynamic Island" style notification
 * Appears floaty at the top, ensures only ONE notification per new task.
 */
const TopTaskNotification = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    // Use a ref for seen IDs to persist across renders without triggering effects
    const seenTaskIds = useRef(new Set());
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!user) return;

        // Query for recent tasks
        // Switched to 'status=open' to match legacy listener pattern and avoid potential index issues with orderBy('createdAt')
        const q = query(
            collection(db, "tasks"),
            where("status", "==", "open"),
            limit(10)
        );

        // Diagnostic toast to confirm component is mounted
        // toast.info("Notification System Active", { duration: 2000 });

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const taskData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };

                    // Initial load: just mark everything existing as "seen"
                    if (!isInitialized.current) {
                        seenTaskIds.current.add(taskData.id);
                        return;
                    }

                    // If we've already seen this task ID in this session, skip entirely
                    if (seenTaskIds.current.has(taskData.id)) {
                        return;
                    }

                    // If user created it, mark seen and skip
                    if (taskData.createdBy === user.uid) {
                        seenTaskIds.current.add(taskData.id);
                        return;
                    }

                    // It's a NEW task we haven't seen!
                    seenTaskIds.current.add(taskData.id);
                    setNotification(taskData);
                }
            });

            // Mark initialized after processing the first batch
            if (!isInitialized.current) {
                isInitialized.current = true;
            }

        }, (error) => {
            console.error("Top notifier error:", error);
            if (error.code === 'failed-precondition') {
                console.warn("Missing Index for query");
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Auto-dismiss effect
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 6000);
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
                <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            mass: 0.8
                        }}
                        onClick={handleView}
                        className="pointer-events-auto w-full max-w-[360px]"
                    >
                        {/* Glassmorphism Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">

                            {/* Subtle Gradient Glow */}
                            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent opacity-50" />

                            {/* Progress Bar */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500"
                            />

                            <div className="relative p-3.5 flex items-center gap-3.5">
                                {/* Icon */}
                                <div className="shrink-0 w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>

                                {/* Texts */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-white font-bold text-sm leading-none">
                                            New Task
                                        </h3>
                                        <span className="text-[10px] font-bold text-orange-200 bg-orange-500/20 px-1.5 py-0.5 rounded-[4px]">
                                            NEW
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-xs truncate leading-tight">
                                        {notification.title}
                                    </p>
                                </div>

                                {/* Metadata & Action */}
                                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-0.5 text-green-400 font-bold text-sm leading-none mb-1">
                                            <span className="text-[10px]">₹</span>{notification.reward}
                                        </div>
                                        <div className="flex items-center justify-end gap-0.5 text-zinc-500 text-[10px] leading-none">
                                            <span>{notification.distance || '1.2'}km</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleDismiss}
                                        className="p-1 -mr-1 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TopTaskNotification;
