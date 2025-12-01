import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserPanelLayout from "./Components/ClientSide/UserPanelLayout";
import AdminPanelLayout from "./Components/AdminSide/AdminPanelLayout";
import DashboardHome from "./Components/AdminSide/DashboardHome/DashboardHome";
import AddProductPage from "./Components/AdminSide/AddProduct/AddProductPage";
import AdminProductsPage from "./Components/AdminSide/Products/AdminProductsPage ";
import AdminUsersPage from "./Components/AdminSide/UsersPage/AdminUsersPage";
import Toast from "./Components/ClientSide/Toaster/Toast";
import AdminContactMessages from "./Components/AdminSide/ContactMessage/AdminContactMessages";
import AdminOrders from "./Components/AdminSide/Orders/AdminOrders";

const App = () => {
  return (
    <Router>
      <Toast/>
      <Routes>
        {/* User Routes */}
        <Route path="/*" element={<UserPanelLayout />} />

        {/* Admin Routes */}
        <Route path="/dashboard/*" element={<AdminPanelLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="client/messages" element={<AdminContactMessages />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
