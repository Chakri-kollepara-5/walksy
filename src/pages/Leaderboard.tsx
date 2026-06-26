import { useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("steps");

  const periods = [
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" }
  ];

  const categories = [
    { id: "steps", label: "Steps", icon: TrendingUp },
    { id: "earnings", label: "Earnings", icon: Trophy },
    { id: "tasks", label: "Tasks", icon: Award }
  ];

  const leaderboardData = [
    {
      rank: 1,
      name: "Priya Sharma",
      avatar: "PS",
      steps: 15240,
      earnings: 2450,
      tasks: 18,
      level: 25,
      streak: 12
    },
    {
      rank: 2,
      name: "Rahul Kumar",
      avatar: "RK", 
      steps: 14890,
      earnings: 2280,
      tasks: 16,
      level: 23,
      streak: 8
    },
    {
      rank: 3,
      name: "Anjali Patel",
      avatar: "AP",
      steps: 13950,
      earnings: 2150,
      tasks: 15,
      level: 22,
      streak: 15
    },
    {
      rank: 4,
      name: "Vikram Singh",
      avatar: "VS",
      steps: 12800,
      earnings: 1980,
      tasks: 14,
      level: 20,
      streak: 6
    },
    {
      rank: 5,
      name: "Sneha Reddy",
      avatar: "SR",
      steps: 12340,
      earnings: 1850,
      tasks: 13,
      level: 19,
      streak: 9
    }
  ];

  // Current user data
  const currentUser = {
    rank: 47,
    name: "Alex Runner",
    avatar: "AR",
    steps: 7234,
    earnings: 1250,
    tasks: 8,
    level: 12,
    streak: 3
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getDisplayValue = (user: any) => {
    switch (selectedCategory) {
      case "steps": return user.steps.toLocaleString();
      case "earnings": return `₹${user.earnings}`;
      case "tasks": return user.tasks;
      default: return user.steps.toLocaleString();
    }
  };

  const getDisplayUnit = () => {
    switch (selectedCategory) {
      case "steps": return "steps";
      case "earnings": return "earned";
      case "tasks": return "completed";
      default: return "steps";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary-dark text-white p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
          <p className="text-sm text-white/80">Compete with walkers around you</p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-4">
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
              className="flex-1 text-white border-white/20"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-1 flex items-center gap-2 text-white border-white/20"
              >
                <Icon size={16} />
                {category.label}
              </Button>
            );
          })}
        </div>
      </header>

      <div className="p-6">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mb-2 shadow-md">
                <span className="text-lg font-bold text-gray-800">{leaderboardData[1].avatar}</span>
              </div>
              <div className="card-clean p-3 bg-gray-50">
                <Medal className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm font-semibold text-foreground">{leaderboardData[1].name.split(' ')[0]}</div>
                <div className="text-xs text-primary font-bold">{getDisplayValue(leaderboardData[1])}</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mb-2 shadow-lg">
                <span className="text-xl font-bold text-yellow-900">{leaderboardData[0].avatar}</span>
              </div>
              <div className="card-clean p-4 bg-primary/5 border-primary/20">
                <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-sm font-semibold text-foreground">{leaderboardData[0].name.split(' ')[0]}</div>
                <div className="text-sm text-gradient font-bold">{getDisplayValue(leaderboardData[0])}</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-2 shadow-md">
                <span className="text-lg font-bold text-amber-100">{leaderboardData[2].avatar}</span>
              </div>
              <div className="card-clean p-3 bg-amber-50">
                <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-foreground">{leaderboardData[2].name.split(' ')[0]}</div>
                <div className="text-xs text-primary font-bold">{getDisplayValue(leaderboardData[2])}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-3 mb-6">
          {leaderboardData.slice(3).map((user) => (
            <div key={user.rank} className="card-clean p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                  <span className="font-bold text-primary">{user.avatar}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Level {user.level}</span>
                    <span>•</span>
                    <span>{user.streak} day streak</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gradient">{getDisplayValue(user)}</div>
                  <div className="text-xs text-muted-foreground">{getDisplayUnit()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position */}
        <div className="card-clean p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-8 text-center">
              <span className="text-lg font-bold text-primary">#{currentUser.rank}</span>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{currentUser.name} (You)</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Level {currentUser.level}</span>
                <span>•</span>
                <span>{currentUser.streak} day streak</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gradient">{getDisplayValue(currentUser)}</div>
              <div className="text-xs text-muted-foreground">{getDisplayUnit()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;