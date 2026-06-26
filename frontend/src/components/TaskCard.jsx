import React from "react";
import { MapPin, Clock, ArrowRight, CheckCircle, AlertCircle, Navigation, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskMapModal from "@/components/TaskMapModal";
import CompleteTaskModal from "@/components/CompleteTaskModal";
import TaskStatusStepper from "@/components/TaskStatusStepper";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const UndoAcceptanceButton = ({ task, user }) => {
    // ... existing logic ...
    const getAcceptedTime = () => {
        if (task.acceptedAt?.seconds) return task.acceptedAt.seconds * 1000;
        if (task.acceptedAt) return new Date(task.acceptedAt).getTime();
        return Date.now();
    };

    const acceptedAt = getAcceptedTime();
    const [timeLeft, setTimeLeft] = React.useState(() => {
        const diff = 60 - Math.floor((Date.now() - acceptedAt) / 1000);
        return diff > 0 ? diff : 0;
    });
    const [canceling, setCanceling] = React.useState(false);

    React.useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            const diff = 60 - Math.floor((Date.now() - acceptedAt) / 1000);
            setTimeLeft(diff > 0 ? diff : 0);
            if (diff <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [acceptedAt]);

    const handleUndo = async () => {
        if (!confirm("Are you sure you want to cancel?")) return;
        setCanceling(true);
        try {
            const { undoTaskAcceptance } = await import("@/services/taskService");
            await undoTaskAcceptance(task.id, user.uid);
            setTimeout(() => window.location.reload(), 500);
        } catch (e) {
            console.error(e);
        } finally {
            setCanceling(false);
        }
    };

    if (timeLeft > 0) {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={canceling}
                className="w-full text-[#FE4F4F] hover:text-[#E03A3A] hover:bg-[#FE4F4F]/5 h-auto py-2 text-xs uppercase tracking-wider font-bold border border-[#FE4F4F]/20"
            >
                <AlertCircle size={12} className="mr-1.5" />
                {canceling ? "Canceling..." : `Undo (${timeLeft}s)`}
            </Button>
        );
    }
    return (
        <div className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 rounded-lg border border-emerald-500/30">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            Locked In
        </div>
    );
};

