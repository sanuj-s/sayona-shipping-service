"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/api/endpoints";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof schema>;

export default function ClientProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      company: user?.company || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      setError("");
      setSuccess(false);
      const updatedUser = await updateProfile({
        name: data.name,
        company: data.company,
        phone: data.phone,
      });
      updateUser(updatedUser);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Profile</h1>

      <Card variant="elevated">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-color)]">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{user.name}</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">{user.email}</p>
            <Badge variant="primary" size="sm" className="mt-1 capitalize">{user.role}</Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email (Read Only)" value={user.email} readOnly disabled />
          
          <Input 
            label="Full Name" 
            error={errors.name?.message} 
            {...register("name")} 
          />
          <Input 
            label="Company" 
            error={errors.company?.message} 
            {...register("company")} 
          />
          <Input 
            label="Phone" 
            type="tel"
            error={errors.phone?.message} 
            {...register("phone")} 
          />

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success-light text-success text-sm">
              <CheckCircle className="h-4 w-4 shrink-0" /> Profile updated successfully
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border-color)]">
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
