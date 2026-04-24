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

export default function AdminLoginPage() {
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
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/80 p-5">
      <Card variant="default" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <Ship className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Login</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">Sign in to Sayona Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@sayonashipping.me" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <div>
            <Link href="/register-company" className="text-sm font-medium text-primary hover:underline">
              Create a new workspace
            </Link>
          </div>
          <div>
            <Link href="/" className="text-sm text-[var(--foreground-secondary)] hover:underline">
              ← Back to website
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
