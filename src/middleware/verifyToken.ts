import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";

export const verifyAccessToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const secretKey = process.env.JWT_SECRET as string;

  if (!accessToken) {
    return res.status(401).send("No token found. Please log-in.");
  }

  // Get payload first to set userId
  const decodedPayload = jwt.decode(accessToken);

  if (decodedPayload && typeof decodedPayload === "object") {
    req.userId = decodedPayload.id;

    // Verify accessToken
    jwt.verify(accessToken, secretKey, (err: any, payload: any) => {
      if (err) {
        if (!req.userId) {
          return res.status(500).json({ error: "User not found" });
        }

        const originalUrl = req.originalUrl;
        return res.redirect(
          307,
          `/auth/refresh?redirect=${encodeURIComponent(originalUrl)}&token=accessToken`
        );
      }
      req.userId = payload.id; // get userId from token payload
      next();
    });
  } else {
    return res.status(401).send("Invalid token. Please log-in.");
  }
};

export const verifyRefreshToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;
  const secretKey = process.env.JWT_SECRET as string;

  jwt.verify(
    refreshToken,
    secretKey,
    { complete: true },
    (err: any, payload: any) => {
      //so the actual id and/or exp is inside another nested payload. So access it like payload.payload.id
      if (err) {
        return res.status(401);
      }

      req.userId = payload.payload.id;

      const expiresAt = payload.payload.exp * 1000; //convert from seconds to milliseconds
      const remainingTime = expiresAt - Date.now(); //because Date.now() is in milliseconds
      if (remainingTime < 86400000) {
        // 86400000 refers to 24 hours in milliseconds
        const originalUrl = req.originalUrl;

        if (!req.userId) {
          return res.status(500).json({ error: "User not found" });
        }

        return res.redirect(
          307,
          `/auth/refresh?redirect=${encodeURIComponent(originalUrl)}&token=refreshToken`
        );
      }
      next();
    }
  );
};
