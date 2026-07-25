import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password – Sayona Shipping Services",
  description:
    "Reset your Sayona Shipping client portal password. Enter your email to receive a secure password reset link.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
