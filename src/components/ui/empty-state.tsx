import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center", className)}>
      <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    </div>
  );
}
