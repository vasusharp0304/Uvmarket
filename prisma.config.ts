import { config as loadEnv } from 'dotenv';
import { defineConfig } from "prisma/config";

loadEnv();

// Get the database URL based on environment
const getDatabaseUrl = () => {
  // Priority 1: PostgreSQL (Railway/Production)
  if (process.env.DATABASE_URL?.startsWith('postgres://') || process.env.DATABASE_URL?.startsWith('postgresql://')) {
    return process.env.DATABASE_URL;
  }

  // Priority 2: Turso/LibSQL (Alternative Production)
  if (process.env.TURSO_DATABASE_URL?.startsWith('libsql://')) {
    return process.env.TURSO_DATABASE_URL;
  }

  // Priority 3: Use DATABASE_URL as-is (for SQLite development if explicitly set)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // No fallback - require explicit database configuration
  throw new Error(
    'No database URL configured. Please set one of the following environment variables:\n' +
    '  - DATABASE_URL (for PostgreSQL or SQLite)\n' +
    '  - TURSO_DATABASE_URL (for Turso/LibSQL)'
  );
};

const datasourceUrl = getDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
