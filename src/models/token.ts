import { Database } from "sqlite";

//Token Database Operations
export class TokenModel {
  constructor(private db: Database) {}

  async addToken(token: string, expiration: number) {
    await this.db.run(
      "INSERT INTO tokenBlacklist (token, expirationTime) VALUES (?, ?)",
      token,
      expiration
    );
  }

  async deleteToken(token: string) {
    await this.db.run("DELETE FROM tokenBlacklist WHERE token=?", token);
  }

  async getTokens() {
    return await this.db.all("SELECT * FROM tokenBlacklist");
  }

  async setTokens(tokens: Map<string, number>) {
    const existingToken = await this.getTokens();
    tokens.forEach(async (token, expiration) => {
      if (existingToken.map((eToken) => eToken.token).includes(token)) {
        await this.db.run(
          "UPDATE tokenBlacklist SET expiration = ? WHERE token = ?",
          expiration,
          token
        );
      } else {
        await this.db.run(
          "INSERT INTO tokenBlacklist (token, expirationTime) VALUES (?, ?)",
          token,
          expiration
        );
      }
    });
  }
}
