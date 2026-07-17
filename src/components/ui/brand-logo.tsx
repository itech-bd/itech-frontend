import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveBrandLogoUrl } from "@/lib/media";

export function BrandLogo({
  logoUrl,
  compact = false,
  className,
}: {
  logoUrl?: string | null;
  compact?: boolean;
  className?: string;
}) {
  const src = resolveBrandLogoUrl(logoUrl);

  if (src) {
    return (
      <span className={cn("relative block", compact ? "h-10 w-36" : "h-12 w-44", className)}>
        <Image
          src={src}
          alt="iTechBD Ltd"
          fill
          sizes={compact ? "144px" : "176px"}
          className="object-contain object-left"
          priority={compact}
          unoptimized
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--brand-primary)] text-white shadow-[var(--shadow-card)]">
        <GraduationCap aria-hidden className="h-5 w-5" />
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-base font-black text-[color:var(--text-heading)]">iTechBD Ltd</span>
          <span className="block text-xs font-semibold text-[color:var(--text-muted)]">Training Institute</span>
        </span>
      ) : null}
    </span>
  );
}
