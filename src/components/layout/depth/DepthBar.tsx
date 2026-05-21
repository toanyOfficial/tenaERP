"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/layout/depth/Breadcrumb";
import type { DepthItem } from "@/types/depth";

const DEPTH_MAP: Array<{ prefix: string; items: DepthItem[] }> = [
  { prefix: "/erp/employee", items: [{ label: "대시보드", href: "/erp" }, { label: "관리정보", href: "/erp/account" }, { label: "인원관리" }] },
  { prefix: "/erp/account", items: [{ label: "대시보드", href: "/erp" }, { label: "관리정보", href: "/erp/account" }, { label: "계정관리" }] },
  { prefix: "/erp/auth/policy", items: [{ label: "대시보드", href: "/erp" }, { label: "관리정보", href: "/erp/account" }, { label: "권한정책" }] },
  { prefix: "/erp/profit-loss", items: [{ label: "대시보드", href: "/erp" }, { label: "손익관리", href: "/erp/profit-loss" }, { label: "손익관리" }] },
  { prefix: "/erp/sales", items: [{ label: "대시보드", href: "/erp" }, { label: "재무관리", href: "/erp/sales" }, { label: "매출내역" }] },
  { prefix: "/erp/expense", items: [{ label: "대시보드", href: "/erp" }, { label: "재무관리", href: "/erp/sales" }, { label: "지출내역" }] },
  { prefix: "/erp/bank-account", items: [{ label: "대시보드", href: "/erp" }, { label: "재무관리", href: "/erp/sales" }, { label: "계좌관리" }] },
  { prefix: "/erp", items: [{ label: "대시보드" }] },
];

export function DepthBar() {
  const pathname = usePathname();

  const items = useMemo(() => {
    const found = DEPTH_MAP.find((entry) => pathname.startsWith(entry.prefix));
    return found?.items ?? [{ label: "대시보드" }];
  }, [pathname]);

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-2">
      <Breadcrumb items={items} />
    </div>
  );
}
