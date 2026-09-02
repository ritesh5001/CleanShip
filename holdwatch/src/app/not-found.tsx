import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
          This job does not exist, the link has been revoked, or it belongs to
          another account.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Go to Hold Watch
        </Link>
      </div>
    </main>
  );
}
