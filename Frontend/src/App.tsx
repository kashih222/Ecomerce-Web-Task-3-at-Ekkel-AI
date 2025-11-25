import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import AboutPage from "./Components/AboutPage/AboutPage";
import ProductsPage from "./Components/ProductsPage/ProductsPage";
import ContactPage from "./Components/ContactPage/ContactPage";
import CartPage from "./Components/Cart Page/CartPage";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Toast from "./Components/Toaster/Toast";
import CartContext from "./context/CartContext";
import { useEffect, useContext } from "react";
import CheckOut from "./Components/Checkout/CheckOut";

const App = () => {
  const cartContext = useContext(CartContext);
  useEffect(() => {
    if (cartContext?.loadCart) {
      cartContext.loadCart();
    }
  }, []);

  return (
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
  );
};

export default App;
