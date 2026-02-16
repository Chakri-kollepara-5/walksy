import { Check, Circle, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const TaskStatusStepper = ({ status, walkerName }) => {
    const steps = [
        { id: "open", label: "Open", icon: Circle },
        { id: "accepted", label: "Assigned", icon: MapPin },
        { id: "completed", label: "Done", icon: Check },
    ];

    const getCurrentStepIndex = () => {
        if (status === "completed") return 2;
        if (status === "accepted" || status === "in_progress") return 1;
        return 0;
    };

    const activeIndex = getCurrentStepIndex();

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10" />

                {/* Active Progress Bar */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 transition-all duration-500 rounded-full -z-10"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const isCompleted = index < activeIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 px-2 relative">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                                    isActive
                                        ? "border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                                        : "border-white/10 bg-[#121212] text-neutral-500",
                                    isCurrent && status === 'open' && index === 0 && "animate-pulse"
                                )}
                            >
                                {isCompleted ? (
                                    <Check size={14} strokeWidth={3} />
                                ) : (
                                    <step.icon size={14} />
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase font-bold tracking-wider",
                                isActive ? "text-orange-400" : "text-neutral-600"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {(status === "accepted" || status === "in_progress") && walkerName && (
                <div className="mt-4 text-center">
                    <span className="text-xs font-medium text-neutral-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
                        Walking by <span className="text-orange-400 font-bold">{walkerName}</span>
                    </span>
                </div>
            )}
            {status === "completed" && (
                <div className="mt-4 text-center">
                    <span className="text-xs font-bold text-green-400 bg-green-950/30 border border-green-500/20 px-3 py-1.5 rounded-full">
                        Task Successfully Completed
                    </span>
                </div>
            )}
        </div>
    );
};

export default TaskStatusStepper;
