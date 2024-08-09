import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export const initDb = async () => {
  const dbPath = path.join(__dirname, "database.sqlite");
  const migrationsPath = path.join(__dirname, "migrations");

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    await db.migrate({ migrationsPath });
    console.log("Migration successfully applied");
  } catch (err) {
    console.error("Error during migration:", err);
  }
  // await db.migrate({ migrationsPath: "./src/database/migrations" });

  return db;
};
