import NodeCache from "node-cache";
import fs from "fs";

const myCache = new NodeCache();
const blacklistFilePath = "blacklist.json";

// export async function addTokenToBlacklist(token: string, tokenType: string) {
//   if (tokenType === "accessToken") {
//     var expiration = 1200; //(20 Minutes)
//   } else if (tokenType === "refreshToken") {
//     var expiration = 648000; //(7.5 days)
//   } else {
//     throw new Error("cache.ts: Invalid token type");
//   }

//   await redis.set(token, "blacklisted", "EX", expiration);
// }

// export async function isTokenBlacklisted(token: string) {
//   const result = await redis.get(token);
//   return result !== null;
// }
