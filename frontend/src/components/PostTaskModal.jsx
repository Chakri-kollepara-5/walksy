import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Plus } from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";

const PostTaskModal = ({ onSuccess }) => {
    const { user } = useAuth();
    const location = useGeoLocation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        reward: "",
        category: "delivery",
        urgency: "medium",
        pickupLocation: "",
        dropLocation: "",
        distance: "1.2",
        pickupCoordinates: null,
        dropCoordinates: null
    });

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                headers: { 'User-Agent': 'WalksyApp/1.0' }
            });
            const data = await response.json();
            if (data && data.display_name) {
                return data.display_name;
            }
            return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }
    };

    const handleUseCurrentLocation = async (e) => {
        e.preventDefault();
        if (location.loaded && location.coordinates.lat) {
            const lat = location.coordinates.lat;
            const lng = location.coordinates.lng;

            toast.info("Fetching your address...");

            setFormData(prev => ({
                ...prev,
                pickupLocation: `Fetching address...`,
                pickupCoordinates: location.coordinates
            }));

            const address = await reverseGeocode(lat, lng);

            setFormData(prev => ({
                ...prev,
                pickupLocation: address,
                pickupCoordinates: location.coordinates
            }));
            toast.success("Pickup location updated!");
        } else if (location.error) {
            toast.error("Location access denied. Please enable GPS.");
        } else {
            toast.info("Waiting for location to load...");
        }
    };

    const handleUseCurrentLocationForDrop = async (e) => {
        e.preventDefault();
        if (location.loaded && location.coordinates.lat) {
            const lat = location.coordinates.lat;
            const lng = location.coordinates.lng;

            toast.info("Fetching drop address...");

            setFormData(prev => ({
                ...prev,
                dropLocation: `Fetching address...`,
                dropCoordinates: location.coordinates
            }));

            const address = await reverseGeocode(lat, lng);

            setFormData(prev => ({
                ...prev,
                dropLocation: address,
                dropCoordinates: location.coordinates
            }));
            toast.success("Drop location updated!");
        } else if (location.error) {
            toast.error("Location access denied. Please enable GPS.");
        } else {
            toast.info("Waiting for location to load...");
        }
    };

    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
                headers: { 'User-Agent': 'WalksyApp/1.0' }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
            return null;
        } catch (error) {
            console.error("Geocoding failed:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { helpRequestSchema } = await import("@/lib/schemas");

            const validationResult = helpRequestSchema.safeParse({
                ...formData,
                reward: Number(formData.reward)
            });

            if (!validationResult.success) {
                console.error("Validation Errors:", validationResult.error);
                const errorMessage = validationResult.error.errors?.[0]?.message || "Invalid form data";
                toast.error(errorMessage);
                setLoading(false);
                return;
            }

            let pickCoords = formData.pickupCoordinates;
            let dropCoords = formData.dropCoordinates;

            if (!pickCoords) {
                toast.info("Locating pickup address...");
                pickCoords = await geocodeAddress(formData.pickupLocation);
            }

            if (!dropCoords && formData.dropLocation && formData.dropLocation.length > 3) {
                toast.info("Locating drop address...");
                dropCoords = await geocodeAddress(formData.dropLocation);
            }

            const defaultLoc = { lat: 12.9716, lng: 77.5946 };

            if (!pickCoords) {
                toast.warning("Could not find Pickup location on map. Using default.");
                pickCoords = defaultLoc;
            }
            if (!dropCoords) {
                toast.warning("Could not find Drop location on map. Using default.");
                dropCoords = { lat: defaultLoc.lat + 0.01, lng: defaultLoc.lng + 0.01 };
            }

            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            if (!user?.uid) {
                toast.error("You must be logged in to post.");
                setLoading(false);
                return;
            }

            const now = new Date();
            let expiresAt = new Date();
            if (formData.urgency === "high") expiresAt.setHours(now.getHours() + 4);
            else if (formData.urgency === "medium") expiresAt.setHours(now.getHours() + 24);
            else expiresAt.setHours(now.getHours() + 72);

            const taskData = {
                ...validationResult.data,
                pickupLocation: formData.pickupLocation,
                dropLocation: formData.dropLocation,

                status: "open",
                createdBy: user.uid,
                creatorName: user.name || user.displayName || user.email?.split('@')[0] || "Anonymous",
                createdAt: serverTimestamp(),
                expiresAt: expiresAt,
                location: pickCoords,
                pickupCoordinates: pickCoords,
                dropCoordinates: dropCoords,
                assignedTo: null,
                deliveryOTP: Math.floor(1000 + Math.random() * 9000).toString(),
                platformFee: Number((Number(formData.reward) * 0.10).toFixed(2)),
                totalAmount: Number((Number(formData.reward) * 1.10).toFixed(2)),
            };

            await addDoc(collection(db, "tasks"), taskData);

            toast.success("Task posted successfully!");
            setOpen(false);
            setFormData({
                title: "", description: "", reward: "", category: "delivery",
                urgency: "medium", pickupLocation: "", dropLocation: "", distance: "1.2",
                pickupCoordinates: null, dropCoordinates: null
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error posting task:", error);
            toast.error("Failed to post task: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 border-0">
                    <Plus className="mr-2 h-4 w-4" /> Post Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Post a New Request</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Fill in the details below to request a service.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-neutral-300">Task Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Deliver Coffee"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-neutral-300">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#121212] border-white/10 text-white">
                                    <SelectItem value="delivery">Delivery</SelectItem>
                                    <SelectItem value="shopping">Shopping</SelectItem>
                                    <SelectItem value="pickup">Pickup</SelectItem>
                                    <SelectItem value="survey">Survey</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="urgency" className="text-neutral-300">Urgency</Label>
                            <Select
                                value={formData.urgency}
                                onValueChange={(val) => setFormData({ ...formData, urgency: val })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#121212] border-white/10 text-white">
                                    <SelectItem value="low">Low (72h)</SelectItem>
                                    <SelectItem value="medium">Medium (24h)</SelectItem>
                                    <SelectItem value="high">High (4h)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pickup" className="text-neutral-300">Pickup Location</Label>
                        <div className="flex gap-2">
                            <Input
                                id="pickup"
                                placeholder="e.g., Starbucks, Indiranagar"
                                value={formData.pickupLocation}
                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500/50"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleUseCurrentLocation}
                                title="Use Current Location"
                                className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-orange-500"
                            >
                                <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="drop" className="text-neutral-300">Drop Location</Label>
                        <div className="flex gap-2">
                            <Input
                                id="drop"
                                placeholder="e.g., My Flat, Koramangala"
                                value={formData.dropLocation}
                                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500/50"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleUseCurrentLocationForDrop}
                                title="Use Current Location for Drop"
                                className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-orange-500"
                            >
                                <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="space-y-2">
                            <Label htmlFor="reward" className="text-orange-400">Walker Tip/Reward (₹)</Label>
                            <Input
                                id="reward"
                                type="number"
                                placeholder="Min ₹10"
                                value={formData.reward}
                                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                                required
                                className="bg-[#050505] border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500/50"
                            />
                        </div>

                        {Number(formData.reward) > 0 && (
                            <div className="text-sm space-y-2 pt-2 border-t border-dashed border-white/10">
                                <div className="flex justify-between text-neutral-400">
                                    <span>Walker Gets:</span>
                                    <span>₹{Number(formData.reward).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Platform Fee (10%):</span>
                                    <span>₹{(Number(formData.reward) * 0.10).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-white text-base pt-1">
                                    <span>Total Payable:</span>
                                    <span>₹{(Number(formData.reward) * 1.10).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-neutral-300">Details</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe items, size, special instructions..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-orange-500/50"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 font-bold" disabled={loading}>
                        {loading ? "Posting..." : "Post Task"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PostTaskModal;
