import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  const secretKey = process.env.JWT_SECRET as string;

  if (!token) {
    return res.status(401).send("No token found. Please log-in.");
  }

  jwt.verify(token, secretKey, (err: any, payload: any) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.userId = payload.id;
    next();
  });
};
