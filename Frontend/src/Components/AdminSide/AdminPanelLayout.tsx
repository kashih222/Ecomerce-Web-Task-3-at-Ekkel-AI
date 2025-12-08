import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSide/Sidebar/AdminSidebar";
import AdminHeader from "../AdminSide/Headers/AdminHeader ";

const AdminPanelLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="p-6 overflow-y-auto h-[calc(100vh-70px)]">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
