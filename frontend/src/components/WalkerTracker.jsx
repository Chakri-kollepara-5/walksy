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

        // Simplified query with single where clause to avoid composite index requirement
        const q = query(
            collection(db, "tasks"),
            where("assignedTo", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Filter for accepted status in memory instead of in query
            const acceptedTasks = snapshot.docs.filter(doc => doc.data().status === "accepted");

            if (acceptedTasks.length > 0) {
                activeTaskRef.current = acceptedTasks[0].id;
            } else {
                activeTaskRef.current = null;
            }
        }, (error) => {
            // Suppress permission-denied errors (these are actually index errors)
            if (error.code !== 'permission-denied') {
                console.error("Walker tracker error:", error);
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
