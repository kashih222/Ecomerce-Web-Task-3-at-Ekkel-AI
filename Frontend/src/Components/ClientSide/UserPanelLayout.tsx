import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../ClientSide/HomePage/HomePage";
import AboutPage from "../ClientSide/AboutPage/AboutPage";
import ProductsPage from "../ClientSide/ProductsPage/ProductsPage";
import ContactPage from "../ClientSide/ContactPage/ContactPage";
import CartPage from "../ClientSide/CartPage/CartPage";
import Navbar from "../ClientSide/Navbar/Navbar";
import Footer from "../ClientSide/Footer/Footer";
import Toast from "../ClientSide/Toaster/Toast";
import CartContext from "../../context/CartContext";
import CheckOut from "../ClientSide/Checkout/CheckOut";

const UserPanelLayout = () => {
  const cartContext = useContext(CartContext);
  useEffect(() => {
    if (cartContext?.loadCart) {
      cartContext.loadCart();
    }
  }, []);
  return (
    <div>
      <Router>
        <Navbar />
        <Toast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/check-out" element={<CheckOut />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default UserPanelLayout;
