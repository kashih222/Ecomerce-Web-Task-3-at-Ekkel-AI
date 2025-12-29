import { useState } from "react";
import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../../../GraphqlOprations/mutation";
import { GET_LOGED_IN_USER_INFO } from "../../../GraphqlOprations/queries";
import { useMutation, useQuery } from "@apollo/client";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface LoggedUser {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

const AdminHeader: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState<LoggedUser | null>(() => {
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

  const { loading } = useQuery(GET_LOGED_IN_USER_INFO, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.loggedInUser) {
        setUser(data.loggedInUser);
        localStorage.setItem("user", JSON.stringify(data.loggedInUser));
      }
    },
    onError: (error) => {
      console.error("Error fetching user info:", error);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
        }
      }
    }
  });

  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER, {
    onCompleted: (data) => {
      if (data.logoutUser.success) {
        toast.success(data.logoutUser.message || "Logged out successfully!");
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle loading and error states
  if (loading && !user) {
    return (
      <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">Loading user info...</span>
          </div>
        </div>
      </header>
    );
  }

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

            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition border border-gray-100 z-50">
              {user && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium truncate">{user.fullname}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {user.role && (
                    <p className="text-xs text-blue-600 mt-1">Role: {user.role}</p>
                  )}
                </div>
              )}
              
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