"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { getContacts } from "@/lib/api/endpoints";
import type { Contact } from "@/lib/types";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getContacts({ page, limit: 10 });
      setContacts(res.contacts);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: "name", header: "Name", render: (r: Contact) => <span className="font-semibold">{r.name}</span> },
    { key: "email", header: "Email" },
    { key: "company", header: "Company", render: (r: Contact) => r.company || "—" },
    { key: "industry", header: "Industry", render: (r: Contact) => r.industry || "—" },
    {
      key: "status", header: "Status",
      render: (r: Contact) => (
        <Badge variant={r.status === "new" ? "info" : r.status === "contacted" ? "warning" : "success"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "createdAt", header: "Date",
      render: (r: Contact) => new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Contacts</h1>
      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}
      <DataTable
        columns={columns}
        data={contacts}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
