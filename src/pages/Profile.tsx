import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const Profile = () => {
  const { signOut } = useClerk();

  const user = {
    name: "Chakri",
    email: "chakri@example.com",
    stepsThisWeek: 18340,
    totalKm: 27.4,
    rank: 12,
    wallet: 155,
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";  // redirect to home
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">

      {/* Top Section */}
      <div className="text-center px-6 pt-10">
        <div className="flex flex-col items-center">

          <Avatar className="h-28 w-28 shadow-lg border-4 border-purple-200">
            <AvatarImage src="https://i.imgur.com/1whoCM3.jpeg" />
            <AvatarFallback>CK</AvatarFallback>
          </Avatar>

          <h1 className="text-3xl font-extrabold mt-4 text-purple-700">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>

          <Button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
            Edit Profile
          </Button>
        </div>

        <Separator className="my-8" />
      </div>

      {/* Stats */}
      <div className="px-6">
        <Card className="p-6 shadow-md rounded-2xl bg-white/90 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Your Weekly Performance</h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-50 rounded-xl p-3 shadow-sm">
              <p className="text-xl font-bold text-purple-700">{user.stepsThisWeek}</p>
              <p className="text-sm text-muted-foreground">Steps</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 shadow-sm">
              <p className="text-xl font-bold text-purple-700">{user.totalKm} km</p>
              <p className="text-sm text-muted-foreground">Distance</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 shadow-sm">
              <p className="text-xl font-bold text-purple-700">#{user.rank}</p>
              <p className="text-sm text-muted-foreground">Rank</p>
            </div>
          </div>
        </Card>

        {/* Wallet */}
        <Card className="p-6 mt-6 shadow-md rounded-2xl bg-white/90 backdrop-blur">
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Wallet Balance</h2>

          <p className="text-4xl font-bold text-green-600">₹{user.wallet}</p>
          <p className="text-muted-foreground text-sm mt-1">Your total earnings</p>

          <Button className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg">
            Withdraw Money
          </Button>
        </Card>

        {/* LOGOUT BUTTON */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </Button>

      </div>
    </div>
  );
};

export default Profile;
