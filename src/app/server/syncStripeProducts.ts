"use server";

import Stripe from "stripe";
import { db } from "@/db";
import { products, prices } from "@/db/schema";
import { eq } from "drizzle-orm";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function syncStripeProducts() {
  try {
    // Fetch products from Stripe
    const stripeProducts = await stripe.products.list({ limit: 100 });

    console.log(stripeProducts);

    for (const stripeProduct of stripeProducts.data) {
      if (!stripeProduct.active) {
        continue;
      }

      // Start a transaction for each product to ensure consistency
      await db.transaction(async (tx) => {
        // Check if the product already exists in the database
        let productId: string;
        const existingProduct = await tx
          .select()
          .from(products)
          .where(eq(products.stripeId, stripeProduct.id))
          .limit(1);

        if (existingProduct.length > 0) {
          // If product exists, update it and get the productId
          await tx
            .update(products)
            .set({
              name: stripeProduct.name,
              description: stripeProduct.description || "",
              metadata: stripeProduct.metadata,
              isActive: true,
              images: stripeProduct.images,
            })
            .where(eq(products.stripeId, stripeProduct.id));
          productId = existingProduct[0].id;
        } else {
          // If product doesn't exist, insert it and capture the productId
          const insertedProduct = await tx
            .insert(products)
            .values({
              stripeId: stripeProduct.id,
              name: stripeProduct.name,
              description: stripeProduct.description || "",
              metadata: stripeProduct.metadata,
              images: stripeProduct.images,
              isActive: true,
            })
            .returning({ id: products.id });

          productId = insertedProduct[0].id as string;
        }

        // Fetch and sync prices for each Stripe product
        const stripePrices = await stripe.prices.list({
          product: stripeProduct.id,
        });

        for (const stripePrice of stripePrices.data) {
          // Check if the price already exists in the database
          const existingPrice = await tx
            .select()
            .from(prices)
            .where(eq(prices.stripePriceId, stripePrice.id))
            .limit(1);

          if (existingPrice.length > 0) {
            // If price exists, update it
            await tx
              .update(prices)
              .set({
                unitAmount: Number(stripePrice.unit_amount),
                currency: stripePrice.currency,
                isActive: stripePrice.active,
              })
              .where(eq(prices.stripePriceId, stripePrice.id));
          } else {
            // If price doesn't exist, insert it with the correct productId
            await tx.insert(prices).values({
              stripePriceId: stripePrice.id,
              productId: productId, // Use the reliable product ID from the database
              unitAmount: stripePrice.unit_amount!,
              currency: stripePrice.currency,
              isActive: stripePrice.active,
            });
          }
        }
      });
    }

    return {
      success: true,
      message: "Products and prices synced successfully.",
    };
  } catch (error) {
    console.error("Error syncing products:", error);
    return { success: false, message: "Failed to sync products." };
  }
}
