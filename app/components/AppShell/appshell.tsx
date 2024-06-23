import { AppShell, Avatar, Group, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell header={{ height: 70, collapsed: !pinned, offset: false }} padding="md"className="overflow-hidden" >
      <AppShell.Header>
        <Group h="100%" px="md" justify={"space-between"} className="bg-black overflow-hidden">
          <Group >
            <Avatar src={""} />
            <a href="/" style={{ marginLeft: "1rem" }} className="text-white block drop-shadow-md overflow-hidden">Home</a>
            <a href="/events" style={{ marginLeft: "1rem" }} className="text-white overflow-hidden">Events</a>
            <a href="/about" style={{ marginLeft: "1rem" }} className="text-white overflow-hidden">About Us</a>
            <a href="/contact" style={{ marginLeft: "1rem" }} className="text-white overflow-hidden">Contact Us</a>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`} className="overflow-hidden">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
