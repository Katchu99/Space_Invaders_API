import { Request, Response } from "express";
import { UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

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
        return res.status(409).json({ error: "username already taken" }).end();
      }

      const id = uuidv4();
      const hashed_password = await bcrypt.hash(password, 10);
      const result = await this.model.register(id, username, hashed_password);

      if (result.success) {
        res.status(201).end();
      } else {
        res.status(400).json({ error: result.error }).end();
      }
    } catch (err) {
      res
        .status(500)
        .json({ error: `Failed to register user: ${err}` })
        .end();
    }
  }

  generateToken = (userId: string) => {
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign({ id: userId }, secret, { expiresIn: "14d" });
  };

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const exists = await this.model.check_if_exists(username);

      if (!exists) {
        return res.status(404).json({ error: "User does not exist" });
      }

      const user = await this.model.getUserByUsername(username);
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = this.generateToken(user.id);
        res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
          })
          .end();
      } else {
        res.status(401).json({ error: "Password incorrect" }).end();
      }

      // res
      //   .status(match ? 200 : 401)
      //   .json(match ? {} : { error: "Password is not correct" });
    } catch (err) {
      res
        .status(500)
        .json({ error: `Failed to log in ${err}` })
        .end();
    }
  }
}
