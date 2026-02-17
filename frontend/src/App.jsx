import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { AnimatePresence } from "framer-motion";

import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Tasks from "@/pages/Tasks";
import Wallet from "@/pages/Wallet";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

import SignInPage from "@/pages/auth/SignIn";
import SignUpPage from "@/pages/auth/SignUp";
import CompactTaskNotifier from "@/components/CompactTaskNotifier";

const queryClient = new QueryClient();

const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Loading Walksy...</p>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/sign-in" replace />;

    return <>{children}</>;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    // If user is authenticated, redirect to /home immediately
    if (user) return <Navigate to="/home" replace />;

    return <>{children}</>;
};

const AppContent = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                <Route path="/sign-in" element={<PublicRoute><SignInPage /></PublicRoute>} />
                <Route path="/sign-up" element={<PublicRoute><SignUpPage /></PublicRoute>} />

                {/* Protected Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <div className="relative min-h-screen pb-20">
                                <Routes>
                                    <Route path="/home" element={<Home />} />
                                    <Route path="/tasks" element={<Tasks />} />
                                    <Route path="/wallet" element={<Wallet />} />
                                    <Route path="/leaderboard" element={<Leaderboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                                <Navigation />
                                <CompactTaskNotifier />
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};



const App = () => {
    const [showSplash, setShowSplash] = useState(true);

    // Optional: Only show splash once per session
    // useEffect(() => {
    //     const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    //     if (hasSeenSplash) setShowSplash(false);
    // }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        // sessionStorage.setItem("hasSeenSplash", "true"); 
    };

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />

                        <AnimatePresence mode="wait">
                            {showSplash ? (
                                <SplashScreen key="splash" onComplete={handleSplashComplete} />
                            ) : (
                                <AppContent key="app" />
                            )}
                        </AnimatePresence>

                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
};

export default App;
