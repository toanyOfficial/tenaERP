"use client";

import { GridHeader } from "@/components/grid/GridHeader";
import { GridBody } from "@/components/grid/GridBody";
import type { GridProps } from "@/components/grid/grid.types";

export function Grid<T>(props: GridProps<T>) {
  return (
    <div className="h-full min-h-0 overflow-auto rounded-md border border-slate-300 bg-white">
      <table className="w-full table-fixed border-collapse">
        <GridHeader columns={props.columns} selectable={props.selectable} />
        <GridBody {...props} />
      </table>
    </div>
  );
}
