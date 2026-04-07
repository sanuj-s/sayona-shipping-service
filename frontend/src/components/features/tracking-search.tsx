"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TrackingSearchProps {
  onSearch: (id: string) => void;
  isLoading?: boolean;
}

export function TrackingSearch({ onSearch, isLoading }: TrackingSearchProps) {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setTrackingId(urlId);
      onSearch(urlId);
    } else {
      const lastId = localStorage.getItem("lastTrackingId");
      if (lastId) setTrackingId(lastId);
    }
  }, [searchParams, onSearch]);

  const handleSubmit = () => {
    const id = trackingId.trim().toUpperCase();
    if (!id) return;
    localStorage.setItem("lastTrackingId", id);
    onSearch(id);
  };

  return (
    <div className="flex gap-3 max-w-xl mx-auto">
      <Input
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        placeholder="Enter Tracking ID (e.g., SYSN123456)"
        size="lg"
        icon={<Search className="h-4 w-4" />}
        className="flex-1"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Button
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        loading={isLoading}
      >
        Track
      </Button>
    </div>
  );
}
