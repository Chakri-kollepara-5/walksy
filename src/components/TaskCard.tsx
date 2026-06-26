import { MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  distance: string;
  duration: string;
  commission: number;
  category: "delivery" | "shopping" | "pickup" | "survey";
  difficulty: "easy" | "medium" | "hard";
}

interface TaskCardProps {
  task: Task;
  onAccept: (taskId: string) => void;
}

const TaskCard = ({ task, onAccept }: TaskCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "delivery": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shopping": return "bg-green-100 text-green-700 border-green-200";
      case "pickup": return "bg-orange-100 text-orange-700 border-orange-200";
      case "survey": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-success";
      case "medium": return "text-warning";
      case "hard": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="card-clean p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <span className={`text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </div>
        
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-gradient">₹{task.commission}</div>
          <div className="text-xs text-muted-foreground">Commission</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{task.distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{task.duration}</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-primary" />
          <span className="text-muted-foreground">{task.location}</span>
        </div>
      </div>

      <Button 
        onClick={() => onAccept(task.id)}
        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg font-medium"
      >
        Accept Task
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default TaskCard;