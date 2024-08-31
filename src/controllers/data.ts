import { Response } from "express";
import { DataModel } from "../models/data";
import { CustomRequest } from "../types/types";

export class DataController {
  constructor(private model: DataModel) {}

  async setHighscore(req: CustomRequest, res: Response) {
    try {
      const score = req.body;
      const userId = req.userId;

      if (!userId || !score) {
        return res.status(400).json({ error: "Invalid request" }).end();
      }
      const result = await this.model.setHighscore(userId, score);

      if (result.success) {
        res.status(200).end();
      } else {
        res.status(400).json({ error: result.error }).end();
      }
    } catch (err) {
      console.log(`Error setting highscore: ${err}`);
      res
        .status(500)
        .json({ error: `Failed to set highscore: ${err}` })
        .end();
    }
  }

  async getPersonalHighscore(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).json({ error: "Invalid request" }).end();
      }

      const result = await this.model.getPersonalHighscore(userId);
      return res.status(200).json(result);
    } catch (err) {
      console.log(`Error getting personal highscore: ${err}`);
    }
  }

  async getTopHighscores(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).json({ error: "Invalid request" }).end();
      }

      const result = await this.model.getTopHighscores();
      return res.status(200).json(result);
    } catch (err) {
      console.log(`Error getting top highscores: ${err}`);
    }
  }
}
