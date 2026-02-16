import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const WalkerTracker = () => {
    const { user } = useAuth();
    const location = useGeoLocation();
    const activeTaskRef = useRef(null);

    // Listen for my active task
    useEffect(() => {
        if (!user || user.role === 'requester') return;

        const q = query(
            collection(db, "tasks"),
            where("assignedTo", "==", user.uid),
            where("status", "==", "accepted")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                activeTaskRef.current = snapshot.docs[0].id;
            } else {
                activeTaskRef.current = null;
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Update location every 30s if active task exists
    useEffect(() => {
        if (!activeTaskRef.current || !location.loaded || !location.coordinates.lat) return;

        const updateLocation = async () => {
            if (!activeTaskRef.current) return;
            try {
                const taskRef = doc(db, "tasks", activeTaskRef.current);
                await updateDoc(taskRef, {
                    currentLocation: {
                        lat: location.coordinates.lat,
                        lng: location.coordinates.lng,
                        updatedAt: new Date()
                    }
                });
                console.log("Walker location updated");
            } catch (e) {
                console.error("Failed to update walker location", e);
            }
        };

        const interval = setInterval(updateLocation, 30000);

        // Initial update
        updateLocation();

        return () => clearInterval(interval);
    }, [location.loaded, location.coordinates.lat]);

    return null; // Invisible component
};

export default WalkerTracker;
