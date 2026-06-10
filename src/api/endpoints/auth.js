import { supabase } from "../client";

export const authApi = {
  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
};
