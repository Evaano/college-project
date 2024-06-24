import { AppShell, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import React from "react";

import { HeaderTabs } from "~/components/Header/header";

export function Layout({ children }: { children: React.ReactNode }) {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell header={{ height: 90, collapsed: !pinned, offset: false }} padding="md" className="overflow-hidden">
      <AppShell.Header>
        <HeaderTabs />
      </AppShell.Header>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`} className="overflow-hidden">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
