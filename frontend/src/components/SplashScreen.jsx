import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Timeline
        const timer1 = setTimeout(() => setStep(1), 800);  // Text Reveal
        const timer2 = setTimeout(() => setStep(2), 2200); // Exit Sequence
        const timer3 = setTimeout(() => onComplete(), 2800); // Unmount

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* Elegant Background - Deep Rich Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-indigo-950" />

            {/* Subtle Animated Mesh/Glow (Clean, not grainy) */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={step >= 2 ? { y: -50, opacity: 0 } : { y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-style spring
                    className="relative"
                >
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full scale-110" />
                    <img
                        src="/logo.png"
                        alt="Walksy"
                        className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-2xl"
                    />
                </motion.div>

                {/* Text Container with Mask */}
                <div className="overflow-hidden mt-6 relative">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={step >= 1 ? (step >= 2 ? { y: "-100%" } : { y: 0 }) : { y: "100%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                            WALKSY
                        </h1>

                    </motion.div>
                </div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={step === 1 ? { opacity: 0.6 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-3 text-xs md:text-sm font-medium text-white/60 tracking-[0.4em] uppercase"
                >
                    The Future of Walking
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
