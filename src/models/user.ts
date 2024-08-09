import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Database } from "sqlite";

//User Database Operations
export class UserModel {
  constructor(private db: Database) {}

  async check_if_exists(username: string) {
    const row = await this.db.get(
      "SELECT username FROM users WHERE username=?",
      username
    );

    if (row === undefined) {
      return false;
    } else {
      return true;
    }
  }

  async register(username: string, password: string) {
    const id = uuidv4();
    const hashed_password = await bcrypt.hash(password, 10);

    try {
      const result = await this.db.run(
        "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
        id,
        username,
        hashed_password
      );
      console.log("User registered:", result);
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: err };
    }
  }

  async login(username: string, password: string) {
    const hashed_password = await this.db.get(
      "SELECT password FROM users WHERE username=?",
      username
    );
    const match = await bcrypt.compare(password, hashed_password);
    if (match) {
      return { success: true };
    } else {
      return { success: false, error: "Password is not correct" };
    }
  }
}
