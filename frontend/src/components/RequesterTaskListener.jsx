import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RequesterTaskListener = () => {
    const { user } = useAuth();
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!user || user.role !== "requester") return;

        let unsubscribe;

        const setupListener = async () => {
            try {
                const { collection, query, onSnapshot, where } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                const q = query(
                    collection(db, "tasks"),
                    where("createdBy", "==", user.uid)
                );

                unsubscribe = onSnapshot(q, (snapshot) => {
                    // Skip initial undefined/loading state
                    if (isFirstRun.current) {
                        isFirstRun.current = false;
                        return;
                    }

                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "modified") {
                            const task = change.doc.data();
                            const prevTask = change.doc.data(); // Snapshots are current, so we check status directly

                            if (task.status === "accepted") {
                                toast.success(`Task Accepted: ${task.title}`, {
                                    description: "A walker is on their way!",
                                    duration: 5000,
                                    action: {
                                        label: "View",
                                        onClick: () => window.location.reload() // Or nav to details
                                    }
                                });
                            } else if (task.status === "completed") {
                                toast.info(`Task Completed: ${task.title}`, {
                                    description: "Please verify and release payment.",
                                    duration: 5000,
                                });
                            }
                        }
                    });
                }, (error) => {
                    if (error.code === 'unavailable' || error.message.includes("offline")) {
                        console.log("Requester listener paused (offline)");
                    } else {
                        console.error("Requester listener error", error);
                    }
                });

            } catch (error) {
                console.error("Error setting up requester listener", error);
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    return null;
};

export default RequesterTaskListener;
