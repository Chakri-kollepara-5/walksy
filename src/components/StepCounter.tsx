import { Activity, Flame, Target } from "lucide-react";
import { useState, useEffect } from "react";

interface StepCounterProps {
  steps: number;
  goal: number;
  calories: number;
  distance: number;
}

const StepCounter = ({ steps, goal, calories, distance }: StepCounterProps) => {
  const [animatedSteps, setAnimatedSteps] = useState(0);
  const progress = Math.min((steps / goal) * 100, 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedSteps(prev => {
        if (prev < steps) {
          return Math.min(prev + Math.ceil((steps - prev) / 20), steps);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="card-clean p-6">
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">
                {animatedSteps.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">steps</div>
            </div>
          </div>
          
          {/* Progress Ring */}
          <svg className="absolute w-36 h-36 -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="68"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="72"
              cy="72"
              r="68"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 68}`}
              strokeDashoffset={`${2 * Math.PI * 68 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          Goal: {goal.toLocaleString()} steps
        </div>
        <div className="text-lg font-semibold text-primary">
          {progress.toFixed(0)}% Complete
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
          <div className="text-lg font-semibold text-foreground">{calories}</div>
          <div className="text-xs text-muted-foreground">Calories</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Target className="w-5 h-5 text-success mx-auto mb-1" />
          <div className="text-lg font-semibold text-foreground">{distance}km</div>
          <div className="text-xs text-muted-foreground">Distance</div>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Activity className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-semibold text-foreground">{Math.floor(steps / 1000)}K</div>
          <div className="text-xs text-muted-foreground">This Week</div>
        </div>
      </div>
    </div>
  );
};

export default StepCounter;