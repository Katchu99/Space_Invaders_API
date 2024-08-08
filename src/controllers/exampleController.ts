import { Request, Response } from "express";
import { ExampleModel } from "../models/exampleModel";

export class ExampleController {
  constructor(private model: ExampleModel) {}

  async getExamples(req: Request, res: Response) {
    try {
      const examples = await this.model.getAllExamples();
      res.json(examples);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch examples" });
    }
  }

  async createExample(req: Request, res: Response) {
    try {
      const newExample = await this.model.createExample(req.body);
      res.status(201).json(newExample);
    } catch (err) {
      res.status(500).json({ error: "Failed to create example" });
    }
  }
}
