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
                <Button variant="outline" size="sm" className="gap-2 bg-transparent border-[#FE4F4F]/25 text-stone-600 hover:bg-[#FE4F4F]/5 hover:text-[#FE4F4F] shadow-sm">
                    <Map size={14} className="text-[#FE4F4F]" />
                    View Route
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-[#FFFDF9] border border-[#FE4F4F]/20 text-[#2C2520] p-6 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-[#FE4F4F] font-condensed text-2xl">Route for: <span className="text-[#FE4F4F]/80">{task.title}</span></DialogTitle>
                    <DialogDescription className="hidden">
                        Map view showing pickup and drop-off locations.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <div className="rounded-xl overflow-hidden border border-[#FE4F4F]/10 shadow-lg">
                        <TaskMapView
                            pickup={pickup}
                            drop={drop}
                            pickupTitle={task.pickupLocation || "Pickup Location"}
                            dropTitle={task.dropLocation || "Drop Location"}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-[#FCF6EC]/80 border border-[#FE4F4F]/10 rounded-lg text-[#2C2520]">
                            <span className="font-bold block text-blue-600 mb-1">Pickup:</span>
                            {task.pickupLocation ||
                                (pickup.lat !== undefined && pickup.lat !== null ? `${Number(pickup.lat).toFixed(4)}, ${Number(pickup.lng).toFixed(4)}` : "Address not provided")}
                        </div>
                        <div className="p-3 bg-[#FCF6EC]/80 border border-[#FE4F4F]/10 rounded-lg text-[#2C2520]">
                            <span className="font-bold block text-[#FE4F4F] mb-1">Drop:</span>
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
