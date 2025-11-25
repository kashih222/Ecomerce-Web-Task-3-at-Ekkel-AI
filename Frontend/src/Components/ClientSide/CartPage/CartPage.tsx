import { useEffect, useContext } from "react";
import CartContext from "../../../context/CartContext";
import { NavLink } from "react-router-dom";

const CartPage = () => {
  const { cart, loadCart, updateQuantity, removeItem } = useContext(CartContext)!;

  useEffect(() => {
    loadCart();
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (!cart) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-2xl font-semibold">
        Loading Cart...
      </div>
    );
  }

  return (
    <div className="mt-24 w-full min-h-screen bg-gray-100 py-10 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-widest">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">
            Your cart is empty!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cart
                .filter((item) => item.productId)
                .map((item) => {
                  const thumbnail = item.images?.thumbnail || "/placeholder.png";

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex gap-4"
                    >
                      <div className="w-32 h-32 rounded-lg overflow-hidden">
                        <img src={thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">{item.name}</h2>
                          <p className="text-gray-600">${item.price}</p>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            className="px-4 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                            onClick={() => updateQuantity(item.productId, "dec")}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">{item.quantity}</span>
                          <button
                            className="px-4 py-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                            onClick={() => updateQuantity(item.productId, "inc")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="text-red-600 hover:text-red-800 text-xl font-bold"
                        onClick={() => removeItem(item.productId)}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-lg mb-3">
                <span>Total Items:</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-xl font-semibold mb-6">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <NavLink to="/cart/check-out">
                <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-lg font-semibold">
                Proceed to Checkout
              </button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
