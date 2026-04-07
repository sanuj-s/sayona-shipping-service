"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { LOCATIONS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { Building2, PlaneTakeoff, Factory, MapPin } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Building2, PlaneTakeoff, Factory,
};

export function LocationsGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {LOCATIONS.map((loc, i) => (
        <LocationCard key={loc.name} location={loc} index={i} />
      ))}
    </div>
  );
}

function LocationCard({
  location,
  index,
}: {
  location: (typeof LOCATIONS)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();
  const Icon = iconMap[location.icon] || Building2;

  return (
    <Card
      ref={ref}
      variant="elevated"
      className={cn(
        "text-center transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">
        {location.name}
        {location.isHQ && (
          <Badge variant="accent" size="sm" className="ml-2 align-middle">
            HQ
          </Badge>
        )}
      </h3>
      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-3">
        {location.description}
      </p>
      <p className="text-xs text-[var(--foreground-secondary)] flex items-center justify-center gap-1">
        <MapPin className="h-3 w-3" /> {location.region}
      </p>
    </Card>
  );
}
