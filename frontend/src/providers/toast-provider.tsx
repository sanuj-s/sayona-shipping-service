"use client";

import { Toaster as Sonner } from "sonner";

export function ToastProvider() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:bg-[var(--surface)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:border-[var(--border-color)] group-[.toaster]:shadow-[var(--shadow-elevated)]",
          description: "group-[.toast]:text-[var(--foreground-secondary)]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--background-alt)] group-[.toast]:text-[var(--foreground-secondary)]",
        },
      }}
    />
  );
}
