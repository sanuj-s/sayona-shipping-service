"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { getUsers } from "@/lib/api/endpoints";
import type { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "name", header: "Name", render: (r: User) => <span className="font-semibold">{r.name}</span> },
    { key: "email", header: "Email" },
    {
      key: "role", header: "Role",
      render: (r: User) => <Badge variant={r.role === "admin" ? "primary" : "default"}>{r.role}</Badge>,
    },
    {
      key: "isActive", header: "Status",
      render: (r: User) => <Badge variant={r.isActive ? "success" : "error"}>{r.isActive ? "Active" : "Inactive"}</Badge>,
    },
    {
      key: "createdAt", header: "Joined",
      render: (r: User) => new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
      <DataTable
        columns={columns}
        data={users}
        total={users.length}
        loading={loading}
      />
    </div>
  );
}
