import { useEffect, useState } from "react";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import NewTaskAlert from "./NewTaskAlert";

/**
 * GlobalTaskNotifier - Listens for new tasks and shows prominent alerts
 * This component should be mounted at the app level to notify all users
 */
const GlobalTaskNotifier = () => {
    const { user } = useAuth();
    const [newTask, setNewTask] = useState(null);
    const [lastTaskId, setLastTaskId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Query for recent tasks without orderBy to avoid index requirement
        const q = query(
            collection(db, "tasks"),
            limit(10) // Get recent tasks
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const taskData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };

                    // Skip if this is the initial load or if it's the user's own task
                    if (!isInitialized) {
                        setLastTaskId(taskData.id);
                        setIsInitialized(true);
                        return;
                    }

                    // Skip if it's the same task we already showed
                    if (taskData.id === lastTaskId) {
                        return;
                    }

                    // Skip if the user created this task themselves
                    if (taskData.createdBy === user.uid) {
                        setLastTaskId(taskData.id);
                        return;
                    }

                    // Show notification for new task
                    setNewTask(taskData);
                    setLastTaskId(taskData.id);

                    // Play notification sound (optional)
                    try {
                        const audio = new Audio('/notification.mp3');
                        audio.volume = 0.5;
                        audio.play().catch(() => {
                            // Ignore if audio fails (e.g., no user interaction yet)
                        });
                    } catch (error) {
                        // Ignore audio errors
                    }
                }
            });
        }, (error) => {
            // Only log non-permission errors
            if (error.code !== 'permission-denied') {
                console.error("Error listening to tasks:", error);
            }
        });

        return () => unsubscribe();
    }, [user, lastTaskId, isInitialized]);

    const handleCloseAlert = () => {
        setNewTask(null);
    };

    return (
        <>
            {newTask && (
                <NewTaskAlert
                    task={newTask}
                    onClose={handleCloseAlert}
                />
            )}
        </>
    );
};

export default GlobalTaskNotifier;
