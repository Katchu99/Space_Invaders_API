import { Request, Response } from "express";
import { DataModel } from "../models/data";

export class DataController {
  constructor(private model: DataModel) {}

  async setHighscore(req: Request, res: Response) {}
}
