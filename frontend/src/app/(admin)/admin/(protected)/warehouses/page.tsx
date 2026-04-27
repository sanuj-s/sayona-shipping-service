"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getWarehouses } from "@/lib/api/endpoints";
import type { Warehouse } from "@/lib/types";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getWarehouses({ page, limit: 10 });
      setWarehouses(res?.data ?? []);
      setTotal(res?.meta?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load warehouses");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: "name", header: "Name", render: (row: Warehouse) => <span className="font-semibold text-[var(--foreground)]">{row.name}</span> },
    { key: "location", header: "Location" },
    { key: "capacity", header: "Capacity" },
    {
      key: "createdAt",
      header: "Added On",
      render: (row: Warehouse) =>
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
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Warehouses</h1>
        <Button variant="primary" onClick={() => alert("Create modal placeholder")}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Warehouse
        </Button>
      </div>

      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}

      <DataTable
        columns={columns}
        data={warehouses}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
