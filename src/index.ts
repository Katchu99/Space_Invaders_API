import express, { Request, Response } from "express";
import { initDb } from "./database/db";
import router from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

const initialize = async () => {
  const db = await initDb();

  app.use("/", router(db));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

initialize().catch((error) => {
  console.error("Error initializing the application:", error);
});
