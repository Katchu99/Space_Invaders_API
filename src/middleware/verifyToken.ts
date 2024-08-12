import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  const secretKey = process.env.JWT_SECRET as string;

  if (!token) {
    return res.status(401).send("No token found. Please log-in.");
  }

  jwt.verify(token, secretKey, (err: any, payload: any) => {
    if (err) {
      const originalUrl = req.originalUrl;
      return res.redirect(
        `/auth/refresh?redirect=${encodeURIComponent(originalUrl)}`
      );
    }
    req.userId = payload.id; // get userId from token payload
    next();
  });
};
