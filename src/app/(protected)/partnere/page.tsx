import { prisma } from "@/lib/prisma";
import { createCompany, deleteCompany } from "@/app/actions/crud";

export default async function PartnereAdminPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { students: true } } },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Redigér partnere</h1>
        <p className="mt-2 text-slate-600">
          Tilføj eller fjern virksomheder der vises på forsiden (offentlig liste).
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Ny partner</h2>
        <form action={createCompany} className="mt-4 grid gap-4 sm:max-w-lg">
          <div>
            <label htmlFor="co-name" className="block text-sm font-medium text-slate-700">
              Navn
            </label>
            <input
              id="co-name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="co-website" className="block text-sm font-medium text-slate-700">
              Website (valgfri)
            </label>
            <input
              id="co-website"
              name="website"
              placeholder="example.dk"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="w-fit rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
          >
            Opret partner
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800">Eksisterende partnere</h2>
        {companies.length === 0 ? (
          <p className="mt-4 text-slate-500">Ingen partnere endnu.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {companies.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{c.name}</p>
                  {c.website ? (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:underline"
                    >
                      {c.website}
                    </a>
                  ) : null}
                  <p className="text-sm text-slate-500">
                    {c._count.students} elev
                    {c._count.students === 1 ? "" : "er"} knyttet
                  </p>
                </div>
                <form action={deleteCompany}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Slet (sætter elever fri)
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
