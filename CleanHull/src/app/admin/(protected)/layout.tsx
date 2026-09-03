"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError, type AdminUser } from "@/lib/api";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get<{ user: AdminUser }>("/api/auth/me")
      .then(({ user }) => {
        if (!cancelled) setUser(user);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 401) {
          router.replace("/admin/login");
        }
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await api.post("/api/auth/logout").catch(() => {});
    router.replace("/admin/login");
  }

  if (!checked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-slate-500">
        Checking session…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between border-b border-line-200 pb-5">
        <div>
          <h1 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
            Operations desk
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Signed in as {user.name} · {user.role}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="label-caps border border-line-200 px-4 py-2 text-[12px] text-ink-700 transition-colors duration-[140ms] hover:border-blue-400 hover:text-blue-600"
        >
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}
