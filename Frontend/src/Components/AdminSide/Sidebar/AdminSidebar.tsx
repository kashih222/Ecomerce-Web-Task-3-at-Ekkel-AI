import { LayoutDashboard, Users, Package, Settings, LogOut, PlusCircle, MessageSquareDot,Truck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../../../GraphqlOprations/mutation";

interface SidebarProps {
  sidebarOpen: boolean;
}

const AdminSidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();

  // Use the GraphQL mutation for logout
  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER, {
    onCompleted: (data) => {
      if (data.logoutUser.success) {
        toast.success(data.logoutUser.message || "Logged out successfully!");
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

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (logoutLoading) return;

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <aside
      className={`${ sidebarOpen ? "w-64" : "w-22" } bg-black text-white h-screen transition-all duration-300 sticky left-0 top-0 z-100`}
    >
      <Link to="/dashboard">
        <div className="ml-2 px-5 py-6 font-bold text-xl transition-all duration-300">
          {sidebarOpen ? "Admin" : "A"}
        </div>
      </Link>

      <nav className="mt-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <LayoutDashboard size={20} />
          {sidebarOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/dashboard/users"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <Users size={22} />
          {sidebarOpen && <span>Users</span>}
        </NavLink>

        <NavLink
          to="/dashboard/add-product"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <PlusCircle size={22} />
          {sidebarOpen && <span>Add Product</span>}
        </NavLink>

        <NavLink
          to="/dashboard/products"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <Package size={25} />
          {sidebarOpen && <span>Products</span>}
        </NavLink>

        <NavLink
          to="/dashboard/orders"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <Truck size={25} />
          {sidebarOpen && <span>Orders</span>}
        </NavLink>

        <NavLink
          to="/dashboard/client/messages"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <MessageSquareDot size={20} />
          {sidebarOpen && <span>Client Messages</span>}
        </NavLink>

        <a
          href="#"
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
        >
          <Settings size={23} />
          {sidebarOpen && <span>Settings</span>}
        </a>

        <div className="border-t border-gray-700 mt-4"></div>

        <a
          href="#"
          onClick={handleLogout}
          className={`flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-gray-700 transition ${
            logoutLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
          )}
        </a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
