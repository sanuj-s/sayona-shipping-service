"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard, Package, PlusCircle, MessageSquare,
  FileText, Users, LogOut, Ship
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/admin/shipments", icon: Package },
  { label: "Create Shipment", href: "/admin/shipments/create", icon: PlusCircle },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 h-screen sticky top-0 bg-secondary text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Ship className="h-7 w-7 text-accent" />
          <div>
            <h2 className="font-bold text-sm leading-tight">Sayona Shipping</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
