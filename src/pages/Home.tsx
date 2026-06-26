import { useState } from "react";
import { Wallet, TrendingUp, Clock, Star, Bell, Sparkles } from "lucide-react";
import StepCounter from "@/components/StepCounter";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [userData] = useState({
    name: "Alex Runner",
    steps: 7234,
    goal: 10000,
    calories: 432,
    distance: 5.8,
    earnings: 1250,
    level: 12,
    rank: 47,
  });

  const [quickTasks] = useState([
    {
      id: "1",
      title: "Deliver Coffee",
      description: "Pick up coffee from Starbucks and deliver to office building",
      location: "MG Road, Bangalore",
      distance: "0.8 km",
      duration: "15 min",
      commission: 85,
      category: "delivery" as const,
      difficulty: "easy" as const,
    },
    {
      id: "2",
      title: "Grocery Shopping",
      description: "Buy groceries from local supermarket - list provided",
      location: "Forum Mall, Koramangala",
      distance: "1.2 km",
      duration: "25 min",
      commission: 120,
      category: "shopping" as const,
      difficulty: "medium" as const,
    },
  ]);

  const handleTaskAccept = (taskId: string) => {
    console.log("Accepted task:", taskId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* 🌟 Responsive Hero Section */}
      <section className="w-full text-center py-14 px-6 md:px-10 lg:px-16 bg-gradient-to-b from-[#f3e8ff] to-white">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 px-4 py-1 rounded-full 
                        text-sm font-medium text-purple-600 shadow-sm">
          <Sparkles size={16} />
          Now Live — Join 50K+ Walkers
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-purple-700 leading-snug">
          Walk Your Way to <br className="hidden md:block" /> Wellness
        </h1>

        {/* Subtext */}
        <p className="mt-3 md:mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Track steps, earn rewards, compete with friends, and reach your fitness goals.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-8 py-5 
                             text-white rounded-xl text-lg shadow-md transition">
            Start Walking Today
          </Button>

          
        </div>

        {/* Stats Row */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">

          <div className="bg-white shadow-md rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-700">2,820+</p>
            <p className="text-gray-600 text-sm">Active Users</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-700">74,040+</p>
            <p className="text-gray-600 text-sm">Steps Today</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-700">1,380+</p>
            <p className="text-gray-600 text-sm">KM This Week</p>
          </div>

        </div>
      </section>

      {/* Dashboard Content */}
      <div className="px-5 md:px-8 mt-6 space-y-8 max-w-3xl mx-auto">

        {/* Step Counter */}
        <StepCounter
          steps={userData.steps}
          goal={userData.goal}
          calories={userData.calories}
          distance={userData.distance}
        />

        {/* Daily Challenge */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 
                        border border-primary/20 shadow-sm">
          
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-7 h-7 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold">Daily Challenge</h3>
              <p className="text-sm text-muted-foreground">Complete 3 tasks before 6 PM</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-1/3"></div>
                </div>
                <span className="text-xs text-muted-foreground">1/3</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₹200</p>
              <p className="text-xs text-muted-foreground">Bonus</p>
            </div>
          </div>

        </div>

        {/* Tasks Near You */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tasks Near You</h2>
            <Button variant="ghost" className="text-primary">View All</Button>
          </div>

          <div className="space-y-4">
            {quickTasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                onAccept={handleTaskAccept}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button className="h-14 bg-primary text-white text-lg">Start Walking</Button>
          <Button variant="outline" className="h-14 border-primary text-primary text-lg">
            Find Tasks
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Home;
