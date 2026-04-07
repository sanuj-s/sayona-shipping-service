"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function AdminHeader() {
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 bg-[var(--surface)] border-b border-[var(--border-color)] px-6 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-lg font-bold text-[var(--foreground)]">Admin Panel</h1>
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
        <button className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="w-px h-8 bg-[var(--border-color)]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-[var(--foreground-secondary)]">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
