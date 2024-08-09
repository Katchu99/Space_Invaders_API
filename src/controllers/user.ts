import { Request, Response } from "express";
import { UserModel } from "../models/user";

export class UserController {
  constructor(private model: UserModel) {}

  /* STATUS CODES:
        200 OK
        201 Created
        400 Bad Request
        401 Unauthorized
        404 Not Found
        409 Conflict
        500 Internal Server Error
  */

  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const exists = await this.model.check_if_exists(username);

      if (exists) {
        res.status(409).json({ error: "username already taken" });
      }

      const result = await this.model.register(username, password);
      if (result.success) {
        res.status(201);
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (err) {
      res.status(500).json({ error: `Failed to register user: ${err}` });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const exists = await this.model.check_if_exists(username);

      if (!exists) {
        return res.status(404).json({ error: "User does not exist" });
      }

      const result = await this.model.login(username, password);

      if (result.success) {
        res.status(200);
      } else {
        res.status(401).json({ error: result.error });
      }
    } catch (err) {
      res.status(500).json({ error: `Failed to log in ${err}` });
    }
  }
}
