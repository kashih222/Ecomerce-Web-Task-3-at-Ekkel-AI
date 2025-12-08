import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  PlusCircle,
  MessageSquareDot,
  Truck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
}

const AdminSidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const Navigate = useNavigate();

     const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/loging/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      Navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };
  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-22"
      } bg-black text-white h-screen transition-all duration-300 sticky left-0 top-0`}
    >
      <div className="ml-2 px-5 py-6 font-bold text-xl transition-all duration-300">
        {sidebarOpen ? "Admin" : "A"}
      </div>

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
          <MessageSquareDot  size={20} />
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

        <NavLink
          to="/"
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-gray-700 transition"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
