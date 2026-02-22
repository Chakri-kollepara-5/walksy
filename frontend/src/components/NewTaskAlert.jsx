import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * NewTaskAlert - Prominent alert component for new task notifications
 * Shows a large, eye-catching banner when new tasks are posted
 */
const NewTaskAlert = ({ task, onClose, onViewTask }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-dismiss after 10 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    const handleViewTask = () => {
        handleClose();
        if (onViewTask) {
            onViewTask(task);
        } else {
            navigate('/tasks');
        }
    };

    if (!task) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-orange-500/30 blur-2xl animate-pulse" />

                    {/* Main Alert Card */}
                    <div className="relative backdrop-blur-3xl bg-gradient-to-br from-orange-600/95 to-amber-600/95 border-2 border-orange-400/50 rounded-3xl shadow-2xl shadow-orange-500/50 overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="relative p-6 md:p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatDelay: 2
                                        }}
                                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                                    >
                                        <Bell className="w-7 h-7 text-orange-600" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                            NEW TASK ALERT!
                                        </h3>
                                        <p className="text-orange-100 text-sm font-medium">Just posted • Grab it fast!</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Task Details */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/30">
                                <h4 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-1">
                                    {task.title}
                                </h4>
                                <p className="text-orange-50 text-sm md:text-base mb-4 line-clamp-2">
                                    {task.description}
                                </p>

                                {/* Task Meta Info */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
                                        <TrendingUp className="w-4 h-4 text-green-300" />
                                        <div>
                                            <p className="text-[10px] text-orange-100 uppercase tracking-wide">Reward</p>
                                            <p className="text-lg font-black text-white">₹{task.reward}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
                                        <MapPin className="w-4 h-4 text-blue-300" />
                                        <div>
                                            <p className="text-[10px] text-orange-100 uppercase tracking-wide">Distance</p>
                                            <p className="text-lg font-black text-white">{task.distance || '1.2'} km</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 col-span-2 md:col-span-1">
                                        <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
                                        <div>
                                            <p className="text-[10px] text-orange-100 uppercase tracking-wide">Category</p>
                                            <p className="text-lg font-black text-white capitalize">{task.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleViewTask}
                                    className="flex-1 h-14 bg-white text-orange-600 hover:bg-orange-50 font-black text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
                                >
                                    View Task Now
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    variant="outline"
                                    className="h-14 px-6 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-bold rounded-2xl backdrop-blur-sm"
                                >
                                    Later
                                </Button>
                            </div>
                        </div>

                        {/* Animated Border Glow */}
                        <motion.div
                            className="absolute inset-0 border-2 border-white/50 rounded-3xl"
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewTaskAlert;
