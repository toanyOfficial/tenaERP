import { GridCell } from "@/components/grid/GridCell";
import type { GridColumn } from "@/components/grid/grid.types";

type Props<T> = {
  row: T;
  rowIndex: number;
  rowId: string;
  columns: GridColumn<T>[];
  onRowClick?: (row: T, rowIndex: number) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelectRow?: (rowKey: string, row: T, checked: boolean) => void;
};

export function GridRow<T>({ row, rowIndex, rowId, columns, onRowClick, selectable, selected, onToggleSelectRow }: Props<T>) {
  return (
    <tr
      className="h-9 cursor-pointer border-b border-slate-200 hover:bg-slate-50"
      onClick={() => onRowClick?.(row, rowIndex)}
    >
      {selectable ? (
        <td className="w-10 px-2" onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onToggleSelectRow?.(rowId, row, event.target.checked)}
          />
        </td>
      ) : null}
      {columns.map((column) => {
        const content = column.render ? column.render(row, rowIndex) : (column.value ? column.value(row) : "");
        return (
          <GridCell key={column.key} align={column.align} ellipsis={column.ellipsis ?? true}>
            {content}
          </GridCell>
        );
      })}
    </tr>
  );
}
