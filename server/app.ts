import express, { Request, Response } from "express"
import cors from "cors"
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config()

// Budget interface matching the client structure
interface Budget {
  housing: string;
  utilities: string;
  groceries: string;
  transportation: string;
  insurance: string;
  healthcare: string;
  childcare: string;
  debt: string;
  phone_internet: string;
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

// Budget endpoints
app.get('/api/budget', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch budget data' });
    }

    // Return the most recent budget or empty object if none exists
    const budget = data && data.length > 0 ? data[0] : {};
    return res.json(budget);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/budget', async (req: Request, res: Response) => {
  try {
    const budgetData: Budget = req.body;

    // Validate that all required fields are present
    const requiredFields = [
      'housing', 'utilities', 'groceries', 'transportation', 
      'insurance', 'healthcare', 'childcare', 'debt', 'phone_internet'
    ];

    for (const field of requiredFields) {
      if (!(field in budgetData)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Insert the budget data into Supabase
    const { data, error } = await supabase
      .from('budgets')
      .insert([budgetData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save budget data' });
    }

    return res.json({ message: 'Budget saved successfully', data: data[0] });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/api/data", (req: Request, res: Response) => {
  const data = req.body
  res.json({ message: "Data received", data })
})

app.get('/', (req, res) => {
  res.send('Supabase + Express Backend (TS)');
});

app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default app

