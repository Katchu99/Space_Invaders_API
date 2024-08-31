import { Database } from "sqlite";

export class DataModel {
  constructor(private db: Database) {}

  async setHighscore(userId: string, highscore: number[]) {
    // TODO: Check if highscore is higher than anyone in the top50,
    //       if so, update the topHighscores table
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

  async getPersonalHighscore(userId: string) {
    try {
      const result = await this.db.all(
        "SELECT highscore FROM personalHighscore WHERE user_id = ?",
        userId
      );

      const highscores: number[] = result.map((row) => row.highscore);
      console.log(highscores);
      return highscores;
    } catch (err) {
      console.log(`Error getting highscore: ${err}`);
    }
  }

  async getTopHighscores() {
    try {
      const result = await this.db.all(
        "SELECT user_id, highscore FROM topHighscores ORDER BY highscore DESC LIMIT 50"
      );

      const topHighscores: { userId: string; highscore: number }[] = result.map(
        (row) => ({
          userId: row.user_id,
          highscore: row.highscore,
        })
      );

      console.log(topHighscores);
      return topHighscores;
    } catch (err) {}
  }
}
