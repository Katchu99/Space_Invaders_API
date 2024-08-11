import express, { Response } from "express";
import { CustomRequest } from "../types/types";
import { verifyToken } from "../middleware/verifyToken";

export default (router: express.Router, db: any) => {
  router.get("/highscores/get", (req: CustomRequest, res: Response) => {});
  router.post(
    "/highscores/set",
    verifyToken,
    (req: CustomRequest, res: Response) => {}
  );
};
