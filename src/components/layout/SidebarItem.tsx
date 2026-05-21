"use client";

import Link from "next/link";
import type { SitemapNode } from "@/constants/sitemap";

type SidebarItemProps = {
  node: SitemapNode;
  depth: 1 | 2 | 3;
  activePath: string;
  openKeys: string[];
  onToggle: (key: string) => void;
};

function isNodeActive(node: SitemapNode, activePath: string): boolean {
  if (node.href && activePath === node.href) {
    return true;
  }

  return (node.children ?? []).some((child) => isNodeActive(child, activePath));
}

export function SidebarItem({ node, depth, activePath, openKeys, onToggle }: SidebarItemProps) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = openKeys.includes(node.key);
  const isActive = isNodeActive(node, activePath);
  const paddingClass = depth === 1 ? "pl-2" : depth === 2 ? "pl-5" : "pl-8";

  return (
    <li>
      <div className={`flex items-center gap-2 rounded-md ${paddingClass} pr-2 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700"}`}>
        {hasChildren ? (
          <button type="button" onClick={() => onToggle(node.key)} className="w-full text-left">
            <span className="inline-block w-4">{isOpen ? "▾" : "▸"}</span>
            {node.label}
          </button>
        ) : node.href ? (
          <Link href={node.href} className="w-full">
            <span className="inline-block w-4">•</span>
            {node.label}
          </Link>
        ) : (
          <span>{node.label}</span>
        )}
      </div>

      {hasChildren && isOpen && depth < 3 ? (
        <ul className="space-y-1 mt-1">
          {node.children!.map((child) => (
            <SidebarItem
              key={child.key}
              node={child}
              depth={(depth + 1) as 1 | 2 | 3}
              activePath={activePath}
              openKeys={openKeys}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
