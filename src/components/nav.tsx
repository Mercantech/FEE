import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export async function Nav() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-teal-700">
          FindEnElev
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Partnere
          </Link>
          {session ? (
            <>
              <Link href="/elever" className="text-slate-600 hover:text-slate-900">
                Elever
              </Link>
              <Link href="/partnere" className="text-slate-600 hover:text-slate-900">
                Redigér partnere
              </Link>
              <span className="hidden text-slate-500 sm:inline">
                {session.user?.name ?? session.user?.email ?? "Bruger"}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/api/auth/signin/mercantec"
              className="rounded-md bg-teal-600 px-3 py-1.5 font-medium text-white hover:bg-teal-700"
            >
              Log ind
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
