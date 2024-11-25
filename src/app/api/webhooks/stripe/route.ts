import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Create the order
      const orderData = {
        id: session.id,
        userId: session.client_reference_id || null,
        stripeCheckoutSessionId: session.id,
        stripeStatus: session.payment_status || "unpaid",
        totalAmount: session.amount_total || 0,
        status: "paid",
        createdAt: new Date(),
      };

      // Insert order first
      await db.insert(orders).values(orderData);

      // Insert order items
      const orderItemsData = lineItems.data.map((item) => ({
        id: crypto.randomUUID(), // or use nanoid() if you prefer
        orderId: session.id,
        productId: item.price?.product as string, // Assuming product ID is stored in metadata
        quantity: item.quantity || 1,
        price: item.price?.unit_amount || 0,
        subtotal: (item.price?.unit_amount || 0) * (item.quantity || 1),
      }));

      await db.insert(orderItems).values(orderItemsData);

      console.log("Order and items saved to database");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
