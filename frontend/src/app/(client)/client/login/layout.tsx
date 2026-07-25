import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Login – Sayona Shipping Services",
  description:
    "Sign in to the Sayona Shipping client portal to track shipments, manage bookings, and access real-time logistics updates.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
