"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getCarriers } from "@/lib/api/endpoints";
import type { Carrier } from "@/lib/types";

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getCarriers({ page, limit: 10 });
      setCarriers(res?.data ?? []);
      setTotal(res?.meta?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load carriers");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: "name", header: "Name", render: (row: Carrier) => <span className="font-semibold text-[var(--foreground)]">{row.name}</span> },
    { key: "serviceType", header: "Service Type" },
    { key: "contact", header: "Contact" },
    {
      key: "createdAt",
      header: "Added On",
      render: (row: Carrier) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <Button variant="ghost" size="sm" onClick={() => alert("Edit modal placeholder")}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Carriers</h1>
        <Button variant="primary" onClick={() => alert("Create modal placeholder")}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Carrier
        </Button>
      </div>

      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}

      <DataTable
        columns={columns}
        data={carriers}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
