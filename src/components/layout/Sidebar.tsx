const MENU_GROUPS = [
  {
    title: "기준정보",
    items: ["인원관리", "근로계약", "계정관리"],
  },
  {
    title: "재무",
    items: ["매출내역", "지출내역", "계좌관리"],
  },
  {
    title: "운영",
    items: ["배치로그", "권한관리"],
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">tenaERP</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-5">
          {MENU_GROUPS.map((group) => (
            <section key={group.title}>
              <p className="mb-2 px-2 text-xs font-semibold text-slate-500">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </aside>
  );
}
