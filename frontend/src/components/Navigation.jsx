import { Home, ListTodo, Wallet, Trophy, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Navigation = () => {
    const navItems = [
        { path: "/home", label: "Home", icon: <Home size={20} /> },
        { path: "/tasks", label: "Tasks", icon: <ListTodo size={20} /> },
        { path: "/wallet", label: "Wallet", icon: <Wallet size={20} /> },
        { path: "/leaderboard", label: "Rank", icon: <Trophy size={20} /> },
        { path: "/profile", label: "Profile", icon: <User size={20} /> },
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="flex items-center gap-1 p-1.5 bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full pointer-events-auto ring-1 ring-white/5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `relative px-5 py-3 rounded-full transition-all duration-300 ${isActive
                                ? "text-white"
                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <div className="flex flex-col items-center gap-1 relative z-10">
                                {item.icon}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-bg"
                                        className="absolute inset-0 bg-white/10 rounded-full -z-10 border border-white/5"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1.5 w-1 h-1 bg-orange-500 rounded-full box-content border-2 border-black"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Navigation;
