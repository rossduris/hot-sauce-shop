"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function ShoppingCart() {
  const [isVisible, setIsVisible] = useState(false);
  const { state, dispatch } = useCart();
  const router = useRouter();

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, quantity } });
  };

  const handleCheckout = () => {
    // Redirect to the cart review page
    setIsVisible(false);
    router.push("/cart");
  };

  return (
    <div>
      {/* Toggle Cart Visibility Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
      >
        Cart ({state.items.length})
      </button>

      {/* Cart Items */}
      <div
        className={`p-4 fixed bg-white right-0 shadow-lg rounded-lg max-w-xs transition-transform duration-300 ${
          isVisible ? "transform translate-x-0" : "transform translate-x-full"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">Shopping Cart</h2>
        {state.items.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <>
            <ul className="space-y-4">
              {state.items.map((item: any) => (
                <li key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${(item.price / 100).toFixed(2)} x {item.quantity}
                    </p>
                    <p className="text-sm font-bold">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, Number(e.target.value))
                      }
                      className="w-12 text-center border rounded"
                    />
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-sm font-bold">
                Total: ${(state.total / 100).toFixed(2)}
              </p>
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2 hover:bg-blue-600"
              >
                Continue to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
