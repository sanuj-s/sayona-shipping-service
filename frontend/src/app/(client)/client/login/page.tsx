"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { login } from "@/lib/api/endpoints";
import { AlertCircle, Ship } from "lucide-react";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

export default function ClientLoginPage() {
  const router = useRouter();
  const authLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const res = await login(data);
      authLogin(res.user, res.accessToken, res.refreshToken);
      router.push("/client/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-5">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <Ship className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Client Portal</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">Sign in to manage your shipments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />

          <div className="text-right">
            <Link href="/client/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/client/register" className="text-primary font-semibold hover:underline">Register</Link>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to website</Link>
        </div>
      </Card>
    </div>
  );
}
