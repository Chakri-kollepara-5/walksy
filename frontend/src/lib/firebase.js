import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCyVvW2_L0Hjy8twptmvR5xO-9I3sqQcSo",
    authDomain: "walksy-429bd.firebaseapp.com",
    projectId: "walksy-429bd",
    storageBucket: "walksy-429bd.firebasestorage.app",
    messagingSenderId: "932513339276",
    appId: "1:932513339276:web:0d7749abaa0ed87478e8a9",
    measurementId: "G-XT56HM3MZS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from "firebase/firestore";

let db;
// Initialize Firestore with specific settings or fallback
try {
    // Attempt to enable multi-tab persistence
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        })
    });
} catch (error) {
    // If BloomFilterError or other persistence errors occur, fallback to default
    console.warn("Firestore persistence failed, falling back to default instance:", error);
    db = getFirestore(app);
}

export { db };

export default app;
