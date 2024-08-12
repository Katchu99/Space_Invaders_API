import express, { Response } from "express";
import { CustomRequest } from "../types/types";
import { verifyToken } from "../middleware/verifyToken";
import { DataModel } from "../models/data";
import { DataController } from "../controllers/data";

export default (router: express.Router, db: any) => {
  const dataModel = new DataModel(db);
  const dataController = new DataController(dataModel);

  router.get("/highscores/get", (req: CustomRequest, res: Response) => {});
  router.post(
    "/highscores/set",
    verifyToken,
    (req: CustomRequest, res: Response) => dataController.setHighscore(req, res)
  );
};
