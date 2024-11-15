// components/SyncProductsButton.tsx
"use client";

import { useState } from "react";
import { syncStripeProducts } from "../server/syncStripeProducts";

export default function SyncProductsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null); // Clear previous message

    try {
      const result = await syncStripeProducts(); // Call the sync function

      if (result.success) {
        setMessage("Products and prices synced successfully!");
      } else {
        setMessage(result.message || "Failed to sync products.");
      }
    } catch (error) {
      console.error("Error syncing products:", error);
      setMessage("An error occurred while syncing products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Syncing..." : "Sync Products"}
      </button>
      {message && <p className="mt-2 text-gray-700">{message}</p>}
    </div>
  );
}
