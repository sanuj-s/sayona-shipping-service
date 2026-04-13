"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateShipmentStatus } from "@/lib/api/endpoints";
import { AlertCircle, CheckCircle } from "lucide-react";

const schema = z.object({
  status: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function UpdateStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setStatus("idle");
      await updateShipmentStatus(id, data);
      setStatus("success");
      setTimeout(() => router.push("/admin/shipments"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (!id) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Card variant="elevated" className="text-center py-10">
          <AlertCircle className="h-12 w-12 text-error mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[var(--foreground)]">No Shipment ID</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Missing shipment ID parameter.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Update Shipment Status</h1>
      <p className="text-sm text-[var(--foreground-secondary)]">Shipment ID: <strong>{id}</strong></p>

      {status === "success" ? (
        <Card variant="elevated" className="text-center py-10">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[var(--foreground)]">Status Updated!</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Redirecting...</p>
        </Card>
      ) : (
        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Select label="New Status" error={errors.status?.message} {...register("status")}>
              <option value="">Select status...</option>
              <option value="Pending">Pending</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="At Port">At Port</option>
              <option value="Arrived at Destination">Arrived at Destination</option>
              <option value="Customs Clearance">Customs Clearance</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </Select>
            <Input label="Location" placeholder="e.g. Mumbai Port" error={errors.location?.message} {...register("location")} />
            <Textarea label="Description (Optional)" placeholder="Details about this status update..." {...register("description")} />

            {status === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Update Status
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
