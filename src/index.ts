import express from "express";
import { initDb } from "./database/db";
import router from "./routes";

const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

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
