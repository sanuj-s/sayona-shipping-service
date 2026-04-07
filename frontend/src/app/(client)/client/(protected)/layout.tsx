"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { Ship, Package, MapPin, User, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const clientNav = [
  { label: "Dashboard", href: "/client/dashboard", icon: Package },
  { label: "My Shipments", href: "/client/shipments", icon: Search },
  { label: "Track", href: "/client/track", icon: MapPin },
  { label: "Profile", href: "/client/profile", icon: User },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/client/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border-color)] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-16">
          <Link href="/client/dashboard" className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-primary" />
            <span className="font-bold text-[var(--foreground)]">Client Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {clientNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-[var(--foreground-secondary)] hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)] hidden sm:block">{user?.name}</span>
            <button
              onClick={() => { logout(); router.push("/client/login"); }}
              className="p-2 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
