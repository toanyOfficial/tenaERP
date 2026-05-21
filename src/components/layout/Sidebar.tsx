import { SITEMAP } from "@/constants/sitemap";
import { SidebarMenu } from "@/components/layout/SidebarMenu";

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">tenaERP</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <SidebarMenu sitemap={SITEMAP} />
      </div>
    </aside>
  );
}
