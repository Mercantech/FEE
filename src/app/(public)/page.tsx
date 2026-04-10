import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vores partnere</h1>
        <p className="mt-2 text-slate-600">
          Virksomheder vi samarbejder med. Log ind for at se elever der søger læreplads eller er
          placeret hos en partner.
        </p>
      </div>

      {companies.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Ingen partnere endnu. Log ind og tilføj under &quot;Redigér partnere&quot;.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{c.name}</h2>
              {c.website ? (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-teal-600 hover:underline"
                >
                  {c.website.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
