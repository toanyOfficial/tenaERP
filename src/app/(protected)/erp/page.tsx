import { requireAuthPage } from "@/modules/auth/helpers/auth";

export default async function ProtectedErpPage() {
  const user = await requireAuthPage();

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">대시보드</h2>
        <p className="mt-1 text-sm text-slate-600">{user.name} 님으로 로그인되어 있습니다.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">운영 안내</h3>
        <p className="mt-2 text-sm text-slate-600">
          본 화면은 ERP 기본 레이아웃 기반 샘플입니다. 좌측 메뉴는 고정, 우측 본문은 내부 스크롤 구조입니다.
        </p>
      </div>
    </section>
  );
}
