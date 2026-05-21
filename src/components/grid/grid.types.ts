import type { ReactNode } from "react";

export type GridColumn<T> = {
  key: string;
  header: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (row: T, rowIndex: number) => ReactNode;
  value?: (row: T) => string | number | null | undefined;
  ellipsis?: boolean;
};

export type GridEmptyMode = "initial" | "no-result";

export type GridProps<T> = {
  columns: GridColumn<T>[];
  rows: T[];
  rowKey: (row: T, rowIndex: number) => string;
  onRowClick?: (row: T, rowIndex: number) => void;
  loading?: boolean;
  errorMessage?: string | null;
  emptyMode?: GridEmptyMode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onToggleSelectRow?: (rowKey: string, row: T, checked: boolean) => void;
};
