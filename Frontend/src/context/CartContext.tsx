import { createContext, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  images: { thumbnail: string };
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  loadCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, action: "inc" | "dec") => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const token = localStorage.getItem("token") || "";

  const loadCart = useCallback(async () => {
    try {
      if (!token) return;
      const { data } = await axios.get("http://localhost:5000/api/cart/get-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cartItems || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  }, [token]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      if (!token) return;
      const { data } = await axios.post(
        "http://localhost:5000/api/cart/add-to-cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cartItems || []);
      toast.success("Product added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (productId: string, action: "inc" | "dec") => {
    try {
      if (!token) return;
      const item = cart.find((cartItem) => cartItem.productId === productId);
      if (!item) return;

      const nextQuantity = action === "inc" ? item.quantity + 1 : item.quantity - 1;
      if (nextQuantity < 1 || nextQuantity === item.quantity) return;

      const { data } = await axios.post(
        "http://localhost:5000/api/cart/update-qty",
        { productId, quantity: nextQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cartItems || []);
      toast.success("Cart updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/cart/remove-item",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cartItems || []);
      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <CartContext.Provider value={{ cart, loadCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
