import { Home, ListTodo, Wallet, Trophy, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const navItems = [
    { path: "/", label: "Home", icon: <Home size={22} /> },
    { path: "/tasks", label: "Tasks", icon: <ListTodo size={22} /> },
    { path: "/wallet", label: "Wallet", icon: <Wallet size={22} /> },
    { path: "/leaderboard", label: "Rank", icon: <Trophy size={22} /> },
    { path: "/profile", label: "Profile", icon: <User size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg py-3 z-50 flex justify-around">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs ${
              isActive ? "text-primary font-semibold" : "text-gray-500"
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
