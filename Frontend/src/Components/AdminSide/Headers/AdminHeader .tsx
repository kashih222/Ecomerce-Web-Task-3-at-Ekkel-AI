import { useState } from "react";
import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../../../GraphqlOprations/mutation";
import { useMutation } from "@apollo/client";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface LoggedUser {
  fullname: string;
  email: string;
}

const AdminHeader: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [user] = useState<LoggedUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  // Use the GraphQL mutation for logout
  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER, {
    onCompleted: (data) => {
      if (data.logoutUser.success) {
        toast.success(data.logoutUser.message || "Logged out successfully!");
        
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        
        navigate("/");
      } else {
        toast.error(data.logoutUser.message || "Logout failed");
      }
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  // Logout handler
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (logoutLoading) return;

    try {
      await logoutUser();
      //
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="flex justify-between items-center px-2 py-3">
        {/* LEFT — Menu + Title */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-xl font-semibold text-gray-700 hidden">
            Admin Dashboard
          </h1>
        </div>

        {/* RIGHT — Icons */}
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell size={22} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative group ml-2">
            <button 
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="User profile"
            >
              <User size={22} />
              <span className="font-medium">
                {user ? user.fullname : "Admin"}
              </span>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition border border-gray-100 z-50">
              <button 
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                onClick={() => navigate("/dashboard/settings")}
              >
                <Settings size={18} /> 
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 text-red-500 ${
                  logoutLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <LogOut size={18} />
                <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;