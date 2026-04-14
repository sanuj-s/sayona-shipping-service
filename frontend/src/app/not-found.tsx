import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Ship, Home, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)]">
      <Container className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-6">
          <Ship className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-6xl font-extrabold text-[var(--foreground)] mb-3">404</h1>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
          This route doesn&apos;t exist
        </h2>
        <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">
          Looks like this shipment went off-course. The page you&apos;re looking for has been moved, removed, or never existed.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4" /> Contact Us
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
