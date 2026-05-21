"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { SitemapNode } from "@/constants/sitemap";
import { SidebarItem } from "@/components/layout/SidebarItem";

function collectOpenKeys(nodes: SitemapNode[], pathname: string): string[] {
  const keys = new Set<string>();

  function walk(node: SitemapNode, parents: string[]) {
    if (node.href === pathname) {
      parents.forEach((key) => keys.add(key));
    }

    for (const child of node.children ?? []) {
      walk(child, [...parents, node.key]);
    }
  }

  for (const node of nodes) {
    walk(node, []);
  }

  return Array.from(keys);
}

export function SidebarMenu({ sitemap }: { sitemap: SitemapNode[] }) {
  const pathname = usePathname();
  const defaultOpen = useMemo(() => collectOpenKeys(sitemap, pathname), [sitemap, pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpen);

  function handleToggle(key: string) {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((value) => value !== key) : [...prev, key]));
  }

  return (
    <nav>
      <ul className="space-y-1">
        {sitemap.map((node) => (
          <SidebarItem
            key={node.key}
            node={node}
            depth={1}
            activePath={pathname}
            openKeys={openKeys}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </nav>
  );
}
