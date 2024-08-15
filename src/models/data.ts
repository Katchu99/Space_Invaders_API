import { Database } from "sqlite";

export class DataModel {
  constructor(private db: Database) {}

  async setHighscore(userId: string, highscore: number[]) {
    try {
      if (!Array.isArray(highscore)) {
        throw new Error("Highscore must be an array");
      }

      const existingHighscores = await this.db.get(
        "SELECT highscore FROM personalHighscore WHERE user_id = ?",
        userId
      );

      if (existingHighscores) {
        const existingHighscoresArray = JSON.parse(
          existingHighscores.highscore
        );

        // Merge the two arrays and remove duplicates
        const mergedHighscores = [
          ...new Set([...existingHighscoresArray, ...highscore]),
        ];

        await this.db.run(
          "UPDATE personalHighscore SET highscore=? WHERE user_id=?",
          JSON.stringify(mergedHighscores),
          userId
        );
      } else {
        await this.db.run(
          "INSERT INTO personalHighscore (user_id, highscore) VALUES (?, ?)",
          userId,
          JSON.stringify(highscore)
        );
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}
