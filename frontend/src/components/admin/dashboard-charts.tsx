"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { TimeSeriesPoint } from "@/lib/types";

const COLORS = {
  CREATED: "#64748b", // slate-500
  PICKED_UP: "#3b82f6", // blue-500
  IN_TRANSIT: "#8b5cf6", // violet-500
  ARRIVED_AT_WAREHOUSE: "#eab308", // yellow-500
  OUT_FOR_DELIVERY: "#f97316", // orange-500
  DELIVERED: "#22c55e", // green-500
  FAILED_DELIVERY: "#ef4444", // red-500
  RETURNED: "#71717a", // zinc-500
};

export function ShipmentTrendChart({ data }: { data: TimeSeriesPoint[] }) {
  // Format dates for display
  const chartData = data.map(d => {
    const date = new Date(d.date);
    return {
      ...d,
      displayDate: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Shipment Volume (30 Days)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="displayDate" stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function StatusDistributionChart({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace(/_/g, " "),
      value,
      color: COLORS[key as keyof typeof COLORS] || "#94a3b8",
    }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Shipment Status</h3>
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-[var(--foreground-muted)]">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export function RevenueTrendChart({ data }: { data: TimeSeriesPoint[] }) {
  const chartData = data.map(d => {
    const date = new Date(d.date);
    return {
      ...d,
      displayDate: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Revenue Trend (30 Days)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey="displayDate" stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--foreground-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              cursor={{ fill: "var(--foreground-muted)", opacity: 0.1 }}
            />
            <Bar dataKey="revenue" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
