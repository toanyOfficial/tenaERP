import { requireAuthPage } from "@/modules/auth/helpers/auth";

export default async function ProtectedErpPage() {
  const user = await requireAuthPage();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold">ERP Protected Page</h1>
      <p className="mt-2 text-slate-700">{user.name} 님으로 로그인되었습니다.</p>
    </main>
  );
}
