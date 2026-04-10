import { prisma } from "@/lib/prisma";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "@/app/actions/crud";

export default async function EleverPage() {
  const [students, companies] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ status: "asc" }, { displayName: "asc" }],
      include: { company: true },
    }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Elever</h1>
        <p className="mt-2 text-slate-600">
          Søgende elever og elever placeret hos en partner. Kræver login.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Tilføj elev</h2>
        <form action={createStudent} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="new-displayName" className="block text-sm font-medium text-slate-700">
              Navn
            </label>
            <input
              id="new-displayName"
              name="displayName"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="new-status" className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="new-status"
              name="status"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            >
              <option value="SEEKING">Søger læreplads</option>
              <option value="PLACED">Hos virksomhed</option>
            </select>
          </div>
          <div>
            <label htmlFor="new-companyId" className="block text-sm font-medium text-slate-700">
              Partner (ved placering)
            </label>
            <select
              id="new-companyId"
              name="companyId"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            >
              <option value="">— Vælg —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="new-note" className="block text-sm font-medium text-slate-700">
              Note (valgfri)
            </label>
            <textarea
              id="new-note"
              name="note"
              rows={2}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
            >
              Opret
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800">Alle elever</h2>
        {students.length === 0 ? (
          <p className="mt-4 text-slate-500">Ingen elever endnu.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {students.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <form action={updateStudent} className="space-y-4">
                  <input type="hidden" name="id" value={s.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Navn</label>
                      <input
                        name="displayName"
                        defaultValue={s.displayName}
                        required
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Status</label>
                      <select
                        name="status"
                        defaultValue={s.status}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                      >
                        <option value="SEEKING">Søger læreplads</option>
                        <option value="PLACED">Hos virksomhed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Partner</label>
                      <select
                        name="companyId"
                        defaultValue={s.companyId ?? ""}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                      >
                        <option value="">— Ingen —</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Note</label>
                      <textarea
                        name="note"
                        rows={2}
                        defaultValue={s.note ?? ""}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      Gem
                    </button>
                  </div>
                </form>
                <form action={deleteStudent} className="mt-3 border-t border-slate-100 pt-3">
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Slet elev
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
