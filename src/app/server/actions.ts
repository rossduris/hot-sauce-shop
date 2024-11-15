// server/actions.ts
"use server";

import { db } from "@/db";
import { products, prices } from "@/db/schema";

// Function to retrieve all products and their associated prices
export async function getProducts() {
  try {
    // Fetch all products
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        category: products.category,
        stock: products.stock,
        createdAt: products.createdAt,
        images: products.images,
      })
      .from(products);

    // Fetch all prices
    const priceData = await db
      .select({
        id: prices.id,
        productId: prices.productId,
        unitAmount: prices.unitAmount,
        currency: prices.currency,
        isActive: prices.isActive,
      })
      .from(prices);

    // Combine prices with their respective products
    const productsWithPrices = productData.map((product) => ({
      ...product,
      prices: priceData.filter((price) => price.productId === product.id),
    }));

    return productsWithPrices;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
