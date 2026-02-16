import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadingRef = React.useRef(loading);

    useEffect(() => {
        let mounted = true;
        loadingRef.current = loading; // Sync ref with state
    }, [loading]);

    useEffect(() => {
        let mounted = true;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // 1. IMPROVEMENT: Set basic user state IMMEDIATELY to unblock UI
                const basicUser = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                };

                if (mounted) {
                    setUser(basicUser);
                    setLoading(false); // Enable app access immediately
                }

                // 2. Fetch additional data in background
                getDoc(doc(db, "users", currentUser.uid))
                    .then((userDoc) => {
                        if (mounted && userDoc.exists()) {
                            // Merge Firestore data into existing state
                            setUser(prev => ({ ...prev, ...userDoc.data() }));
                        }
                    })
                    .catch((error) => {
                        // Silent fail or low-priority warn - doesn't stop app usage
                        if (error.code === 'unavailable' || error.message.includes("offline") || error.code === 'permission-denied') {
                            console.log("Background user fetch paused (offline/permission)");
                        } else {
                            console.warn("Background user data fetch failed:", error);
                        }
                    });

            } else {
                if (mounted) {
                    setUser(null);
                    setLoading(false);
                }
            }
        });

        // Safety timeout (reduced to 2s since we are non-blocking now)
        const timeout = setTimeout(() => {
            if (loadingRef.current && mounted) {
                console.warn("Auth listener slow, forcing loading false");
                setLoading(false);
            }
        }, 5000);

        return () => {
            mounted = false;
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // loading will be set to false by onAuthStateChanged
        } catch (error) {
            setLoading(false);
            // Throw standardized error for UI to catch
            throw { response: { data: { message: error.message } } };
        }
    };

    const register = async ({ name, email, password, role }) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                role,
                createdAt: new Date(),
                totalEarnings: 0,
                location: null // To be updated later
            });

            // State update is handled by onAuthStateChanged
        } catch (error) {
            console.error("Registration error:", error);
            setLoading(false);
            throw { response: { data: { message: error.message } } };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const updateUser = (userData) => {
        // Optimistic update for local state, ideally should update Firestore too
        setUser(prev => ({ ...prev, ...userData }));
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
