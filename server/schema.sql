-- Create budgets table for storing budget data
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  housing TEXT,
  utilities TEXT,
  groceries TEXT,
  transportation TEXT,
  insurance TEXT,
  healthcare TEXT,
  childcare TEXT,
  debt TEXT,
  phone_internet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- CREATE POLICY "Allow all operations" ON budgets FOR ALL USING (true); 