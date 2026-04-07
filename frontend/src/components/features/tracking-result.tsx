"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TRACKING_STAGES } from "@/lib/utils/constants";
import type { TrackingResult } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, ArrowDownLeft, Weight, Package,
  MapPin, CheckCircle, Ship, Anchor,
  ClipboardList, Truck, FileText
} from "lucide-react";

function getStatusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return <CheckCircle className="h-4 w-4" />;
  if (s.includes("transit") || s.includes("shipped")) return <Ship className="h-4 w-4" />;
  if (s.includes("arrived") || s.includes("port")) return <Anchor className="h-4 w-4" />;
  if (s.includes("picked")) return <Package className="h-4 w-4" />;
  if (s.includes("customs") || s.includes("clearance")) return <ClipboardList className="h-4 w-4" />;
  if (s.includes("out for")) return <Truck className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

function getActiveStageIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return 4;
  if (s.includes("out for") || s.includes("delivery")) return 3;
  if (s.includes("transit") || s.includes("port") || s.includes("arrived")) return 2;
  if (s.includes("picked")) return 1;
  return 0;
}

export function TrackingResultView({ data }: { data: TrackingResult }) {
  const { shipment: s, history } = data;
  const activeIdx = getActiveStageIndex(s.status);

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <StatusBadge status={s.status} size="lg" />
          <div className="text-right">
            <span className="text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider">Tracking ID</span>
            <span className="block text-base font-bold text-[var(--foreground)]">{s.trackingNumber}</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-6 relative">
          {TRACKING_STAGES.map((stage, i) => (
            <div key={stage} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  i < activeIdx
                    ? "bg-success border-success text-white"
                    : i === activeIdx
                    ? "bg-primary border-primary text-white scale-110"
                    : "bg-[var(--background-alt)] border-[var(--border-color)] text-[var(--foreground-secondary)]"
                )}
              >
                {i < activeIdx ? "✓" : i === activeIdx ? "●" : ""}
              </div>
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight",
                i <= activeIdx ? "text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"
              )}>
                {stage}
              </span>
            </div>
          ))}
          {/* Connector lines */}
          <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-[var(--border-color)]">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${(activeIdx / (TRACKING_STAGES.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card padding="sm" className="text-center">
            <ArrowUpRight className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold">From</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{s.origin || "—"}</div>
          </Card>
          <Card padding="sm" className="text-center">
            <ArrowDownLeft className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold">To</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{s.destination || "—"}</div>
          </Card>
          <Card padding="sm" className="text-center">
            <Weight className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold">Weight</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{s.weight ? `${s.weight} kg` : "—"}</div>
          </Card>
          <Card padding="sm" className="text-center">
            <Package className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold">Type</div>
            <div className="text-sm font-semibold text-[var(--foreground)] capitalize">{s.shippingType || "Standard"}</div>
          </Card>
        </div>
      </Card>

      {/* Timeline */}
      {history && history.length > 0 && (
        <Card variant="elevated">
          <h3 className="text-base font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Tracking Timeline
          </h3>
          <div className="space-y-0">
            {history.map((ev, i) => {
              const d = new Date(ev.timestamp || ev.createdAt);
              const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
              const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={ev.id || i} className="flex gap-4">
                  {/* Marker */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      i === 0 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    )}>
                      {getStatusIcon(ev.status)}
                    </div>
                    {i < history.length - 1 && (
                      <div className="w-px h-full min-h-[40px] bg-[var(--border-color)]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("pb-6", i === 0 && "font-semibold")}>
                    <div className="text-sm text-[var(--foreground)]">{ev.status}</div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {ev.location || "Location Pending"}
                    </div>
                    {ev.description && (
                      <p className="text-xs text-[var(--foreground-secondary)] mt-1">{ev.description}</p>
                    )}
                    <div className="text-xs text-[var(--foreground-secondary)] mt-1 opacity-70">
                      {dateStr} • {timeStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export function TrackingError({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <Card variant="elevated" className="py-10">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Shipment Not Found</h3>
        <p className="text-sm text-[var(--foreground-secondary)] mb-6">
          {message || "No shipment found with this tracking number. Please check and try again."}
        </p>
        <Link href="/contact">
          <Button variant="outline" size="sm">Contact Support</Button>
        </Link>
      </Card>
    </div>
  );
}

export function TrackingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <Card variant="elevated">
        <div className="flex justify-between mb-6">
          <Skeleton width={100} height={28} variant="rectangular" />
          <Skeleton width={150} height={20} />
        </div>
        <div className="flex justify-between mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton width={60} height={10} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" height={80} />
          ))}
        </div>
      </Card>
    </div>
  );
}
