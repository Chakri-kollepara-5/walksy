import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const walletData = {
    balance: 1250,
    totalEarned: 8950,
    pendingAmount: 320,
    thisWeekEarnings: 450
  };

  const transactions = [
    {
      id: "1",
      type: "credit",
      title: "Task Completed",
      description: "Coffee delivery to Tech Park",
      amount: 85,
      date: "2024-01-15",
      time: "14:30",
      status: "completed"
    },
    {
      id: "2", 
      type: "credit",
      title: "Task Completed",
      description: "Grocery shopping at Forum Mall",
      amount: 120,
      date: "2024-01-15",
      time: "11:15",
      status: "completed"
    },
    {
      id: "3",
      type: "debit",
      title: "Withdrawal",
      description: "Bank transfer to SBI ****1234",
      amount: 500,
      date: "2024-01-14",
      time: "16:45",
      status: "completed"
    },
    {
      id: "4",
      type: "credit",
      title: "Task Completed", 
      description: "Document pickup service",
      amount: 180,
      date: "2024-01-14",
      time: "13:20",
      status: "completed"
    },
    {
      id: "5",
      type: "credit",
      title: "Bonus Reward",
      description: "Daily challenge completed",
      amount: 50,
      date: "2024-01-13",
      time: "18:00",
      status: "completed"
    }
  ];

  const periods = [
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary-dark text-white p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-4">Wallet</h1>
          
          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-sm text-white/80">Available Balance</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 h-auto text-white/80 hover:text-white"
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
            </div>
            
            <div className="text-4xl font-bold mb-6">
              {showBalance ? `₹${walletData.balance}` : "₹****"}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium">
                <ArrowUpRight size={16} className="mr-2" />
                Withdraw
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Plus size={16} className="mr-2" />
                Add Money
              </Button>
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
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
      </header>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-clean p-4 text-center">
            <TrendingUp className="w-5 h-5 text-success mx-auto mb-2" />
            <div className="text-lg font-bold text-success">₹{walletData.totalEarned}</div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </div>
          
          <div className="card-clean p-4 text-center">
            <div className="w-5 h-5 rounded-full bg-warning/20 mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
            </div>
            <div className="text-lg font-bold text-warning">₹{walletData.pendingAmount}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          
          <div className="card-clean p-4 text-center">
            <div className="w-5 h-5 rounded-full bg-primary/20 mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div className="text-lg font-bold text-primary">₹{walletData.thisWeekEarnings}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="card-clean p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "credit" 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{transaction.title}</h4>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.time}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.type === "credit" ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" className="text-primary hover:text-primary-dark">
              View All Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;