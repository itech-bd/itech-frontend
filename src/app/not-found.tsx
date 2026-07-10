import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you requested does not exist or has moved.</p>
        <Link href="/en" className="mt-6 inline-flex rounded-2xl bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-extrabold text-white">
          Go home
        </Link>
      </div>
    </main>
  );
}
