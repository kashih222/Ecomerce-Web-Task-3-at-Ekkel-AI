import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../ClientSide/HomePage/HomePage";
import AboutPage from "../ClientSide/AboutPage/AboutPage";
import ProductsPage from "../ClientSide/ProductsPage/ProductsPage";
import ContactPage from "../ClientSide/ContactPage/ContactPage";
import CartPage from "../ClientSide/CartPage/CartPage";
import Navbar from "../ClientSide/Navbar/Navbar";
import Footer from "../ClientSide/Footer/Footer";
import Toast from "../ClientSide/Toaster/Toast";
import CheckOut from "../ClientSide/Checkout/CheckOut";
import { useAppDispatch } from "../../Redux Toolkit/hooks";
import { fetchCart } from "../../Redux Toolkit/features/cart/cartSlice";

const UserPanelLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="cart/check-out" element={<CheckOut />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default UserPanelLayout;
