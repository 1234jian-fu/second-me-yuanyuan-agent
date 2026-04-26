import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/services/supabaseClient";
import type { AppUser } from "@/types/auth";

function toAppUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email,
    displayName:
      typeof user.user_metadata.display_name === "string"
        ? user.user_metadata.display_name
        : null,
  };
}

export const authService = {
  async getCurrentUser(): Promise<AppUser | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user ? toAppUser(data.user) : null;
  },

  async signInAnonymously(): Promise<AppUser> {
    const supabase = getSupabaseClient();
    const existing = await this.getCurrentUser();

    if (existing) {
      await this.ensureUserProfile(existing.id);
      return existing;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Anonymous sign-in did not return a user.");
    }

    await this.ensureUserProfile(data.user.id);
    return toAppUser(data.user);
  },

  async signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  async ensureUserProfile(userId: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("users").upsert(
      {
        id: userId,
      },
      { onConflict: "id" },
    );

    if (error) {
      throw error;
    }
  },
};
