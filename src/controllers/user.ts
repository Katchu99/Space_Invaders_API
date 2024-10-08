import { Request, Response } from "express";
import { UserModel } from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { CustomRequest } from "../types/types";
import { addTokenToBlacklist } from "../utils/tokenBlacklist";
import { jwtDecode } from "jwt-decode";

dotenv.config();

export class UserController {
  constructor(private model: UserModel) {}

  /* STATUS CODES:
        200 OK
        201 Created
        307 Temporary Redirect
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

  generateToken = (userId: string, expiration: string) => {
    try {
      const secret = process.env.JWT_SECRET as string;
      return jwt.sign({ id: userId }, secret, { expiresIn: expiration });
    } catch (err) {
      console.log(`Error generating token: ${err}`);
      return null;
    }
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
        const accessToken = this.generateToken(user.id, "15min");
        const refreshToken = this.generateToken(user.id, "23h");
        res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
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

  async refresh(req: CustomRequest, res: Response) {
    try {
      const tokenType = req.query.token;
      const redirectPath = req.query.redirect;
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401);
      }

      //refreshToken
      if (tokenType == "refreshToken") {
        const payload = jwtDecode<JwtPayload>(refreshToken);
        req.userId = payload.id;

        if (!req.userId) {
          return res.status(401).send("Invalid token. Please log-in.");
        }

        const newRefreshToken = this.generateToken(req.userId, "7d");

        if (!newRefreshToken) {
          return res.status(401).send("Could not generate new refreshToken");
        }

        return res
          .status(200)
          .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .redirect(307, String(redirectPath));

        //accessToken
      } else if (tokenType == "accessToken") {
        const payload = jwtDecode<JwtPayload>(refreshToken);
        req.userId = payload.id;

        if (!req.userId) {
          return res.status(401).send("Invalid token. Please log-in.");
        }

        const secret = process.env.JWT_SECRET as string;
        jwt.verify(refreshToken, secret, (err: any, payload: any) => {
          if (err) {
            return res.status(401);
          } else {
            const accessToken = this.generateToken(payload.id, "15min");

            return res
              .cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "strict",
              })
              .redirect(307, String(redirectPath));
          }
        });
      } else {
        return res.status(401);
      }
    } catch (err) {
      return res.status(500).json({ error: `Failed to refresh Token: ${err}` });
    }
  }

  async logout(req: Request, res: Response) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res
        .status(401)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .end();
    }

    const tokensToBlacklist = new Map<string, number>();
    tokensToBlacklist.set(accessToken, 1200); // 20 minutes
    tokensToBlacklist.set(refreshToken, 648000); // 7.5 days
    addTokenToBlacklist(tokensToBlacklist);
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .end();
  }
}
