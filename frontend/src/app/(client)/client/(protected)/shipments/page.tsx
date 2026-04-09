"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { getShipments } from "@/lib/api/endpoints";
import type { Shipment } from "@/lib/types";

export default function ClientShipmentsPage() {
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
      setError(err instanceof Error ? err.message : "Failed to load your shipments");
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: "trackingNumber",
      header: "Tracking #",
      render: (row: Shipment) => (
        <Link href={`/client/track?id=${row.trackingNumber}`} className="font-semibold text-primary hover:underline">
          {row.trackingNumber}
        </Link>
      ),
    },
    { key: "origin", header: "Origin" },
    { key: "destination", header: "Destination" },
    {
      key: "status",
      header: "Status",
      render: (row: Shipment) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row: Shipment) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">My Shipments</h1>
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
        searchPlaceholder="Search shipments..."
        loading={loading}
      />
    </div>
  );
}
