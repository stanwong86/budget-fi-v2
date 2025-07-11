# Budget API Server

This server provides endpoints for saving and retrieving budget data from Supabase.

## Setup

1. Create a `.env` file in the server directory with the following variables:
```
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_KEY=your_supabase_anon_key_here
PORT=5000
```

2. Create a `budgets` table in your Supabase database with the following structure:
```sql
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
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/budget` - Retrieve the most recent budget
- `POST /api/budget` - Save a new budget

The server will be running on `http://localhost:5000` 