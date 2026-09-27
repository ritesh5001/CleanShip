import Link from "next/link";

/** Header shared by the blog admin screens. */
export function AdminBar({ current }: { current: "enquiries" | "blog" }) {
  const link = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`text-[13px] font-medium ${active ? "text-ink-900" : "text-blue-700 hover:underline"}`}
    >
      {label}
    </Link>
  );
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-baseline gap-4">
          <span className="text-[15px] font-bold text-slate-900">Cleanship admin</span>
          {link("/admin", "Enquiries", current === "enquiries")}
          {link("/admin/blog", "Blog", current === "blog")}
          {link("/cleantrack/admin", "CleanTrack →", false)}
        </div>
        <form action="/cleantrack/logout" method="post">
          <button
            type="submit"
            className="rounded-none px-3 py-2 text-[14px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
