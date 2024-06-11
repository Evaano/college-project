import { AppShell, Avatar, Group, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import React from "react";

import { ToggleButton } from "~/components/ThemeToggle/toggle-button";

export function Layout({ children }: { children: React.ReactNode }) {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell header={{ height: 60, collapsed: !pinned, offset: false }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify={"space-between"}>
          <Avatar src={"https://i.imgur.com/ZgWPCB4.png"} />
          <ToggleButton/>
        </Group>
      </AppShell.Header>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
