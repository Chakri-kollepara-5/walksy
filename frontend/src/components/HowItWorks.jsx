import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, MapPin, Zap, Wallet, ShieldCheck, Lock, KeyRound, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = ({ isOpen, onClose }) => {
    const [expandedStep, setExpandedStep] = useState(null);

    const toggleStep = (index) => {
        setExpandedStep(expandedStep === index ? null : index);
    };

    const steps = [
        {
            icon: Smartphone,
            title: "Connect",
            desc: "Create your profile and link your digital wallet to start your journey.",
            details: null
        },
        {
            icon: MapPin,
            title: "Discover",
            desc: "Browse the live map to find high-value tasks and gigs nearby.",
            details: null
        },
        {
            icon: ShieldCheck,
            title: "Execute & Verify",
            desc: "Complete the task and use our Secure OTP Protocol to prove delivery.",
            details: [
                {
                    title: "Arrive at Location",
                    text: "Reach the drop-off point and meet the receiver.",
                    icon: MapPin
                },
                {
                    title: "Ask for OTP",
                    text: "The receiver has a 4-digit secret code on their app.",
                    icon: Lock
                },
                {
                    title: "Enter & Validate",
                    text: "Input the code in your app. If it matches, the task is verified instantly.",
                    icon: KeyRound
                }
            ]
        },
        {
            icon: Wallet,
            title: "Earn",
            desc: "Get paid instantly in crypto or fiat once the task is approved.",
            details: null
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-pointer"
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-[#09090b] z-[70] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0c0c0e]">
                            <h2 className="text-2xl font-black text-white tracking-tight">How it Works</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                            >
                                <X size={24} />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500/50 to-transparent" />

                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="relative mb-8 last:mb-0 group bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex gap-5">
                                            <div className="relative z-10 shrink-0 w-12 h-12 rounded-2xl bg-[#1a1a1c] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-orange-500/50 group-hover:bg-orange-950/20 transition-all duration-500">
                                                <step.icon size={22} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                                    {step.title}
                                                </h3>
                                                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                                    {step.desc}
                                                </p>

                                                {step.details && (
                                                    <Button
                                                        variant="link"
                                                        onClick={() => toggleStep(index)}
                                                        className="mt-2 p-0 h-auto text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 uppercase tracking-wide"
                                                    >
                                                        {expandedStep === index ? "Show Less" : "Read More"}
                                                        {expandedStep === index ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expandable Details */}
                                        <AnimatePresence>
                                            {expandedStep === index && step.details && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="overflow-hidden border-t border-white/5 pl-2"
                                                >
                                                    <div className="pt-4 space-y-4">
                                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Secure OTP Protocol</p>
                                                        {step.details.map((detail, i) => (
                                                            <div key={i} className="flex gap-4 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                                                                <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                                                                    {i + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-white mb-0.5">{detail.title}</h4>
                                                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">{detail.text}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pro Tip Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-gradient-to-br from-orange-500/10 to-transparent p-5 rounded-2xl border border-orange-500/20"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Pro Tip</span>
                                </div>
                                <p className="text-sm text-zinc-300 font-medium">
                                    Always verify the OTP <span className="text-white font-bold">before</span> handing over the item to ensure maximum security.
                                </p>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-[#0c0c0e]">
                            <Button
                                onClick={onClose}
                                className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
                            >
                                Got it, let’s go!
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HowItWorks;
