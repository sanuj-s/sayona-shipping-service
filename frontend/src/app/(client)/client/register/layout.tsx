import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account – Sayona Shipping Services",
  description:
    "Register for a free Sayona Shipping client account to book shipments, get instant freight quotes, and track cargo in real time.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
