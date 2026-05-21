import type { GridColumn } from "@/components/grid/grid.types";

type Props<T> = {
  columns: GridColumn<T>[];
  selectable?: boolean;
};

export function GridHeader<T>({ columns, selectable }: Props<T>) {
  return (
    <thead className="sticky top-0 z-10 bg-slate-100">
      <tr className="h-9 border-b border-slate-300">
        {selectable ? <th className="w-10 px-2" /> : null}
        {columns.map((column) => (
          <th
            key={column.key}
            className="px-3 text-left text-[11px] font-semibold text-slate-600"
            style={column.width ? { width: column.width } : undefined}
          >
            <div className="truncate whitespace-nowrap">{column.header}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
