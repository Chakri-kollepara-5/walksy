import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskMapView from "./TaskMapView";
import { Map } from "lucide-react";

const TaskMapModal = ({ task }) => {
    const defaultLoc = { lat: 12.9716, lng: 77.5946 };
    const pickup = task.pickupCoordinates || task.location || defaultLoc;
    const drop = task.dropCoordinates || { lat: pickup.lat + 0.02, lng: pickup.lng + 0.02 };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/20 text-neutral-300 hover:bg-white/5 hover:text-white hover:border-white/40">
                    <Map size={14} className="text-orange-500" />
                    View Route
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-[#0a0a0a] border border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Route for: <span className="text-orange-500">{task.title}</span></DialogTitle>
                    <DialogDescription className="hidden">
                        Map view showing pickup and drop-off locations.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <TaskMapView
                            pickup={pickup}
                            drop={drop}
                            pickupTitle={task.pickupLocation || "Pickup Location"}
                            dropTitle={task.dropLocation || "Drop Location"}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-neutral-300">
                            <span className="font-bold block text-blue-400 mb-1">Pickup:</span>
                            {task.pickupLocation ||
                                (pickup.lat !== undefined && pickup.lat !== null ? `${Number(pickup.lat).toFixed(4)}, ${Number(pickup.lng).toFixed(4)}` : "Address not provided")}
                        </div>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-neutral-300">
                            <span className="font-bold block text-red-400 mb-1">Drop:</span>
                            {task.dropLocation ||
                                (drop.lat !== undefined && drop.lat !== null ? `${Number(drop.lat).toFixed(4)}, ${Number(drop.lng).toFixed(4)}` : "Address not provided")}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskMapModal;
