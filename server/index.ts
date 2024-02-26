import express from 'express';
import cors from "cors";
import { Request, Response } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT ? process.env.PORT : 3000}`);
})