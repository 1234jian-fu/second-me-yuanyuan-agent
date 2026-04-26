import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { env, hasSupabaseConfig } from "@/config/env";
import type { Database } from "@/types/database";

export const supabase = hasSupabaseConfig
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.",
    );
  }

  return supabase;
}

export async function getCurrentUserId() {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("No active user session.");
  }

  return data.user.id;
}
