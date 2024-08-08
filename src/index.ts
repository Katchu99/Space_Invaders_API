import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/login", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.post("/data", (req: Request, res: Response) => {
  const data = req.body;
  res.json({ received: data });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
