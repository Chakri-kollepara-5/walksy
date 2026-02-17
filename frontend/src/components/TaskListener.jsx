import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TaskListener = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role === "requester") return;

        let unsubscribe;

        const setupListener = async () => {
            try {
                const { collection, query, onSnapshot, where, limit } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // Listen for OPEN tasks (removed orderBy to avoid index requirement)
                const q = query(
                    collection(db, "tasks"),
                    where("status", "==", "open"),
                    limit(20)
                );

                unsubscribe = onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const task = change.doc.data();
                            toast.info(`New Request: ${task.title}`, {
                                description: `Earn ₹${task.reward} • ${task.distance || 0}km away`,
                                action: {
                                    label: "View",
                                    onClick: () => navigate("/tasks")
                                },
                                duration: 5000,
                            });
                        }
                    });
                }, (error) => {
                    if (error.code === 'unavailable' || error.message.includes("offline")) {
                        console.log("Task listener paused (offline)");
                    } else if (error.code === 'failed-precondition') {
                        console.error("Task listener error: Missing Index. Create here:", error.message);
                    } else if (error.code !== 'permission-denied') {
                        console.log("Task listener error:", error);
                    }
                });

            } catch (error) {
                console.error("Error setting up task listener", error);
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user, navigate]);

    return null; // Headless component
};

export default TaskListener;
