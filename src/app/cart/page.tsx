"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state } = useCart();
  const router = useRouter();

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: state.items }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Review Your Cart</h1>
      {state.items.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div>
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${(item.price / 100).toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="text-lg font-bold">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <p className="text-lg font-bold">
              Total: ${(state.total / 100).toFixed(2)}
            </p>
            <button
              onClick={handlePayment}
              className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
