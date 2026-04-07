"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { getQuotes } from "@/lib/api/endpoints";
import type { Quote } from "@/lib/types";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuotes({ page, limit: 10 });
      setQuotes(res.quotes);
      setTotal(res.total);
    } catch { /* handle */ }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: "cargo", header: "Cargo", render: (r: Quote) => <span className="font-semibold">{r.cargo}</span> },
    { key: "origin", header: "Origin" },
    { key: "destination", header: "Destination" },
    { key: "email", header: "Email" },
    {
      key: "status", header: "Status",
      render: (r: Quote) => {
        const v = r.status === "pending" ? "warning" : r.status === "quoted" ? "info" : r.status === "accepted" ? "success" : "error";
        return <Badge variant={v}>{r.status}</Badge>;
      },
    },
    {
      key: "createdAt", header: "Date",
      render: (r: Quote) => new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Quotes</h1>
      <DataTable
        columns={columns}
        data={quotes}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
