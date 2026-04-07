"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ship, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // API call would go here
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-5">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <Ship className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Reset Password</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <p className="font-semibold text-[var(--foreground)]">Check your email!</p>
            <p className="text-sm text-[var(--foreground-secondary)] mt-1">
              We&apos;ve sent password reset instructions to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <Button type="submit" variant="primary" className="w-full">Send Reset Link</Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/client/login" className="text-sm text-primary hover:underline">← Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
