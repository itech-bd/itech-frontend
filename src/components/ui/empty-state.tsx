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
    <div className={cn("rounded-lg border border-dashed border-[color:var(--border-default)] bg-white p-8 text-center", className)}>
      <h3 className="text-lg font-black text-[color:var(--text-heading)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-body)]">{message}</p>
    </div>
  );
}
