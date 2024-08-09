import express, { Request, Response } from "express";
import { initDb } from "./database/db";
import { UserModel } from "./models/user";
import { UserController } from "./controllers/user";

const app = express();
const port = 3000;

app.use(express.json());

const initialize = async () => {
  const db = await initDb();

  const userModel = new UserModel(db);
  const userController = new UserController(userModel);

  app.post("/login", (req, res) => userController.login(req, res));

  app.post("/register", (req, res) => userController.register(req, res));

  app.post("/setHighscore", (req: Request, res: Response) => {});

  app.get("/getHighscore", (req: Request, res: Response) => {});

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

initialize().catch((error) => {
  console.error("Error initializing the application:", error);
});
