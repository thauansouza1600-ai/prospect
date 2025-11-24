import type { Config } from "drizzle-kit";

// Use POSTGRES_URL from env (Vercel injects this automatically)
// For local development, ensure you have .env.local loaded
export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;