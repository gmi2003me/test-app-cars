# Simple Automobile CRUD App (HTML/JS + Supabase)

This is a basic web application for managing automobile records (Year, Make, Model, Color) using HTML, CSS, JavaScript, and Supabase for the database.

## Features

- Create new automobile records.
- Read (view) a list of existing automobile records.
- Update existing automobile records.
- Delete automobile records.

## Setup

### 1. Supabase Project

- If you don't have one, create a new project on [Supabase](https://supabase.com/).
- Find your Project URL and `anon` public key:
    - Go to your project's dashboard.
    - Navigate to **Project Settings** (the gear icon).
    - Go to the **API** section.
    - You'll find the **Project URL** and the **Project API keys** (`anon` public key).

### 2. Create Supabase Table

- Go to the **SQL Editor** in your Supabase project dashboard.
- Click **+ New query**.
- Run the following SQL commands to create the `automobiles`, `makes`, and `colors` tables, and populate the lookup tables:

```sql
-- Makes Table
CREATE TABLE public.makes (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.makes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for makes" ON public.makes FOR SELECT USING (true);

-- Colors Table
CREATE TABLE public.colors (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for colors" ON public.colors FOR SELECT USING (true);

-- Automobiles Table (references makes/colors by name for simplicity)
CREATE TABLE public.automobiles (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  year text,
  make text,
  model text,
  color text
);

-- IMPORTANT: Enable Row Level Security (RLS)
ALTER TABLE public.automobiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON public.automobiles
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (example - adapt to your needs)
-- If you require users to be logged in, set up Supabase Auth first.
-- For simple public access (less secure, use with caution):
CREATE POLICY "Allow public insert access" ON public.automobiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.automobiles
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON public.automobiles
  FOR DELETE USING (true);

-- Populate Makes Table (Top 20 US Brands)
INSERT INTO public.makes (name) VALUES
('Ford'), ('Toyota'), ('Chevrolet'), ('Honda'), ('Nissan'),
('Jeep'), ('Ram'), ('GMC'), ('Hyundai'), ('Kia'),
('Subaru'), ('Volkswagen'), ('BMW'), ('Mercedes-Benz'), ('Lexus'),
('Mazda'), ('Audi'), ('Dodge'), ('Chrysler'), ('Tesla');

-- Populate Colors Table (Top 20 Colors)
INSERT INTO public.colors (name) VALUES
('White'), ('Black'), ('Gray'), ('Silver'), ('Red'),
('Blue'), ('Brown'), ('Green'), ('Beige'), ('Orange'),
('Gold'), ('Yellow'), ('Purple'), ('Teal'), ('Pink'),
('Burgundy'), ('Charcoal'), ('Cream'), ('Tan'), ('Navy');

-- Optional: Grant usage on schema and sequence if needed (usually default)
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- Grant permissions for the new tables/sequences
-- GRANT ALL ON TABLE public.makes TO anon, authenticated;
-- GRANT ALL ON SEQUENCE public.makes_id_seq TO anon, authenticated;
-- GRANT ALL ON TABLE public.colors TO anon, authenticated;
-- GRANT ALL ON SEQUENCE public.colors_id_seq TO anon, authenticated;
-- GRANT ALL ON SEQUENCE public.automobiles_id_seq TO anon, authenticated;
```

**Important:** The RLS policies above grant full public access for simplicity. **Review and adjust these policies based on your actual security requirements.** For any real application, you would likely want more restrictive policies, often tied to user authentication (e.g., `auth.uid() = user_id`).

### 3. Vercel Deployment

- Create a new project on [Vercel](https://vercel.com/) and connect it to your Git repository (GitHub, GitLab, Bitbucket) containing the `index.html` file.
- Configure Environment Variables:
    - In your Vercel project settings, go to **Settings** -> **Environment Variables**.
    - Add two variables:
        - `SUPABASE_URL`: Set its value to your Supabase Project URL.
        - `SUPABASE_ANON_KEY`: Set its value to your Supabase `anon` public key.
    - **Crucially**, for these variables to be accessible in the client-side JavaScript of a static HTML file deployment, Vercel needs to expose them. Check Vercel's documentation on exposing environment variables to the browser. Often, prefixing them like `NEXT_PUBLIC_SUPABASE_URL` is required for frameworks like Next.js, but for plain HTML, Vercel might handle specific names or require a different approach (e.g., using a serverless function to provide them, or checking if Vercel automatically injects them for certain standard names). If `process.env.SUPABASE_URL` doesn't work directly in the deployed `index.html`, you might need to adjust how the variables are named in Vercel or how they are accessed in the script.
- Deploy your project.

### 4. Local Testing (Optional)

- Clone the repository.
- Open the `index.html` file in your browser.
- **For Supabase connection:**
    - **Option A (Insecure - Recommended only for quick local tests):** Temporarily replace the placeholder values for `SUPABASE_URL` and `SUPABASE_ANON_KEY` directly in the `<script>` section of `index.html`.
      ```javascript
      const SUPABASE_URL = 'YOUR_ACTUAL_SUPABASE_URL';
      const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
      ```
      **Remember to remove these hardcoded keys before committing or deploying!**
    - **Option B (Better):** Use a simple local server that can inject environment variables (e.g., using Node.js with `dotenv`, or a simple Python server reading from a `.env` file). This is beyond the scope of a simple HTML file but is a more robust local development approach.

## How it Works

- The `index.html` file contains all the necessary code:
    - **HTML:** Defines the structure (form for input, table for display).
    - **CSS:** Basic styling for layout and appearance within `<style>` tags.
    - **JavaScript:**
        - Includes the Supabase client library via CDN.
        - Fetches car Makes and Colors from their respective Supabase tables to populate dropdowns.
        - Initializes the Supabase client using the environment variables.
        - Contains functions (`loadAutomobiles`, `addAutomobile`, `updateAutomobile`, `deleteAutomobile`) to interact with the Supabase `automobiles` table.
        - Handles form submissions and button clicks to trigger CRUD operations.
        - Updates the UI dynamically based on data from Supabase. # test-app-cars
