import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rcwzrukrhbonsbamqdma.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjd3pydWtyaGJvbnNiYW1xZG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNTQ5NTAsImV4cCI6MjA0NDYzMDk1MH0.Mpq-c0Rquu8pEgeQCEfhOJlWrSFj-nPuuTam9ghpf_s";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
