import type { ReactNode } from "react";

import { Surface } from "@/components/ui";

type AppCardProps = {
  children: ReactNode;
};

export function AppCard({ children }: AppCardProps) {
  return <Surface>{children}</Surface>;
}
