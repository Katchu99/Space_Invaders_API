import express from "express";
import { initDb } from "./database/db";
import router from "./routes";
import { loadBlacklistFromDb, saveBlacklistToDb } from "./utils/tokenBlacklist";

const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const initialize = async () => {
  const db = await initDb();

  loadBlacklistFromDb(db); // Load blacklist to cache from database
  process.on("SIGINT", () => {
    // Save Black to database on SIGINT
    saveBlacklistToDb(db);
  });

  app.use("/", router(db));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

initialize().catch((error) => {
  console.error("Error initializing the application:", error);
});
