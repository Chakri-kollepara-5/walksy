import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MapPin,
    List,
    SlidersHorizontal,
    CheckCircle,
    ArrowUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/TaskCard";
import PostTaskModal from "@/components/PostTaskModal";
import PageTransition from "@/components/PageTransition";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { acceptTask } from "@/services/taskService";
import { motion, AnimatePresence } from "framer-motion";
import MapView from "@/components/MapView";

const Tasks = () => {
    const [viewMode, setViewMode] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        try {
            const { collection, getDocs, query, orderBy, limit, doc, getDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"), limit(50));
            const querySnapshot = await getDocs(q);

            const fetchedTasks = await Promise.all(
                querySnapshot.docs.map(async (taskDoc) => {
                    const taskData = {
                        _id: taskDoc.id,
                        ...taskDoc.data()
                    };

                    // If creatorName is missing, undefined, or Anonymous, fetch it from users collection
                    if ((!taskData.creatorName || taskData.creatorName === "Anonymous") && taskData.createdBy) {
                        try {
                            console.log("Fetching creator name for task:", taskDoc.id, "createdBy:", taskData.createdBy);
                            const userDoc = await getDoc(doc(db, "users", taskData.createdBy));
                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                taskData.creatorName = userData.name || userData.displayName || userData.email?.split('@')[0] || "Anonymous";
                                console.log("Found creator name:", taskData.creatorName);
                            } else {
                                console.log("User document not found for:", taskData.createdBy);
                                taskData.creatorName = "Anonymous";
                            }
                        } catch (error) {
                            console.error("Error fetching creator name for task:", taskDoc.id, error);
                            taskData.creatorName = "Anonymous";
                        }
                    } else {
                        console.log("Task already has creatorName:", taskData.creatorName, "or no createdBy field");
                    }

                    return taskData;
                })
            );

            if (fetchedTasks.length === 0) {
                // Fallback Mock Data
                setTasks([
                    {
                        _id: "m1", title: "Morning Coffee Run", description: "Pickup 2 Lattes from Starbucks Indiranagar and deliver to 12th Main.",
                        reward: "150", distance: "0.8", category: "delivery", pickupLocation: "Starbucks, Indiranagar", dropLocation: "12th Main Rd",
                        status: "open", creatorName: "Sarah J.", createdAt: new Date()
                    },
                    {
                        _id: "m2", title: "Urgent Document Courier", description: "Deliver legal papers from Koramangala to HSR Layout.",
                        reward: "300", distance: "3.2", category: "delivery", pickupLocation: "Koramangala 4th Block", dropLocation: "HSR Sector 2",
                        status: "open", creatorName: "Legal Corp", createdAt: new Date()
                    },
                    {
                        _id: "m3", title: "Groceries for Elderly", description: "Buy listed items from Ratnadeep and deliver to apartment.",
                        reward: "200", distance: "1.1", category: "shopping", pickupLocation: "Ratnadeep, Domlur", dropLocation: "Diamond District",
                        status: "open", creatorName: "Amit V.", createdAt: new Date()
                    }
                ]);
            } else {
                setTasks(fetchedTasks);
            }
        } catch (error) {
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: "all", label: "All", count: tasks.length },
        { id: "delivery", label: "Delivery", count: tasks.filter(t => t.category === 'delivery').length },
        { id: "shopping", label: "Shopping", count: tasks.filter(t => t.category === 'shopping').length },
        { id: "pickup", label: "Pickup", count: tasks.filter(t => t.category === 'pickup').length },
    ];

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" || task.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleTaskAccept = async (taskId) => {
        try {
            await acceptTask(taskId, user.uid, user.name || "Walker");
            toast({
                title: "Task Accepted",
                description: "You’ve successfully accepted the task.",
                action: <div className="flex items-center gap-1 text-green-600"><CheckCircle size={16} /> <span className="text-xs font-medium">Confirmed</span></div>,
            });
            fetchTasks();
        } catch (error) {
            toast({ title: "Error", description: "Failed to accept task.", variant: "destructive" });
        }
    };

    const mapTaskToCard = (task) => ({
        id: task._id || task.id,
        title: task.title,
        description: task.description,
        location: "Bengaluru",
        distance: `${task.distance} km`,
        reward: task.reward,
        category: task.category || "delivery",
        status: task.status,
        createdBy: task.createdBy,
        walkerName: task.walkerName,
        deliveryOTP: task.deliveryOTP,
        assignedTo: task.assignedTo,
        createdAt: task.createdAt,
        pickupLocation: task.pickupLocation,
        dropLocation: task.dropLocation
    });

    return (
        <PageTransition id="tasks-container" className="min-h-screen bg-[#020204] pb-40 relative text-white selection:bg-orange-500/30 overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

            {/* HEADER - Cinematic Glass */}
            <header className="sticky top-0 z-40 bg-[#020204]/80 backdrop-blur-xl border-b border-white/5 pt-6 pb-4 px-6 md:px-10 transition-all">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6">
                        <div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                    TASKS
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-emerald-500 font-bold tracking-[0.2em] text-[10px] uppercase">Radar Online</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                        <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                                            <span className="text-white">{filteredTasks.length}</span> Opportunities Found
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <PostTaskModal />

                            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5 shadow-inner">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`rounded-lg h-9 w-9 p-0 transition-all duration-300 ${viewMode === "list" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                                >
                                    <List size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("map")}
                                    className={`rounded-lg h-9 w-9 p-0 transition-all duration-300 ${viewMode === "map" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                                >
                                    <MapPin size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Search & Categories */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors"
                                size={18}
                            />
                            <Input
                                placeholder="Find tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 bg-white/5 border-white/5 text-white placeholder:text-zinc-600 h-12 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-orange-500/50 focus:bg-white/10 transition-all font-medium"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant="ghost"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-5 h-12 rounded-xl border font-bold text-xs tracking-wide transition-all duration-300 relative overflow-hidden group
                                        ${selectedCategory === category.id
                                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                            : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {category.label}
                                        {category.count > 0 && (
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] ${selectedCategory === category.id ? "bg-black text-white" : "bg-white/10"}`}>
                                                {category.count}
                                            </span>
                                        )}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* List View */}
            {viewMode === "list" && (
                <div className="px-4 md:px-10 max-w-7xl mx-auto mt-8">
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 mb-6 px-1 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2">Hot Opportunities</span>
                        <div className="flex items-center gap-1 opacity-50">
                            <SlidersHorizontal size={10} /> Realtime
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 space-y-6">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                            <p className="text-zinc-500 text-sm font-medium animate-pulse">Scanning network...</p>
                        </div>
                    ) : filteredTasks.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task, i) => (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                                >
                                    <TaskCard
                                        task={mapTaskToCard(task)}
                                        onAccept={handleTaskAccept}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white/5 rounded-[2rem] border border-dashed border-white/10 mx-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                <Search size={32} className="text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No tasks found</h3>
                            <p className="text-zinc-500 text-base max-w-xs mx-auto">
                                The radar is empty. Try adjusting your filters or area.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Map View */}
            {viewMode === "map" && (
                <div className="px-4 md:px-10 max-w-7xl mx-auto mt-6 h-[calc(100vh-220px)]">
                    <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black h-full bg-[#0a0a0c] relative">
                        <div className="absolute inset-0 pointer-events-none border-[6px] border-white/5 rounded-[2rem] z-10" />
                        <MapView
                            tasks={filteredTasks.map(task => ({
                                id: task._id || task.id,
                                title: task.title,
                                description: task.description,
                                reward: task.reward,
                                distance: task.distance,
                                location: task.location
                            }))}
                            onAccept={handleTaskAccept}
                            userLocation={[12.9716, 77.5946]}
                        />
                    </div>
                </div>
            )}

            {/* Footer Gradient Fade */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020204] to-transparent pointer-events-none z-10" />

            {/* Floating Scroll To Top */}
            <div className="hidden md:block fixed bottom-10 right-10 z-50">
                <ScrollToTopButton />
            </div>
        </PageTransition>
    );
};

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrolledConfig = document.documentElement.scrollTop || document.body.scrollTop || window.scrollY;
            setIsVisible(scrolledConfig > 100);
        };
        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="z-[999]"
                >
                    <Button
                        onClick={scrollToTop}
                        size="icon"
                        className="rounded-full h-12 w-12 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 cursor-pointer borderless"
                    >
                        <ArrowUp size={20} />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Tasks;
