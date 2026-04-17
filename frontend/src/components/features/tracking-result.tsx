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

import { InteractiveGlobe } from "./interactive-globe";

export function TrackingResultView({ data }: { data: TrackingResult }) {
  const { shipment: s, history } = data;
  const activeIdx = getActiveStageIndex(s.status);

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 items-start">
      
      {/* Primary Data Column */}
      <div className="space-y-6">
        
        {/* Brutalist Header Bento */}
        <div className="glass-3d rounded-[var(--radius-xl)] p-8 relative overflow-hidden group hover-lift shadow-[var(--shadow-elevated)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block opacity-80">Telemetry Identifier</span>
              <h1 className="text-4xl md:text-5xl font-display font-black text-gradient leading-none tracking-tight uppercase">
                {s.trackingNumber}
              </h1>
            </div>
            <div className="md:text-right">
              <StatusBadge status={s.status} size="lg" />
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="flex items-center justify-between mb-2 relative">
            {TRACKING_STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-[var(--duration-slow)] var(--ease-spring)",
                    i < activeIdx
                      ? "bg-success border-success text-white shadow-[var(--shadow-glow-primary)]"
                      : i === activeIdx
                      ? "bg-primary border-primary text-white scale-110 shadow-[var(--shadow-glow-accent)]"
                      : "bg-[var(--surface-elevated)] border-[var(--border-color)] text-[var(--foreground-secondary)]"
                  )}
                >
                  {i < activeIdx ? <CheckCircle className="w-5 h-5" /> : i === activeIdx ? "●" : ""}
                </div>
                <span className={cn(
                  "text-[10px] uppercase font-bold text-center tracking-wider",
                  i <= activeIdx ? "text-[var(--foreground)]" : "text-[var(--foreground-secondary)] opacity-50"
                )}>
                  {stage}
                </span>
              </div>
            ))}
            {/* Architectural Connecting Line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-[var(--border-color)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-success to-primary transition-all duration-[var(--duration-xslow)] ease-out"
                style={{ width: `${(activeIdx / (TRACKING_STAGES.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Bento Specification Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-3d p-5 rounded-[var(--radius-lg)] hover-lift transition-all">
            <ArrowUpRight className="h-6 w-6 text-primary mb-3 opacity-60" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold tracking-wider mb-1">Origin Node</div>
            <div className="text-sm font-bold text-[var(--foreground)] truncate">{s.origin || "—"}</div>
          </div>
          <div className="glass-3d p-5 rounded-[var(--radius-lg)] hover-lift transition-all">
            <ArrowDownLeft className="h-6 w-6 text-primary mb-3 opacity-60" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold tracking-wider mb-1">Dest Node</div>
            <div className="text-sm font-bold text-[var(--foreground)] truncate">{s.destination || "—"}</div>
          </div>
          <div className="glass-3d p-5 rounded-[var(--radius-lg)] hover-lift transition-all">
            <Weight className="h-6 w-6 text-primary mb-3 opacity-60" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold tracking-wider mb-1">Mass Volume</div>
            <div className="text-sm font-bold text-[var(--foreground)]">{s.weight ? `${s.weight} kg` : "—"}</div>
          </div>
          <div className="glass-3d p-5 rounded-[var(--radius-lg)] hover-lift transition-all">
            <Package className="h-6 w-6 text-primary mb-3 opacity-60" />
            <div className="text-[10px] text-[var(--foreground-secondary)] uppercase font-bold tracking-wider mb-1">Classification</div>
            <div className="text-sm font-bold text-[var(--foreground)] capitalize">{s.shippingType || "Standard"}</div>
          </div>
        </div>

        {/* Tactical Timeline */}
        {history && history.length > 0 && (
          <div className="glass-3d p-8 rounded-[var(--radius-xl)]">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-widest text-[12px]">
              <MapPin className="h-5 w-5 text-primary" /> Immutable Log
            </h3>
            <div className="space-y-0">
              {history.map((ev, i) => {
                const d = new Date(ev.timestamp || ev.createdAt);
                
                return (
                  <div key={ev.uuid || i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-[var(--duration-normal)]",
                        i === 0 ? "bg-primary text-white shadow-[var(--shadow-glow-primary)] scale-110" : "bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--foreground-secondary)]"
                      )}>
                        {getStatusIcon(ev.status)}
                      </div>
                      {i < history.length - 1 && (
                        <div className="w-0.5 h-full min-h-[48px] bg-gradient-to-b from-primary/30 to-transparent my-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    
                    <div className={cn("pb-8 pt-1", i === 0 && "font-bold")}>
                      <div className="text-base text-[var(--foreground)] leading-tight">{ev.status}</div>
                      <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)] mt-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 opacity-60" />
                        {ev.location || "Location Coordinates Pending"}
                      </div>
                      {ev.description && (
                        <p className="text-sm text-[var(--foreground-secondary)] mt-2 opacity-80 border-l-[3px] border-primary/20 pl-3">{ev.description}</p>
                      )}
                      <div className="text-[10px] uppercase tracking-widest text-[var(--foreground-secondary)] mt-3 opacity-60 font-mono">
                         {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Spatial WebGL Module */}
      <aside className="sticky top-24 hidden lg:block">
        <div className="glass-3d rounded-[var(--radius-xl)] border-0 p-0 overflow-hidden shadow-[var(--shadow-elevated)] bg-gradient-to-b from-[#060d1d] to-[#040812]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,61,145,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Integrated 3D Interactive WebGL Globe */}
          <div className="relative mix-blend-screen opacity-90 hover:opacity-100 transition-opacity duration-700">
            <InteractiveGlobe />
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-5 glass-3d rounded-[var(--radius-lg)] border border-white/10 backdrop-blur-3xl shadow-[var(--shadow-soft)]">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] mb-1">Target Trajectory</h4>
              <div className="font-display text-2xl leading-tight text-white">{s.destination || "Awaiting Node"}</div>
              <div className="w-full h-1 relative mt-3 bg-white/10 rounded-full overflow-hidden">
                 <div 
                   className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f59e0b] to-[#25D366] transition-all"
                   style={{ width: `${(activeIdx / (TRACKING_STAGES.length - 1)) * 100}%` }}
                  />
              </div>
            </div>
          </div>
        </div>
      </aside>

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
