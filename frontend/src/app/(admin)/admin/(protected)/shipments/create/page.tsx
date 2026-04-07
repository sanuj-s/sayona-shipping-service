"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import type { ShippingType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createShipment } from "@/lib/api/endpoints";
import { AlertCircle, CheckCircle } from "lucide-react";

const schema = z.object({
  senderName: z.string().min(1, "Required"),
  senderEmail: z.string().email("Valid email required"),
  senderPhone: z.string().optional(),
  receiverName: z.string().min(1, "Required"),
  receiverEmail: z.string().email("Valid email required"),
  receiverPhone: z.string().optional(),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  weight: z.string().optional(),
  cargoType: z.string().optional(),
  shippingType: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateShipmentPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shippingType: "ocean_fcl" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setStatus("idle");
      await createShipment({
        ...data,
        shippingType: data.shippingType as ShippingType,
        weight: data.weight ? parseFloat(data.weight) : undefined,
      });
      setStatus("success");
      setTimeout(() => router.push("/admin/shipments"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to create shipment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Shipment</h1>

      {status === "success" ? (
        <Card variant="elevated" className="text-center py-10">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[var(--foreground)]">Shipment Created!</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Redirecting to shipments list...</p>
        </Card>
      ) : (
        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="font-bold text-primary">Sender Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Sender Name" error={errors.senderName?.message} {...register("senderName")} />
              <Input label="Sender Email" type="email" error={errors.senderEmail?.message} {...register("senderEmail")} />
            </div>
            <Input label="Sender Phone" type="tel" {...register("senderPhone")} />

            <h3 className="font-bold text-primary pt-2">Receiver Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Receiver Name" error={errors.receiverName?.message} {...register("receiverName")} />
              <Input label="Receiver Email" type="email" error={errors.receiverEmail?.message} {...register("receiverEmail")} />
            </div>
            <Input label="Receiver Phone" type="tel" {...register("receiverPhone")} />

            <h3 className="font-bold text-primary pt-2">Shipment Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Origin" error={errors.origin?.message} {...register("origin")} />
              <Input label="Destination" error={errors.destination?.message} {...register("destination")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Weight (kg)" type="number" {...register("weight")} />
              <Input label="Cargo Type" placeholder="e.g. Textiles" {...register("cargoType")} />
            </div>
            <Select label="Shipping Type" error={errors.shippingType?.message} {...register("shippingType")}>
              <option value="ocean_fcl">Ocean FCL</option>
              <option value="ocean_lcl">Ocean LCL</option>
              <option value="air">Air Freight</option>
              <option value="ground">Ground Transport</option>
            </Select>
            <Textarea label="Notes" placeholder="Special handling instructions..." {...register("notes")} />

            {status === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Create Shipment
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
