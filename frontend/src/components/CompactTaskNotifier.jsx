import { useEffect, useState, useRef } from "react";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MapPin, TrendingUp, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * CompactTaskNotifier - Shows small, attractive toast notifications for new tasks
 */
const CompactTaskNotifier = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lastTaskId, setLastTaskId] = useState(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "tasks"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const taskData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };

                    // Skip initial load
                    if (!isInitialized.current) {
                        setLastTaskId(taskData.id);
                        isInitialized.current = true;
                        return;
                    }

                    // Skip if same task or user's own task
                    if (taskData.id === lastTaskId || taskData.createdBy === user.uid) {
                        setLastTaskId(taskData.id);
                        return;
                    }

                    // Show compact, attractive toast notification
                    toast(
                        <div className="flex items-start gap-3 w-full">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-white text-sm truncate">{taskData.title}</h4>
                                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-zinc-400 uppercase">
                                        NEW
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 line-clamp-1 mb-2">{taskData.description}</p>
                                <div className="flex items-center gap-3 text-[10px]">
                                    <div className="flex items-center gap-1 text-green-400 font-bold">
                                        <TrendingUp size={12} />
                                        ₹{taskData.reward}
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-400">
                                        <MapPin size={12} />
                                        {taskData.distance || '1.2'} km
                                    </div>
                                </div>
                            </div>
                        </div>,
                        {
                            duration: 6000,
                            className: "bg-[#0a0a0a] border-orange-500/30",
                            action: {
                                label: "View",
                                onClick: () => navigate('/tasks')
                            }
                        }
                    );

                    setLastTaskId(taskData.id);
                }
            });
        }, (error) => {
            if (error.code !== 'permission-denied') {
                console.error("Compact notifier error:", error);
            }
        });

        return () => unsubscribe();
    }, [user, navigate, lastTaskId]);

    return null;
};

export default CompactTaskNotifier;
