import type { ReactNode } from "react";

import { PageContainer } from "@/components/PageContainer";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  return <PageContainer scroll={scroll}>{children}</PageContainer>;
}
