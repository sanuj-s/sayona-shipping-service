"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShipments } from "@/lib/api/endpoints";
import { PlusCircle } from "lucide-react";
import type { Shipment } from "@/lib/types";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getShipments({ page, limit: 10, search });
      setShipments(res.shipments);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shipments");
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: "trackingNumber",
      header: "Tracking #",
      render: (row: Shipment) => (
        <span className="font-semibold text-primary">{row.trackingNumber}</span>
      ),
    },
    { key: "senderName", header: "Sender" },
    { key: "origin", header: "Origin" },
    { key: "destination", header: "Destination" },
    {
      key: "status",
      header: "Status",
      render: (row: Shipment) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row: Shipment) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "actions",
      header: "",
      render: (row: Shipment) => (
        <Link href={`/admin/shipments/${row.uuid}/status`}>
          <Button variant="ghost" size="sm">Update</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Shipments</h1>
        <Link href="/admin/shipments/create">
          <Button variant="primary"><PlusCircle className="h-4 w-4" /> New Shipment</Button>
        </Link>
      </div>

      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}

      <DataTable
        columns={columns}
        data={shipments}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        searchable
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by tracking #, sender, destination..."
        loading={loading}
      />
    </div>
  );
}
