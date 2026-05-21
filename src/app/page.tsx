import { APP_DESCRIPTION, APP_NAME } from "@/constants";
import { AUTH_MODULE, EMPLOYEE_MODULE, ACCOUNT_MODULE, PROFIT_LOSS_MODULE } from "@/modules";
import { COMMON_COMPONENT_SCOPE } from "@/components";

const moduleList = [AUTH_MODULE, EMPLOYEE_MODULE, ACCOUNT_MODULE, PROFIT_LOSS_MODULE];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <p className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {APP_NAME} Foundation
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">ERP 초기 세팅 완료</h1>
        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">{APP_DESCRIPTION}</p>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
          <p className="mb-2 text-sm font-semibold text-slate-800">Enabled Modules</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            {moduleList.map((moduleName) => (
              <li key={moduleName}>{moduleName}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Shared components scope: {COMMON_COMPONENT_SCOPE}</p>
        </div>
      </section>
    </main>
  );
}
