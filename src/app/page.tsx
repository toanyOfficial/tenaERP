export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <p className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          tenaERP Foundation
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">ERP 초기 세팅 완료</h1>
        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
          이 화면은 신규 ERP 프로젝트의 최소 실행 가능한 시작점입니다.
          <br />
          App Router + TypeScript + TailwindCSS + ESLint + Bun 환경으로 구성되었습니다.
        </p>
      </section>
    </main>
  );
}
