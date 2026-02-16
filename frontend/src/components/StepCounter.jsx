import { Activity, Flame, Target } from "lucide-react";
import { useState, useEffect } from "react";

const StepCounter = ({ steps, goal, calories, distance, onSimulate }) => {
    const [animatedSteps, setAnimatedSteps] = useState(0);
    const progress = Math.min((steps / goal) * 100, 100);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedSteps((prev) => {
                if (prev < steps) {
                    return Math.min(prev + Math.ceil((steps - prev) / 20), steps);
                }
                return prev;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [steps]);

    return (
        <div className="card-clean p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
            {/* TOP */}
            <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl font-extrabold text-gradient">
                                {animatedSteps.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">steps</div>
                        </div>
                    </div>

                    {/* Progress Ring */}
                    <svg className="absolute w-40 h-40 -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="74"
                            stroke="hsl(var(--muted))"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="74"
                            stroke="hsl(var(--primary))"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 74}`}
                            strokeDashoffset={`${2 * Math.PI * 74 * (1 - progress / 100)}`}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                </div>

                <p className="text-sm text-muted-foreground">
                    Goal: {goal.toLocaleString()} steps
                </p>
                <p className="text-lg font-semibold text-primary mt-1">
                    {progress.toFixed(0)}% Complete
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
                <Stat
                    icon={<Flame className="w-5 h-5 text-warning" />}
                    value={calories}
                    label="Calories"
                />
                <Stat
                    icon={<Target className="w-5 h-5 text-success" />}
                    value={`${distance} km`}
                    label="Distance"
                />
                <Stat
                    icon={<Activity className="w-5 h-5 text-primary" />}
                    value={`${Math.floor(steps / 1000)}K`}
                    label="This Week"
                />
            </div>


            {/* Dev Tool */}
            <div className="mt-6 text-center">
                <button
                    onClick={onSimulate}
                    className="text-xs text-primary/70 hover:text-primary underline cursor-pointer"
                >
                    + Simulate Step (Tap to test)
                </button>
            </div>
        </div >
    );
};

const Stat = ({
    icon,
    value,
    label,
}) => (
    <div className="rounded-xl bg-muted/50 p-4 text-center hover:bg-muted transition">
        <div className="mx-auto mb-1 flex justify-center">{icon}</div>
        <div className="text-lg font-semibold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
    </div>
);

export default StepCounter;
