"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";
import Link from "next/link";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("companyName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const domain = formData.get("domain") as string;

    try {
      const response = await apiClient.post("/v1/auth/register-company", {
        companyName,
        email,
        password,
        domain: domain || undefined,
      });

      if (response.success && response.data.accessToken) {
        login(response.data.user, response.data.accessToken, response.data.refreshToken);
        toast.success("Workspace created! Welcome to Sayona Shipping Services.");
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-navy/10 flex items-center justify-center border border-gold/30">
            <Building2 className="h-6 w-6 text-navy" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-navy">
          Create your workspace
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/admin/login" className="font-medium text-gold hover:text-gold/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl border border-slate-200/50 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <div className="mt-1">
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  placeholder="Acme Logistics Inc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="domain">Workspace Domain (Optional)</Label>
              <div className="mt-1">
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="acme.sayonashipping.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Admin Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@acme.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Admin Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Must contain uppercase, lowercase, and numbers"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
