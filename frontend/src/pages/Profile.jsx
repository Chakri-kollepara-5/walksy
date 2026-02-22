import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Wallet, Settings, ChevronRight, User, Shield, Bell, Camera, MapPin, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const { toast } = useToast();

    const [loggingOut, setLoggingOut] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [amount, setAmount] = useState("");

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        photoURL: user?.photoURL || ""
    });
    const [saving, setSaving] = useState(false);

    const userData = {
        name: user?.name || "User",
        email: user?.email,
        stepsThisWeek: 18340,
        totalKm: 27.4,
        rank: 12,
        wallet: user?.totalEarnings || 0,
        photoURL: user?.photoURL
    };

    const handleLogout = () => {
        setLoggingOut(true);
        toast({
            title: "Logging out",
            description: "See you on the next walk.",
        });
        logout();
        setLoggingOut(false);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { doc, setDoc } = await import("firebase/firestore");
            const { db, auth } = await import("@/lib/firebase");
            const { updateProfile } = await import("firebase/auth");

            if (!auth.currentUser) throw new Error("No user logged in");

            await updateProfile(auth.currentUser, {
                displayName: editForm.name,
                photoURL: editForm.photoURL
            });

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                name: editForm.name,
                photoURL: editForm.photoURL,
                updatedAt: new Date()
            }, { merge: true });

            updateUser({
                name: editForm.name,
                photoURL: editForm.photoURL
            });

            toast({ title: "Profile Updated", description: "Your changes have been saved." });
            setEditOpen(false);
        } catch (error) {
            console.error(error);
            toast({ title: "Update Failed", description: "Could not update profile.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleWithdraw = () => {
        const withdrawAmount = Number(amount);
        if (!withdrawAmount || withdrawAmount <= 0) return;

        toast({
            title: "Withdrawal initiated 💸",
            description: `₹${withdrawAmount} sent to processing.`,
        });
        setWithdrawOpen(false);
        setAmount("");
    };

    return (
        <PageTransition className="min-h-screen bg-[#020204] pb-32 relative text-white overflow-hidden">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Cover Photo Area */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[#0c0c0e]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            <div className="px-6 -mt-24 relative z-20 max-w-xl mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="relative group cursor-pointer" onClick={() => setEditOpen(true)}>
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur opacity-70 group-hover:opacity-100 transition-opacity" />
                        <Avatar className="h-32 w-32 border-4 border-[#020204] relative">
                            <AvatarImage
                                src={userData.photoURL}
                                className="object-cover"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="text-4xl font-bold bg-[#151518] text-white">
                                {userData.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-[#020204]" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="mt-4 text-3xl font-black text-white text-center tracking-tight">
                        {userData.name}
                    </h1>
                    <p className="text-zinc-500 font-medium text-sm flex items-center gap-1.5 mt-1">
                        <User size={12} /> {userData.email}
                    </p>

                    <div className="flex gap-3 mt-6">
                        <Button
                            size="sm"
                            onClick={() => setEditOpen(true)}
                            className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-10 border-0"
                        >
                            Edit Profile
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-10 w-10">
                            <Settings size={18} />
                        </Button>
                    </div>
                </motion.div>

                {/* Wallet Banner */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 mb-8 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Balance</div>
                            <div className="text-4xl font-black tracking-tighter text-white">₹{userData.wallet.toLocaleString()}</div>
                        </div>
                        <Button
                            onClick={() => setWithdrawOpen(true)}
                            className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] border-0 h-12 px-6"
                        >
                            Withdraw
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Steps", val: userData.stepsThisWeek.toLocaleString(), icon: MapPin },
                        { label: "Distance", val: `${userData.totalKm} km`, icon: Award },
                        { label: "Rank", val: `#${userData.rank}`, icon: Shield },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-[#0c0c0e] p-4 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-3 group hover:border-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                                <stat.icon size={14} />
                            </div>
                            <div>
                                <div className="text-lg font-black text-white">{stat.val}</div>
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Menu */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2 mb-4">Settings</h3>

                    <div className="bg-[#0c0c0e] rounded-3xl border border-white/5 overflow-hidden">
                        {[
                            { icon: User, label: "Personal Information", action: () => setEditOpen(true) },
                            { icon: Shield, label: "Security & Privacy" },
                            { icon: Bell, label: "Notifications" },
                        ].map((item, i) => (
                            <div key={i}>
                                <button
                                    onClick={item.action}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="p-2 bg-white/5 rounded-xl text-zinc-400 group-hover:text-white transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="flex-1 text-left font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                </button>
                                {i < 2 && <div className="h-[1px] bg-white/5 mx-5" />}
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-8 w-full flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-2xl h-14 border border-red-500/20 font-bold"
                >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Log Out"}
                </Button>
            </div>

            {/* EDIT PROFILE DIALOG */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md bg-[#0c0c0e] border-white/10 text-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Update your public information.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-3 mb-4">
                            <Avatar className="h-24 w-24 border-2 border-white/10">
                                <AvatarImage
                                    src={editForm.photoURL}
                                    className="object-cover"
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-white/10 text-white text-2xl font-bold">{editForm.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo" className="text-zinc-400">Profile Picture URL</Label>
                            <Input
                                id="photo"
                                name="photo"
                                value={editForm.photoURL}
                                onChange={(e) => setEditForm({ ...editForm, photoURL: e.target.value })}
                                className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-11"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-2">
                        <Button variant="ghost" className="flex-1 rounded-xl h-11 text-zinc-400 hover:text-white" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={saving} className="flex-1 rounded-xl h-11 bg-white text-black hover:bg-zinc-200 font-bold border-0">
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* WITHDRAW DIALOG */}
            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogContent className="rounded-3xl sm:max-w-md bg-[#0c0c0e] border-white/10 text-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Withdraw Funds</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Transfer earnings to your external account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center py-8 mb-2">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Available Balance</div>
                        <div className="text-4xl font-black text-white">₹{userData.wallet}</div>
                    </div>

                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-14 rounded-2xl text-xl text-center font-bold bg-black border-white/10 text-white placeholder:text-zinc-700"
                    />

                    <DialogFooter className="mt-4 gap-3 sm:gap-2">
                        <Button variant="ghost" className="flex-1 rounded-xl h-12 text-zinc-400 hover:text-white" onClick={() => setWithdrawOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleWithdraw} className="flex-1 rounded-xl h-12 bg-white text-black hover:bg-zinc-200 font-bold border-0">
                            Confirm Withdrawal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageTransition>
    );
};

export default Profile;
