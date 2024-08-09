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

  async register(id: string, username: string, password: string) {
    try {
      const result = await this.db.run(
        "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
        id,
        username,
        password
      );
      console.log("User registered:", username);
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: err };
    }
  }

  //   async login(username: string) {
  //     try {
  //       const user = await this.findUserByUsername;
  //       const match = await bcrypt.compare(password, user.password);
  //       if (match) {
  //         console.log("User logged-in:", username);
  //         return { success: true };
  //       } else {
  //         return { success: false, error: "Password is not correct" };
  //       }
  //     } catch (err) {
  //       console.error("Login error:", err);
  //       return { success: false, error: err };
  //     }
  //   }

  async findUserByUsername(
    username: string
  ): Promise<{ id: string; username: string; password: string }> {
    const row = await this.db.get(
      "SELECT id, username, password FROM users WHERE username=?",
      username
    );
    return row;
  }
}
