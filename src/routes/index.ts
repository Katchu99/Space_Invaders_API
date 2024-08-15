import express from "express";
import authentication from "./authentication";
import highscores from "./highscores";

const router = express.Router();

export default (db: any): express.Router => {
  authentication(router, db);
  highscores(router, db);
  return router;
};
