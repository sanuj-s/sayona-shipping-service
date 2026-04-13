"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/api/endpoints";
import { Package, FileText, TrendingUp, CheckCircle } from "lucide-react";
import type { DashboardStats, Shipment } from "@/lib/types";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard statistics"))
      .finally(() => setLoading(false));
  }, []);

  const shipmentColumns = [
    {
      key: "trackingNumber",
      header: "Tracking #",
      render: (row: Shipment) => (
        <Link href={`/admin/shipments/update-status?id=${row.uuid}`} className="font-semibold text-primary hover:underline">
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
      header: "Created",
      render: (row: Shipment) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Shipments"
          value={loading ? "..." : stats?.totalShipments || 0}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Active"
          value={loading ? "..." : stats?.activeShipments || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="12% this month"
          trendUp
        />
        <StatCard
          title="Delivered"
          value={loading ? "..." : stats?.deliveredShipments || 0}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Quotes"
          value={loading ? "..." : stats?.pendingQuotes || 0}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {/* Recent Shipments */}
      <div>
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Recent Shipments</h2>
        <DataTable
          columns={shipmentColumns}
          data={stats?.recentShipments || []}
          total={stats?.recentShipments?.length || 0}
          loading={loading}
        />
      </div>
    </div>
  );
}
