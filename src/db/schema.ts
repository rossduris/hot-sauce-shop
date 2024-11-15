import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

// Users Table
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Accounts Table
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

// Products Table
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stripeId: text("stripeId").unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  stock: integer("stock").default(0),
  metadata: jsonb("metadata"), // Store additional metadata as JSON if supported
  images: jsonb("images"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Prices Table
export const prices = pgTable("price", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stripePriceId: text("stripePriceId").unique().notNull(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  unitAmount: integer("unitAmount").notNull(),
  currency: text("currency").notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Variants Table
export const variants = pgTable("variant", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  priceId: text("priceId")
    .notNull()
    .references(() => prices.id, { onDelete: "cascade" }),
  size: text("size"),
  spiciness: integer("spiciness"),
  stock: integer("stock").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId").references(() => users.id, { onDelete: "set null" }), // Use set null if you don't want cascading deletes
  stripeCheckoutSessionId: text("stripeCheckoutSessionId"), // Updated name for clarity
  stripeStatus: text("stripeStatus"), // Optional: Track Stripe payment status
  totalAmount: doublePrecision("totalAmount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Order Items Table
export const orderItems = pgTable("orderItem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Use integer for currency in cents
  subtotal: integer("subtotal").notNull(),
});

// Reviews Table
export const reviews = pgTable("review", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  orders: many(orders),
  reviews: many(reviews),
}));

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

// Types for type safety
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
