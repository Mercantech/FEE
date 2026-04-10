"use client";

import { signOut } from "next-auth/react";

const authSignOutUrl = "https://auth.mercantec.tech/signout";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
      onClick={async () => {
        const origin = window.location.origin;
        await signOut({ redirect: false });
        window.location.href = `${authSignOutUrl}?returnUrl=${encodeURIComponent(origin + "/")}`;
      }}
    >
      Log ud
    </button>
  );
}
