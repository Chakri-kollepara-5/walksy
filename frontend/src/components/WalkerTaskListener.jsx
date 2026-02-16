
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const WalkerTaskListener = () => {
    const { user } = useAuth();
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Only for walkers (or everyone if role is not strictly separated yet)
        if (!user || user.role === "requester") return;

        let unsubscribe;

        const setupListener = async () => {
            try {
                const { collection, query, onSnapshot, where, orderBy, limit, Timestamp } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // Listen for OPEN tasks created recently (or just listen to changes)
                // To avoid notifying for old tasks, we can filter by createdAt > now (conceptually)
                // But Firestore doesn't support "future" queries easily without a reference.
                // Instead, we rely on isFirstRun to skip initial load.

                const q = query(
                    collection(db, "tasks"),
                    where("status", "==", "open"),
                    limit(10) // Only listen to recent ones to save bandwidth
                );

                unsubscribe = onSnapshot(q, (snapshot) => {
                    if (isFirstRun.current) {
                        isFirstRun.current = false;
                        return;
                    }

                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const task = change.doc.data();
                            // Optional: Check distance here if we had user location in context accessible sync
                            // For now, globally notify active walkers
                            if (task.createdBy !== user.uid) { // Don't notify self (if role logic allows self-view)
                                toast("New Gig Available! 🚶", {
                                    description: `${task.title} - ₹${task.reward}`,
                                    action: {
                                        label: "View",
                                        onClick: () => window.location.reload()
                                    },
                                    duration: 5000,
                                });
                            }
                        }
                    });
                });

            } catch (error) {
                console.error("Walker listener error", error);
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    return null;
};

export default WalkerTaskListener;
