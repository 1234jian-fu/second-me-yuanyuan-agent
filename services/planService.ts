import { getCurrentUserId, getSupabaseClient } from "@/services/supabaseClient";
import type { JsonValue } from "@/types/database";
import type { Plan, PlanDraft, PlanStatus } from "@/types/plans";
import { todayIsoDate } from "@/utils/date";

export type CreatePlanInput = PlanDraft & {
  planDate?: string;
  source?: "manual" | "ai";
  priority?: number | null;
  sortOrder?: number | null;
  metadata?: JsonValue | null;
};

function mapPlan(row: {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  plan_date: string;
  status: PlanStatus;
  source: "manual" | "ai";
  created_at: string;
  updated_at: string;
}): Plan {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    planDate: row.plan_date,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const planService = {
  async create(input: CreatePlanInput): Promise<Plan> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("plans")
      .insert({
        user_id: userId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        plan_date: input.planDate ?? todayIsoDate(),
        status: "todo",
        source: input.source ?? "manual",
        priority: input.priority ?? null,
        sort_order: input.sortOrder ?? null,
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapPlan(data);
  },

  async createMany(plans: CreatePlanInput[]): Promise<Plan[]> {
    if (plans.length === 0) {
      return [];
    }

    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("plans")
      .insert(
        plans.map((plan, index) => ({
          user_id: userId,
          title: plan.title.trim(),
          description: plan.description?.trim() || null,
          plan_date: plan.planDate ?? todayIsoDate(),
          status: "todo" as const,
          source: plan.source ?? "ai",
          priority: plan.priority ?? null,
          sort_order: plan.sortOrder ?? index,
          metadata: plan.metadata ?? null,
        })),
      )
      .select();

    if (error) {
      throw error;
    }

    return data.map(mapPlan);
  },

  async listToday(): Promise<Plan[]> {
    return this.listByDate(todayIsoDate());
  },

  async listByDate(planDate: string): Promise<Plan[]> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("user_id", userId)
      .eq("plan_date", planDate)
      .neq("status", "archived")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(mapPlan);
  },

  async setDone(id: string, done: boolean): Promise<Plan> {
    return this.updateStatus(id, done ? "done" : "todo");
  },

  async updateStatus(id: string, status: PlanStatus): Promise<Plan> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("plans")
      .update({ status })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapPlan(data);
  },
};
