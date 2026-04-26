import { useCallback, useState } from "react";

import { type CreatePlanInput, planService } from "@/services/planService";
import type { Plan } from "@/types/plans";
import { getErrorMessage } from "@/utils/errors";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadToday = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const todayPlans = await planService.listToday();
      setPlans(todayPlans);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (input: CreatePlanInput) => {
    const created = await planService.create(input);
    setPlans((current) => [...current, created]);
    return created;
  }, []);

  const createPlans = useCallback(async (inputs: CreatePlanInput[]) => {
    const created = await planService.createMany(inputs);
    setPlans((current) => [...current, ...created]);
    return created;
  }, []);

  const toggleDone = useCallback(async (id: string, done: boolean) => {
    const updated = await planService.setDone(id, done);
    setPlans((current) => current.map((plan) => (plan.id === id ? updated : plan)));
    return updated;
  }, []);

  return {
    plans,
    isLoading,
    error,
    setPlans,
    loadToday,
    createPlan,
    createPlans,
    toggleDone,
  };
}
