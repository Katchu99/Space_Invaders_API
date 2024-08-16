import NodeCache from "node-cache";
import { TokenModel } from "../models/token";
import { Database, Statement } from "sqlite3";
import { title } from "process";

const blacklistCache = new NodeCache({ checkperiod: 300 });

export async function addTokenToBlacklist(tokens: Map<string, number>) {
  const success = await Promise.all(
    Array.from(tokens.entries()).map(([token, expiration]) =>
      blacklistCache.set(token, "blacklisted", expiration)
    )
  );

  return success.every((result) => result);
}

export function isTokenBlacklisted(token: string): Promise<boolean> {
  return new Promise((resolve) => {
    const result = blacklistCache.get(token);
    resolve(result === "blacklisted");
  });
}

export async function loadBlacklistFromDb(db: any) {
  const tokenModel = new TokenModel(db);
  const tokens = await tokenModel.getTokens();

  tokens.forEach((token) => {
    blacklistCache.set(token.token, "blacklisted", token.expiration);
  });

  //expired Event Listener
  blacklistCache.on("expired", (key, value) => {
    tokenModel.deleteToken(key);
    blacklistCache.del(key);
  });
}

export async function saveBlacklistToDb(db: any) {
  const tokenModel = new TokenModel(db);
  const keys = blacklistCache.keys();
  const tokens = new Map<string, number>();

  keys.forEach((token) => {
    const ttl = blacklistCache.getTtl(token);

    if (!ttl) {
      throw new Error("Invalid TTL for token: " + token);
    }

    tokens.set(token, ttl);
  });

  tokenModel.setTokens(tokens);
}
