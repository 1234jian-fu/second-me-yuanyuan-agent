export type PlanStatus = "todo" | "done" | "archived";

export type PlanDraft = {
  title: string;
  description?: string | null;
};

export type Plan = PlanDraft & {
  id: string;
  userId: string;
  planDate: string;
  status: PlanStatus;
  source: "manual" | "ai";
  createdAt: string;
  updatedAt: string;
};
