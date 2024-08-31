import express, { Response } from "express";
import { CustomRequest } from "../types/types";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/verifyToken";
import { DataModel } from "../models/data";
import { DataController } from "../controllers/data";
// import { restoreOriginalRequestData } from "../middleware/originalRequestData";

export default (router: express.Router, db: any) => {
  const dataModel = new DataModel(db);
  const dataController = new DataController(dataModel);

  router.get(
    "/highscores/personal/get",
    verifyAccessToken,
    verifyRefreshToken,
    (req: CustomRequest, res: Response) =>
      dataController.getPersonalHighscore(req, res)
  );

  router.get("/highscores/top/get", (req: CustomRequest, res: Response) =>
    dataController.getPersonalHighscore(req, res)
  );

  router.post(
    "/highscores/set",
    verifyAccessToken,
    verifyRefreshToken,
    (req: CustomRequest, res: Response) => dataController.setHighscore(req, res)
  );
};
