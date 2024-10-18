import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL || "default_database_url"; // Replace with a suitable default value

export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  }
});
