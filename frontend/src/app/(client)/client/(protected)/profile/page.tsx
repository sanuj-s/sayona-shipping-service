"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default function ClientProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Profile</h1>

      <Card variant="elevated">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-color)]">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{user?.name}</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">{user?.email}</p>
            <Badge variant="primary" size="sm" className="mt-1 capitalize">{user?.role}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <Input label="Full Name" value={user?.name || ""} readOnly />
          <Input label="Email" value={user?.email || ""} readOnly />
          <Input label="Company" value={user?.company || "—"} readOnly />
          <Input label="Phone" value={user?.phone || "—"} readOnly />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--foreground-secondary)]">
            To update your profile, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
}
