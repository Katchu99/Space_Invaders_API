import { Router } from "express";
import { ExampleController } from "../controllers/exampleController";
import { ExampleModel } from "../models/exampleModel";
import { initDb } from "../database/db";

const router = Router();

const setupRoutes = async () => {
  const db = await initDb();
  const model = new ExampleModel(db);
  const controller = new ExampleController(model);

  router.get("/examples", (req, res) => controller.getExamples(req, res));
  router.post("/examples", (req, res) => controller.createExample(req, res));
};

setupRoutes();

export default router;
