import { useEffect, useRef } from "react";
import { GridRow } from "@/components/grid/GridRow";
import type { GridColumn, GridEmptyMode } from "@/components/grid/grid.types";

type Props<T> = {
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

export function GridBody<T>({ columns, rows, rowKey, onRowClick, loading, errorMessage, emptyMode = "initial", onLoadMore, hasMore, selectable, selectedRowKeys = [], onToggleSelectRow }: Props<T>) {
  const sentinelRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onLoadMore();
      });
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, rows.length]);

  if (errorMessage) {
    return <tbody><tr><td className="h-16 px-3 text-xs text-rose-600" colSpan={columns.length + (selectable ? 1 : 0)}>{errorMessage}</td></tr></tbody>;
  }

  if (!loading && rows.length === 0) {
    const message = emptyMode === "no-result" ? "검색 결과가 없습니다." : "표시할 데이터가 없습니다.";
    return <tbody><tr><td className="h-16 px-3 text-xs text-slate-500" colSpan={columns.length + (selectable ? 1 : 0)}>{message}</td></tr></tbody>;
  }

  return (
    <tbody>
      {rows.map((row, index) => {
        const key = rowKey(row, index);
        return (
          <GridRow
            key={key}
            row={row}
            rowIndex={index}
            rowId={key}
            columns={columns}
            onRowClick={onRowClick}
            selectable={selectable}
            selected={selectedRowKeys.includes(key)}
            onToggleSelectRow={onToggleSelectRow}
          />
        );
      })}
      {loading ? <tr><td className="h-10 px-3 text-xs text-slate-500" colSpan={columns.length + (selectable ? 1 : 0)}>로딩 중...</td></tr> : null}
      {hasMore ? <tr ref={sentinelRef}><td className="h-1" colSpan={columns.length + (selectable ? 1 : 0)} /></tr> : null}
    </tbody>
  );
}
