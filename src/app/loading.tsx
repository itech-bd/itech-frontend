export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded-full bg-slate-200" />
      </div>
    </main>
  );
}
