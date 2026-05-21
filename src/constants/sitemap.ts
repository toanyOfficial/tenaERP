export type SitemapNode = {
  key: string;
  label: string;
  href?: string;
  children?: SitemapNode[];
};

export const SITEMAP: SitemapNode[] = [
  {
    key: "management",
    label: "관리정보",
    children: [
      { key: "employee", label: "인원관리", href: "/erp/employee" },
      { key: "account", label: "계정관리", href: "/erp/account" },
      {
        key: "auth",
        label: "권한관리",
        children: [{ key: "auth-policy", label: "권한정책", href: "/erp/auth/policy" }],
      },
    ],
  },
  {
    key: "profit-loss",
    label: "손익관리",
    children: [{ key: "pl-main", label: "손익관리", href: "/erp/profit-loss" }],
  },
  {
    key: "finance",
    label: "재무관리",
    children: [
      { key: "sales", label: "매출내역", href: "/erp/sales" },
      { key: "expense", label: "지출내역", href: "/erp/expense" },
      { key: "bank", label: "계좌관리", href: "/erp/bank-account" },
    ],
  },
];
