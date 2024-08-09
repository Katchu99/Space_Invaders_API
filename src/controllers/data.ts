// import { Request, Response } from "express";
// import { DataModel } from "../models/user";

// export class DataController {
//   constructor(private model: DataModel) {}

//   async check_if_exists(req: Request, res: Response) {
//     try {
//       const exists = await this.model.check_if_exists(req.body.username);
//       res.json(examples);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch examples" });
//     }
//   }

//   async createExample(req: Request, res: Response) {
//     try {
//       const newExample = await this.model.createExample(req.body);
//       res.status(201).json(newExample);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to create example" });
//     }
//   }
// }
