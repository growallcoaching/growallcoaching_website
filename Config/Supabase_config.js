// config/supabase_config.js

// 1. Yahan apne Supabase project ka URL aur anon Key paste karein
// Apne Supabase Dashboard > Project Settings > API me jaakar ye details mil jayengi
const supabaseUrl = 'https://snyfsuraxaiegvroqpli.supabase.co'; // Apna URL yahan dalein
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueWZzdXJheGFpZWd2cm9xcGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTI4MDgsImV4cCI6MjA5OTY2ODgwOH0.GY4FE_qz7tTWViRvkiKw-naKEyYBRFDaM92mH_lj0Nk';       // Apni Anon Key yahan dalein

// 2. Supabase Client ko initialize karke globally expose karna
// Taaki hamari Course_Card_Script.js isko access kar sake
if (typeof window !== 'undefined') {
    // Check karna ki Supabase JS library load hui hai ya nahi
    if (window.supabase) {
        window.supabaseUrl = supabaseUrl;
        window.supabaseKey = supabaseKey;
        // Optional: Agar aap direct client bhi globally chahte hain
        window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log("Supabase configured successfully!");
    } else {
        console.error("Supabase JS library is not loaded. Please check your HTML <script> tags.");
    }
}