const TaskCard = ({ task, onAccept }) => {
    const { user } = useAuth();

    const timeAgo = (date) => {
        if (!date) return "Just now";
        const seconds = Math.floor((new Date() - date.toDate()) / 1000);
        if (seconds < 60) return "Just now";
        const m = Math.floor(seconds / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return "1d+ ago";
    };

    const isHighValue = Number(task.reward) >= 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative w-full rounded-[24px] bg-[#FFFDF9] border border-[#FE4F4F]/15 hover:border-[#FE4F4F]/60 overflow-hidden transition-all duration-500 shadow-lg shadow-red-200/5"
        >
            {/* Ambient Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FE4F4F]/5 via-transparent to-[#FE4F4F]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Top Shine Effect */}
            <div className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] bg-white/5 blur-[80px] group-hover:bg-white/10 transition-all duration-700" />

            {/* Content Container */}
            <div className="relative z-10 p-6 flex flex-col h-full">

                {/* Header: User & Reward */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-11 w-11 border-2 border-[#FCF6EC] ring-1 ring-[#FE4F4F]/15">
                                <AvatarImage
                                    src={task.creatorPhotoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.creatorName}`}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-zinc-800 text-zinc-400"><User size={18} /></AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-[#FCF6EC] rounded-full p-0.5">
                                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-[#FCF6EC]" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] text-stone-400 uppercase tracking-wider font-medium mb-0.5">Posted by</p>
                            <h4 className="font-bold text-[#2C2520] text-sm tracking-tight">{task.creatorName || "Anonymous"}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1 uppercase tracking-wider">
                                    {task.createdAt ? timeAgo(task.createdAt) : "New"}
                                </span>
                                {task.isNew && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FE4F4F] to-[#FF7878] text-[9px] font-black text-white uppercase tracking-wide shadow-[0_0_10px_rgba(254,79,79,0.2)]">
                                        NEW
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className={`
                            relative overflow-hidden px-4 py-2 rounded-xl border backdrop-blur-md flex items-center gap-2
                            ${isHighValue
                                ? "bg-[#FE4F4F]/10 border-[#FE4F4F]/30 shadow-md shadow-red-200/10"
                                : "bg-[#FCF6EC] border-[#FE4F4F]/15"}
                        `}>
                            {isHighValue && <div className="absolute inset-0 bg-[#FE4F4F]/5 animate-pulse" />}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isHighValue ? "text-[#FE4F4F]" : "text-stone-500"}`}>
                                Reward
                            </span>
                            <div className={`flex items-baseline gap-0.5 font-black text-lg ${isHighValue ? "text-[#FE4F4F] font-extrabold" : "text-[#2C2520]"}`}>
                                <span className="text-sm opacity-70">₹</span>{task.reward}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title & Desc */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`
                            px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider
                            ${task.category === 'delivery' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                task.category === 'shopping' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                                    'bg-stone-100 border-stone-200 text-stone-600'}
                        `}>
                            {task.category || 'General'}
                        </div>
                        {isHighValue && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FE4F4F]/10 border border-[#FE4F4F]/25 text-[10px] font-bold text-[#FE4F4F] uppercase tracking-wide">
                                Hot
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-[#FE4F4F] mb-2 leading-tight group-hover:text-[#E03A3A] transition-colors font-condensed">
                        {task.title}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                        {task.description}
                    </p>
                </div>

                {/* Route Visualizer */}
                <div className="mt-auto bg-[#FCF6EC]/80 rounded-xl p-4 border border-[#FE4F4F]/10 relative mb-6 shadow-inner">
                    {/* Path line */}
                    <div className="absolute left-[27px] top-[32px] bottom-[32px] w-0.5 border-l border-dashed border-[#FE4F4F]/30" />

                    <div className="space-y-4">
                        <div className="flex gap-3 items-start relative z-10">
                            <div className="h-2 w-2 mt-1.5 rounded-full bg-[#FCF6EC] border border-[#FE4F4F]/30 ring-4 ring-[#FFFDF9]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">From</p>
                                <p className="text-xs font-medium text-stone-700 truncate">{task.pickupLocation || "Pickup Point"}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start relative z-10">
                            <div className="h-2 w-2 mt-1.5 rounded-full bg-[#FE4F4F] shadow-[0_0_8px_rgba(254,79,79,0.3)] ring-4 ring-[#FFFDF9]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">To</p>
                                <p className="text-xs font-medium text-stone-700 truncate">{task.dropLocation || "Drop Point"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#FE4F4F]/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#FE4F4F] text-xs font-medium bg-[#FE4F4F]/5 px-2 py-1 rounded-lg">
                            <Navigation size={12} /> {task.distance} km
                        </div>
                        <TaskMapModal task={task} />
                    </div>
                </div>

                {/* Status Stepper */}
                {task.status !== 'open' && (
                    <div className="mb-5">
                        <TaskStatusStepper status={task.status} walkerName={task.walkerName} />
                    </div>
                )}

                {/* Actions */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {user?.uid === task.createdBy ? (
                            <motion.div
                                key="owner-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {task.status === 'open' ? (
                                    <div className="w-full h-11 rounded-xl border border-dashed border-[#FE4F4F]/30 bg-[#FE4F4F]/5 flex items-center justify-center gap-2 text-xs font-medium text-[#FE4F4F]/70">
                                        <Clock size={14} className="animate-spin-slow" /> Awaiting Runner...
                                    </div>
                                ) : (task.status === 'accepted' || task.status === 'in_progress') ? (
                                    <div className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                                        <p className="text-[10px] uppercase font-bold text-emerald-700 mb-1 tracking-widest">Secret OTP</p>
                                        <p className="text-xl font-mono font-black text-emerald-800 tracking-[0.2em] font-extrabold">{task.deliveryOTP}</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-11 rounded-xl bg-emerald-50 border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                                        <CheckCircle size={16} /> Task Complete
                                    </div>
                                )}
                            </motion.div>
                        ) : task.status === 'completed' ? (
                            <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="w-full h-11 rounded-xl bg-emerald-50 border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                                    <CheckCircle size={16} /> Completed
                                </div>
                            </motion.div>
                        ) : task.status === 'open' ? (
                            <motion.div key="accept" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Button
                                    onClick={() => onAccept(task.id)}
                                    className="w-full h-12 rounded-xl bg-[#FE4F4F] hover:bg-[#E03A3A] text-white shadow-md shadow-red-200/20 transition-all duration-300 font-bold text-sm group/btn border-0"
                                >
                                    Accept Task <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="active-walker" className="space-y-3">
                                {user?.uid === task.assignedTo ? (
                                    <>
                                        <CompleteTaskModal task={task} />
                                        <UndoAcceptanceButton task={task} user={user} />
                                    </>
                                ) : (
                                    <div className="w-full h-11 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center text-xs font-medium">
                                        Currently Reserved
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    );
};

export default TaskCard;
