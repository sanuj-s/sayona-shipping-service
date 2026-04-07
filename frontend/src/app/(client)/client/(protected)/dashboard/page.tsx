"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { getShipments } from "@/lib/api/endpoints";
import type { Shipment } from "@/lib/types";
import { Package, MapPin, PlusCircle, ArrowRight } from "lucide-react";

export default function ClientDashboard() {
  const user = useAuthStore((s) => s.user);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShipments({ limit: 5 })
      .then((res) => setShipments(res.shipments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Welcome back, {user?.name?.split(" ")[0] || "Client"}
        </h1>
        <p className="text-[var(--foreground-secondary)] mt-1">Here&apos;s an overview of your shipments.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/client/track">
          <Card variant="elevated" className="hover:border-primary/30 transition-colors cursor-pointer flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--foreground)]">Track a Shipment</h3>
              <p className="text-sm text-[var(--foreground-secondary)]">Enter tracking ID to get real-time updates</p>
            </div>
          </Card>
        </Link>
        <Link href="/contact#quote">
          <Card variant="elevated" className="hover:border-accent/30 transition-colors cursor-pointer flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--foreground)]">Request a Quote</h3>
              <p className="text-sm text-[var(--foreground-secondary)]">Get competitive rates for your cargo</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Shipments</h2>
          <Link href="/client/shipments">
            <Button variant="ghost" size="sm">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-shimmer" />
            ))}
          </div>
        ) : shipments.length === 0 ? (
          <Card variant="bordered" className="text-center py-10">
            <Package className="h-10 w-10 text-[var(--foreground-secondary)] mx-auto mb-3" />
            <p className="text-[var(--foreground-secondary)]">No shipments yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {shipments.map((s) => (
              <Link key={s.id} href={`/client/track?id=${s.trackingNumber}`}>
                <Card variant="elevated" className="flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-primary text-sm">{s.trackingNumber}</h3>
                    <p className="text-xs text-[var(--foreground-secondary)]">{s.origin} → {s.destination}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
