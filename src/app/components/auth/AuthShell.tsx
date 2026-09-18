"use client";

import { useEffect, type ReactNode } from "react";
import BrandLogo from "@/app/components/BrandLogo";

export function AuthShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" && t.tagName !== "SELECT") return;
      window.setTimeout(() => {
        t.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 250);
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] items-start justify-center overflow-y-auto bg-[var(--balanx-bg)] px-4 py-10 md:items-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(245,158,11,0.08),_transparent_45%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo size="lg" priority />
        </div>
        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="balanx-glass balanx-glow-cyan rounded-2xl p-6 sm:p-8">
      {children}
    </div>
  );
}
