import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "rossduris",
    password: "randompassword",
    database: "hsshop",
    ssl: false, // Set to true if using Neon or other hosted PostgreSQL that requires SSL
  },
});
