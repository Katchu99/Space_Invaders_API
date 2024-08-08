import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", (req: Request, res: Response) => {

});

app.post("/register", (req: Request, res: Response) => {
  const data = req.body;
})

app.post("/setHighscore", (req: Request, res: Response) => {

});

app.get("/getHighscore", (req: Request, res: Response) => {

})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
