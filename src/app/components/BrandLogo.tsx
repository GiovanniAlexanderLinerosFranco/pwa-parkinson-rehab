"use client";

import Image from "next/image";
import { brand } from "@/lib/brand";

type Props = {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
};

const sizes = {
  sm: { width: 120, height: 120, className: "h-16 w-auto" },
  md: { width: 200, height: 200, className: "h-24 w-auto" },
  lg: { width: 320, height: 320, className: "h-36 w-auto md:h-44" },
  hero: { width: 480, height: 480, className: "h-44 w-auto md:h-56" },
};

export default function BrandLogo({ className = "", priority = false, size = "md" }: Props) {
  const s = sizes[size];
  return (
    <Image
      src={brand.logoSrc}
      alt={`${brand.name} — ${brand.taglineOfficial}`}
      width={s.width}
      height={s.height}
      priority={priority}
      className={`${s.className} object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.25)] ${className}`}
    />
  );
}
