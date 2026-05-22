"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [employeeNo, setEmployeeNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          router.replace("/erp");
        }
      }
    })();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeNo: employeeNo.trim(), password }),
      });

      const json = await res.json();
      if (!res.ok || (!json?.user && !json?.success)) {
        setErrorMessage("사번 또는 비밀번호를 확인해주세요.");
        return;
      }

      router.replace("/erp");
    } catch {
      setErrorMessage("사번 또는 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-sm rounded border border-slate-200 bg-white p-5">
        <h1 className="text-lg font-semibold">ERP Login</h1>
        <form className="mt-4 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label htmlFor="employeeNo" className="mb-1 block text-xs text-slate-700">사번</label>
            <input
              id="employeeNo"
              type="text"
              className="h-9 w-full rounded border border-slate-300 px-2 text-sm"
              value={employeeNo}
              onChange={(e) => setEmployeeNo(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs text-slate-700">비밀번호</label>
            <input
              id="password"
              type="password"
              className="h-9 w-full rounded border border-slate-300 px-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {errorMessage ? <p className="text-xs text-rose-600">{errorMessage}</p> : null}
          <button
            type="submit"
            className="h-9 w-full rounded bg-slate-900 text-sm font-medium text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}
