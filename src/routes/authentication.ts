import express, { Request, Response } from "express";
import { UserModel } from "../models/user";
import { UserController } from "../controllers/user";

export default (router: express.Router, db: any) => {
  const userModel = new UserModel(db);
  const userController = new UserController(userModel);

  router.post("/auth/login", (req: Request, res: Response) =>
    userController.login(req, res)
  );

  router.post("/auth/register", (req: Request, res: Response) =>
    userController.register(req, res)
  );
};
