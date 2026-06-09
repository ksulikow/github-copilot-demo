import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

dotenv.config();

const dbFile = path.resolve(process.cwd(), process.env.DB_FILE ?? "data/library.db");
let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export const getDb = async () => {
  if (!dbPromise) {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });

    dbPromise = open({ filename: dbFile, driver: sqlite3.Database }).then(async (db) => {
      await db.exec("PRAGMA foreign_keys = ON;");
      await db.exec("PRAGMA journal_mode = WAL;");
      return db;
    });
  }

  return dbPromise;
};

export { dbFile };
