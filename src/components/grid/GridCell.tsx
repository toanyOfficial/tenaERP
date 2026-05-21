import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
};

export function GridCell({ children, align = "left", ellipsis = true }: Props) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <td className={`h-9 px-3 text-xs text-slate-800 ${alignClass}`}>
      <div className={ellipsis ? "truncate whitespace-nowrap" : "whitespace-nowrap"}>{children}</div>
    </td>
  );
}
