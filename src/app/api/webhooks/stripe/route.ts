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

  // Handle the event
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderData = {
        id: session.id,
        userId: session.client_reference_id || null, // Fallback to null if guest checkout
        stripeCheckoutSessionId: session.id, // Ensure stripeCheckoutSessionId is set
        stripeStatus: session.payment_status || "unpaid",
        totalAmount: session.amount_total || 0,
        status: "paid", // Assuming this is the final state
        createdAt: new Date(),
      };

      const insertedOrder = await db.insert(orders).values(orderData);

      console.log("Order saved to database:", insertedOrder);
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
