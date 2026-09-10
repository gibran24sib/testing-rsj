/**
 * SUPABASE CLIENT UTILS WRAPPER (src/utils/supabase.js)
 * Standar integrasi Supabase yang aman (HANYA ANON KEY / PUBLISHABLE KEY)
 */
export {
  supabase,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SUPABASE_KEY,
  isSupabaseConfigured,
  ambilDataSupabase,
  tambahDataSupabase,
  updateDataSupabase,
  hapusDataSupabase,
  ambilCutiSupabase,
  tambahCutiSupabase,
  updateStatusCutiSupabase,
  registerUserSupabase,
  loginUserSupabase,
  logoutUserSupabase,
  getCurrentUserSupabase,
  getUserProfileSupabase,
} from "../services/supabaseClient";

export default supabase;
