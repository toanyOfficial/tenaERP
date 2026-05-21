export type DepthItem = {
  label: string;
  href?: string;
};

export type DepthState = {
  items: DepthItem[];
  current: DepthItem | null;
};
