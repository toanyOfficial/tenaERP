"use client";

import Link from "next/link";
import type { DepthItem } from "@/types/depth";

type BreadcrumbProps = {
  items: DepthItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-600">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? <Link href={item.href}>{item.label}</Link> : <span className={isLast ? "font-semibold text-slate-900" : ""}>{item.label}</span>}
            {!isLast ? <span className="text-slate-400">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
