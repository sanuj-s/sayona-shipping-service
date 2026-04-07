"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-mobile-cta)] lg:hidden bg-[var(--surface)] border-t border-[var(--border-color)] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 safe-area-pb">
      <Link href="/contact#quote" className="block">
        <Button variant="primary" className="w-full justify-center">
          Get a Free Quote
        </Button>
      </Link>
    </div>
  );
}
