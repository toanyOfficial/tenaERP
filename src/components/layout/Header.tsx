"use client";

export function Header() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-sm font-semibold text-slate-900">ERP Workspace</h1>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">운영 모드</span>
        <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => void handleLogout()}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
