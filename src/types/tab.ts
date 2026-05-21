export type TabType = "work" | "bookmark";

export type ERPTab = {
  key: string;
  label: string;
  href: string;
  type: TabType;
};

export type TabState = {
  workTabs: ERPTab[];
  bookmarkTabs: ERPTab[];
  activeKey: string | null;
  showLimitModal: boolean;
};
