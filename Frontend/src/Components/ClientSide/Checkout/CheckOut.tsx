import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import client from "../../../GraphqlOprations/apolloClient";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/hooks";
import {
  removeItem,
  selectCartItems,
  updateQuantity,
  clearCart
 
} from "../../../Redux Toolkit/features/cart/cartSlice";

import { CREATE_ORDER } from "../../../GraphqlOprations/mutation";

const CheckOut: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);

  const [createOrder] = useMutation(CREATE_ORDER, {client});

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = async () => {
    if (!fullName || !email || !phone || !city || !address) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    setLoading(true);

    try {
      await createOrder({
        variables: {
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice,
          shippingDetails: {
            fullName,
            email,
            phone,
            city,
            address,
          },
        },
      });

      toast.success("Order placed successfully!");

      setFullName("");
      setEmail("");
      setPhone("");
      setCity("");
      setAddress("");

      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      dispatch(clearCart());
    }

  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* CART SUMMARY */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        action: "dec",
                      })
                    )
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        action: "inc",
                      })
                    )
                  }
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>

                <button
                  onClick={() =>
                    dispatch(removeItem({ productId: item.productId }))
                  }
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="flex justify-between mt-6 text-lg font-semibold">
            <p>Total:</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* SHIPPING FORM */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded-md col-span-2"
          />

          <button
            type="button"
            onClick={handleOrder}
            disabled={loading || cart.length === 0}
            className="col-span-2 mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
