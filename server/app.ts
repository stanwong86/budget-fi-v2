import express from "express"
import cors from "cors"
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.post("/api/data", (req: Request, res: Response) => {
  const data = req.body
  res.json({ message: "Data received", data })
})

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

app.get('/', (req, res) => {
  res.send('Supabase + Express Backend (TS)');
});

app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default app

