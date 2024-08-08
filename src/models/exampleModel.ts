import { Database } from "sqlite";

export class ExampleModel {
  constructor(private db: Database) {}

  async getAllExamples() {
    const rows = await this.db.all("SELECT * FROM examples");
    return rows;
  }

  async createExample(data: { name: string }) {
    const result = await this.db.run("INSERT INTO examples (name) VALUES (?)", [
      data.name,
    ]);
    return result;
  }
}
