import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, ShieldAlert, CheckCircle, Database } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, collection, addDoc, getDocs, writeBatch, deleteDoc } from "firebase/firestore";

const AdminSeed = () => {
    const [status, setStatus] = useState([]);
    const [loading, setLoading] = useState(false);

    const log = (msg, type = "info") => {
        setStatus(prev => [...prev, { text: msg, type, timestamp: new Date().toLocaleTimeString() }]);
    };

    const runSeeder = async () => {
        setLoading(true);
        setStatus([]);
        log("🚀 Starting client-side Firestore seeder...", "info");

        try {
            // Store created UIDs to link tasks correctly
            const uids = {
                rahul: "walker_rahul",
                ananya: "walker_ananya",
                david: "walker_david",
                john: "requester_john"
            };

            const seedUsers = [
                {
                    uid: uids.john,
                    name: "John Doe",
                    email: "john@walksy.app",
                    role: "requester",
                    totalEarnings: 0,
                    totalTasksCompleted: 0,
                    totalSteps: 0,
                    fitnessPoints: 0,
                    streak: 0
                },
                {
                    uid: uids.rahul,
                    name: "Rahul Kumar",
                    email: "rahul@walksy.app",
                    role: "walker",
                    totalEarnings: 150,
                    totalTasksCompleted: 1,
                    totalSteps: 12500,
                    fitnessPoints: 1200,
                    streak: 3
                },
                {
                    uid: uids.ananya,
                    name: "Ananya Sharma",
                    email: "ananya@walksy.app",
                    role: "walker",
                    totalEarnings: 310,
                    totalTasksCompleted: 2,
                    totalSteps: 28400,
                    fitnessPoints: 2400,
                    streak: 7
                },
                {
                    uid: uids.david,
                    name: "David Smith",
                    email: "david@walksy.app",
                    role: "walker",
                    totalEarnings: 95,
                    totalTasksCompleted: 1,
                    totalSteps: 9800,
                    fitnessPoints: 850,
                    streak: 1
                },
                {
                    uid: uids.john,
                    name: "John Doe",
                    email: "john@walksy.app",
                    role: "requester",
                    totalEarnings: 0,
                    totalTasksCompleted: 0,
                    totalSteps: 0,
                    fitnessPoints: 0,
                    streak: 0
                }
            ];

            // Step 1: Seed users sequentially. We make sure John Doe (requester) is seeded LAST
            // so we remain authenticated as John Doe when doing task operations.
            for (const user of seedUsers) {
                const password = "password123";
                log(`Processing auth account for ${user.name} (${user.email})...`, "info");
                let currentUserUid = user.uid;

                try {
                    const cred = await createUserWithEmailAndPassword(auth, user.email, password);
                    currentUserUid = cred.user.uid;
                    log(`✅ Auth account created for ${user.name}`, "success");
                } catch (authError) {
                    if (authError.code === "auth/email-already-in-use") {
                        log(`ℹ️ Auth account exists for ${user.name}. Logging in...`, "info");
                        const cred = await signInWithEmailAndPassword(auth, user.email, password);
                        currentUserUid = cred.user.uid;
                        log(`✅ Logged in as ${user.name}`, "success");
                    } else {
                        throw authError;
                    }
                }

                // Write/Overwrite Firestore User Document
                log(`Writing profile document to Firestore for ${user.name}...`, "info");
                const { uid, ...profileData } = user;
                await setDoc(doc(db, "users", currentUserUid), {
                    ...profileData,
                    createdAt: new Date()
                });
                
                // Map the original ID to the new auth UID
                if (user.email.includes("rahul")) uids.rahul = currentUserUid;
                if (user.email.includes("ananya")) uids.ananya = currentUserUid;
                if (user.email.includes("david")) uids.david = currentUserUid;
                if (user.email.includes("john")) uids.john = currentUserUid;

                log(`✅ Firestore profile written for ${user.name}`, "success");

                // Sign out if this is NOT the requester John Doe
                if (user.uid !== "requester_john") {
                    await signOut(auth);
                    log(`Signed out from ${user.name} session`, "info");
                }
            }

            // We are now authenticated as John Doe (requester)!
            // John Doe can write and delete his own tasks.
            log("Querying existing tasks in Firestore...", "info");
            const tasksSnap = await getDocs(collection(db, "tasks"));
            let deletedCount = 0;
            let skipCount = 0;
            for (const taskDoc of tasksSnap.docs) {
                try {
                    await deleteDoc(doc(db, "tasks", taskDoc.id));
                    deletedCount++;
                } catch (deleteError) {
                    // Ignore permission errors for tasks we don't own
                    skipCount++;
                }
            }
            log(`✅ Cleared ${deletedCount} tasks (skipped ${skipCount} tasks owned by others)`, "success");

            log("Seeding new tasks under John Doe's request session...", "info");
            const tasksToSeed = [
                {
                    title: "Grocery Delivery",
                    description: "Pick up groceries from FreshMart and deliver to HSR Layout.",
                    reward: 150,
                    distance: 1.2,
                    category: "delivery",
                    location: { lat: 12.9121, lng: 77.6446 },
                    pickupLocation: "FreshMart, HSR Layout",
                    dropLocation: "HSR Layout Sector 3",
                    difficulty: "easy",
                    status: "open",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    createdAt: new Date()
                },
                {
                    title: "Mystery Shopper - Starbucks",
                    description: "Visit Starbucks Indiranagar, buy a coffee, and rate the service.",
                    reward: 350,
                    distance: 3.5,
                    category: "shopping",
                    location: { lat: 12.9784, lng: 77.6408 },
                    pickupLocation: "Starbucks, Indiranagar",
                    dropLocation: "Indiranagar 100ft Road",
                    difficulty: "medium",
                    status: "open",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    createdAt: new Date()
                },
                {
                    title: "Document Pickup",
                    description: "Pick up legal documents from Koramangala 4th Block.",
                    reward: 200,
                    distance: 2.1,
                    category: "pickup",
                    location: { lat: 12.9345, lng: 77.6266 },
                    pickupLocation: "Koramangala 4th Block",
                    dropLocation: "MG Road Metro Station",
                    difficulty: "easy",
                    status: "open",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    createdAt: new Date()
                },
                {
                    title: "Park Survey",
                    description: "Visit Cubbon Park and count the number of benches in sector A.",
                    reward: 100,
                    distance: 0.8,
                    category: "survey",
                    location: { lat: 12.9757, lng: 77.5929 },
                    pickupLocation: "Cubbon Park Entrance",
                    dropLocation: "Vithal Mallya Road",
                    difficulty: "easy",
                    status: "open",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    createdAt: new Date()
                },
                {
                    title: "Medicine Delivery",
                    description: "Deliver medicines to elderly patient in Jayanagar.",
                    reward: 250,
                    distance: 4.0,
                    category: "delivery",
                    location: { lat: 12.9250, lng: 77.5938 },
                    pickupLocation: "Apollo Pharmacy, Jayanagar",
                    dropLocation: "Jayanagar 4th T Block",
                    difficulty: "medium",
                    status: "open",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    createdAt: new Date()
                },
                {
                    title: "Quick Grocery Delivery",
                    description: "Pick up milk and bread from local store",
                    reward: 50,
                    distance: 0.5,
                    category: "delivery",
                    location: { lat: 12.9125, lng: 77.6441 },
                    pickupLocation: "Local Store",
                    dropLocation: "HSR Layout Sector 1",
                    difficulty: "easy",
                    status: "completed",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    walkerId: uids.rahul,
                    walkerName: "Rahul Kumar",
                    createdAt: new Date()
                },
                {
                    title: "Medicine Pickup",
                    description: "Pick up prescription from Pharmacy",
                    reward: 120,
                    distance: 1.5,
                    category: "pickup",
                    location: { lat: 12.9248, lng: 77.5930 },
                    pickupLocation: "Jayanagar Pharmacy",
                    dropLocation: "Jayanagar 3rd Block",
                    difficulty: "medium",
                    status: "completed",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    walkerId: uids.ananya,
                    walkerName: "Ananya Sharma",
                    createdAt: new Date()
                },
                {
                    title: "Store Price Audit",
                    description: "Check prices of dynamic items",
                    reward: 80,
                    distance: 2.0,
                    category: "survey",
                    location: { lat: 12.9340, lng: 77.6260 },
                    pickupLocation: "Target Store",
                    dropLocation: "Koramangala 1st Block",
                    difficulty: "medium",
                    status: "completed",
                    createdBy: uids.john,
                    creatorName: "John Doe",
                    walkerId: uids.david,
                    walkerName: "David Smith",
                    createdAt: new Date()
                }
            ];

            const tasksCollection = collection(db, "tasks");
            for (const task of tasksToSeed) {
                await addDoc(tasksCollection, task);
                log(`✅ Seeded task: ${task.title} (${task.status})`, "success");
            }

            log("Cleaning up active auth session...", "info");
            await signOut(auth);
            log("✅ Logged out from seed session", "success");

            log("🎉 Seeding completed successfully! Firestore is now populated with original Walksy data.", "success");
        } catch (error) {
            log(`❌ Error seeding database: ${error.message}`, "error");
            console.error("Seeding error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition className="min-h-screen bg-[#FCF6EC] text-[#2C2520] py-12 px-6 flex flex-col items-center justify-center font-sans bg-grid-dotted relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FE4F4F]/5 to-transparent pointer-events-none" />

            <div className="w-full max-w-2xl bg-[#FFFDF9] border-2 border-[#FE4F4F]/20 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-red-200/5 relative z-10">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#FE4F4F] font-bold text-xs uppercase tracking-wider mb-8 transition-colors">
                    <ArrowLeft size={14} /> Back to Landing
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FE4F4F]/10 border border-[#FE4F4F]/25 flex items-center justify-center text-[#FE4F4F] shadow-md">
                        <Database size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[#FE4F4F] font-condensed">DEVELOPER SEEDER</h1>
                        <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Walksy Firestore Database Initializer</p>
                    </div>
                </div>

                {/* Warning Card */}
                <div className="bg-[#FE4F4F]/5 border border-[#FE4F4F]/20 rounded-2xl p-5 mb-8 flex gap-4 items-start">
                    <ShieldAlert className="text-[#FE4F4F] shrink-0 mt-0.5" size={20} />
                    <div>
                        <span className="font-bold text-[#FE4F4F] text-sm block mb-1">Developer Notice</span>
                        <p className="text-stone-600 text-xs leading-relaxed">
                            This script will register or log in as the original demo users (Rahul, Ananya, David, John) and populate Firestore with their profiles and tasks. It clears existing open/completed tasks to prevent duplicate entries.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <Button
                    onClick={runSeeder}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-[#FE4F4F] hover:bg-[#E03A3A] text-white font-condensed text-xl shadow-[0_0_20px_rgba(254,79,79,0.2)] hover:scale-[1.01] transition-all border-0 flex items-center justify-center gap-3 mb-8"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            SEEDING DATABASE...
                        </>
                    ) : (
                        <>
                            <Play size={18} />
                            INITIALIZE ORIGINAL DATA
                        </>
                    )}
                </Button>

                {/* Log Terminal */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 font-mono text-xs text-stone-300 h-64 overflow-y-auto shadow-inner space-y-2">
                    {status.length === 0 ? (
                        <div className="text-stone-500 italic h-full flex items-center justify-center select-none">
                            Logs will appear here once seeding starts.
                        </div>
                    ) : (
                        status.map((logItem, index) => (
                            <div key={index} className={`flex items-start gap-2 ${
                                logItem.type === "success" ? "text-emerald-400" : 
                                logItem.type === "error" ? "text-rose-400" : 
                                logItem.type === "warn" ? "text-amber-400" : "text-stone-300"
                            }`}>
                                <span className="text-stone-600 select-none">[{logItem.timestamp}]</span>
                                <span className="flex-1 whitespace-pre-wrap">{logItem.text}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminSeed;
