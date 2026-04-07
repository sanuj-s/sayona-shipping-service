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
import { register as registerApi } from "@/lib/api/endpoints";
import { AlertCircle, Ship } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, "Min 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof schema>;

export default function ClientRegisterPage() {
  const router = useRouter();
  const authLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState("");

  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("");
      const res = await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
        company: data.company,
        phone: data.phone,
      });
      authLogin(res.user, res.token);
      router.push("/client/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-5">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <Ship className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">Register to track and manage shipments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...reg("name")} />
          <Input label="Email" type="email" error={errors.email?.message} {...reg("email")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company" {...reg("company")} />
            <Input label="Phone" type="tel" {...reg("phone")} />
          </div>
          <Input label="Password" type="password" error={errors.password?.message} {...reg("password")} />
          <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...reg("confirmPassword")} />

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
          Already have an account?{" "}
          <Link href="/client/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  );
}
