interface Product {
  id: string;
  name: string;
  description: string;
  category?: string;
  stock: number;
  prices: Price[];
  images: string[];
}

interface Price {
  id: string;
  unitAmount: number;
  currency: string;
  isActive: boolean;
}

interface Order {
  id: string; // Unique identifier for the order
  userId?: string | null; // Optional: ID of the user placing the order (null if guest)
  stripeSessionId: string; // Stripe session ID for referencing the payment
  stripeStatus: string; // Status of the payment in Stripe (e.g., 'paid')
  totalAmount: number; // Total order amount in cents
  createdAt: Date; // Timestamp for when the order was created
  items: OrderItem[]; // Array of items in the order
}

interface OrderItem {
  id: string; // Unique identifier for the order item
  productId: string; // Product ID for referencing the product
  quantity: number; // Quantity of the product in the order
  unitAmount: number; // Price per unit in cents
  currency: string; // Currency code (e.g., "usd")
}
