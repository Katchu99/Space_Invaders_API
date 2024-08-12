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

  router.post(
    "/auth/refresh",
    (
      req: Request,
      res: Response //is POST because its accessed with a res.redirect(307, "/auth/refresh")
    ) => userController.refresh(req, res)
  );

  router.post("/auth/logout", (req: Request, res: Response) => {});
};
