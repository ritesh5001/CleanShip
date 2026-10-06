import Image from "next/image";
import { company } from "@/content/company";

export function Logo({ onNavy = false, className = "h-9 w-auto sm:h-10", priority = false }: { onNavy?: boolean; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/cleanship-logo.webp"
      alt={`${company.legalName} logo`}
      width={950}
      height={250}
      priority={priority}
      className={className}
      style={onNavy ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
