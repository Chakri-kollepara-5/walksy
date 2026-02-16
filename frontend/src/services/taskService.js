import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";

export const acceptTask = async (taskId, userId, userName) => {
    if (!taskId || !userId) throw new Error("Invalid task or user ID");

    const taskRef = doc(db, "tasks", taskId);

    try {
        await runTransaction(db, async (transaction) => {
            const taskDoc = await transaction.get(taskRef);

            if (!taskDoc.exists()) {
                throw new Error("Task does not exist!");
            }

            const taskData = taskDoc.data();

            if (taskData.status !== "open") {
                throw new Error("Task is no longer available.");
            }

            transaction.update(taskRef, {
                status: "accepted",
                assignedTo: userId,
                walkerName: userName || "Walker",
                acceptedAt: serverTimestamp()
            });
        });
        return { success: true };
    } catch (error) {
        console.error("Task acceptance transaction failed:", error);
        throw error;
    }
};

export const completeTask = async (taskId, otp) => {
    if (!taskId || !otp) throw new Error("Invalid parameters");

    const taskRef = doc(db, "tasks", taskId);

    try {
        await runTransaction(db, async (transaction) => {
            // We need to read the task to get the reward and assignedTo
            const tDoc = await transaction.get(taskRef);
            if (!tDoc.exists()) throw "Task not found";
            const tData = tDoc.data();

            // Verify OTP
            if (String(tData.deliveryOTP) !== String(otp)) {
                throw new Error("Invalid OTP. verification failed.");
            }

            // Update task
            transaction.update(taskRef, {
                status: "completed",
                completedAt: serverTimestamp(),
                otpProvided: otp
            });

            // Update User Stats (Trust Score & Earnings)
            if (tData.assignedTo) {
                const userRef = doc(db, "users", tData.assignedTo);
                const statsRef = doc(db, "stats", "platform_revenue"); // Admin Wallet
                const { increment, setDoc } = await import("firebase/firestore");

                // Walker gets the reward
                transaction.update(userRef, {
                    totalEarnings: increment(Number(tData.reward) || 0),
                    totalTasksCompleted: increment(1),
                    trustScore: increment(5) // +5 points for completion
                });

                // Admin gets the fee (Ensure stats doc exists or use set with merge)
                // Note: In a real transaction, we should check if doc exists, but for MVP we assume/set
                transaction.set(statsRef, {
                    totalRevenue: increment(Number(tData.platformFee) || 0),
                    transactionsCount: increment(1),
                    lastUpdated: serverTimestamp()
                }, { merge: true });
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Task completion failed:", error);
        // Map permission denied to OTP error for better UX
        if (error.code === 'permission-denied') {
            throw new Error("Invalid OTP. Please check with the requester.");
        }
        throw error;
    }
};

export const undoTaskAcceptance = async (taskId, userId) => {
    if (!taskId || !userId) throw new Error("Invalid parameters");

    const taskRef = doc(db, "tasks", taskId);
    const { runTransaction } = await import("firebase/firestore"); // Dynamic or verify import

    try {
        await runTransaction(db, async (transaction) => {
            const taskDoc = await transaction.get(taskRef);
            if (!taskDoc.exists()) throw "Task not found";

            const data = taskDoc.data();

            // Check ownership
            if (data.assignedTo !== userId) {
                throw new Error("You are not assigned to this task.");
            }

            // Check time window (1 minute)
            if (data.acceptedAt) {
                const acceptedTime = data.acceptedAt.toDate().getTime();
                const now = new Date().getTime();
                const diffSeconds = (now - acceptedTime) / 1000;

                if (diffSeconds > 60) {
                    throw new Error("Cancellation window expired (1 minute limit).");
                }
            }

            // Revert task to open
            transaction.update(taskRef, {
                status: "open",
                assignedTo: null,
                walkerName: null,
                acceptedAt: null
            });
        });
        return { success: true };
    } catch (error) {
        console.error("Undo acceptance failed:", error);
        throw error;
    }
};
