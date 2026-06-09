import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

dotenv.config();

const dbFile = path.resolve(process.cwd(), process.env.DB_FILE ?? "data/library.db");

const schemaPath = path.resolve(process.cwd(), "sql", "schema.sql");
const seedPath = path.resolve(process.cwd(), "sql", "seed.sql");

const run = async () => {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });

  const db = await open({ filename: dbFile, driver: sqlite3.Database });
  try {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    const seed = fs.readFileSync(seedPath, "utf-8");

    await db.exec(schema);
    await db.exec(seed);

    console.log(`SQLite database initialized successfully at '${dbFile}'.`);
  } finally {
    await db.close();
  }
};

run().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
