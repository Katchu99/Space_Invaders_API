import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/types";
import { isTokenBlacklisted } from "../utils/tokenBlacklist";
// import { isTokenBlacklisted } from "../utils/cache";

export const verifyAccessToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).send("Invalid token. Please log-in.");
  }

  isTokenBlacklisted(accessToken).then((blacklisted) => {
    if (blacklisted) {
      return res.status(401).send("Invalid token. Please log-in.");
    }

    verifyToken(req, res, next);
  });

  function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const secretKey = process.env.JWT_SECRET as string;

    // Verify accessToken
    jwt.verify(accessToken, secretKey, (err: any, payload: any) => {
      if (err) {
        const originalUrl = req.originalUrl;
        return res.redirect(
          307,
          `/auth/refresh?redirect=${encodeURIComponent(originalUrl)}&token=accessToken`
        );
      }

      req.userId = payload.id; // get userId from token payload

      if (!req.userId) {
        // Every Token created by this API will have the userId in the payload
        return res.status(401).send("Invalid token. Please log-in.");
      }

      next();
    });
  }
};

export const verifyRefreshToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("Invalid token. Please log-in.");
  }

  isTokenBlacklisted(refreshToken).then((blacklisted) => {
    if (blacklisted) {
      return res.status(401).send("Invalid token. Please log-in.");
    }

    verifyToken(req, res, next);
  });

  function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const secretKey = process.env.JWT_SECRET as string;

    jwt.verify(
      refreshToken,
      secretKey,
      { complete: true },
      (err: any, payload: any) => {
        //so the actual id and/or exp is inside another nested payload. So access it like payload.payload.id
        if (err) {
          return res.status(401).send("Invalid token. Please log-in.");
        }

        req.userId = payload.payload.id;

        if (!req.userId) {
          return res.status(401).send("Invalid token. Please log-in.");
        }

        const expiresAt = payload.payload.exp * 1000; //convert from seconds to milliseconds
        const remainingTime = expiresAt - Date.now(); //because Date.now() returns in milliseconds
        if (remainingTime < 86400000) {
          // 86400000 refers to 24 hours in milliseconds
          const originalUrl = req.originalUrl;

          return res.redirect(
            307,
            `/auth/refresh?redirect=${encodeURIComponent(originalUrl)}&token=refreshToken`
          );
        }
        next();
      }
    );
  }
};
