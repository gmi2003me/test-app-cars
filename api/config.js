// api/config.js
// This Vercel serverless function reads environment variables server-side
// and provides them to the client-side script.

export default function handler(request, response) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Serverless Function Error: SUPABASE_URL or SUPABASE_ANON_KEY environment variables are not set.");
    return response.status(500).json({
      error: 'Server configuration error. Required environment variables are missing.'
    });
  }

  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
} 