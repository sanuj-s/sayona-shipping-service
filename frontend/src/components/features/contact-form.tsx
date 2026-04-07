"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { submitContact } from "@/lib/api/endpoints";
import { CheckCircle, AlertCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setStatus("idle");
      await submitContact(data);
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <Card variant="elevated" className="text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Message Sent!</h3>
        <p className="text-sm text-[var(--foreground-secondary)] mb-4">
          Our team will review your request and get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send Another
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input name="_honey" type="text" className="hidden" tabIndex={-1} />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Name" placeholder="Your Name" error={errors.name?.message} {...register("name")} />
          <Input label="Company" placeholder="Company Name" {...register("company")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" placeholder="email@company.com" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
        </div>

        <h3 className="text-base font-bold text-primary pt-2">Shipment Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Origin Country" placeholder="e.g. India" {...register("origin")} />
          <Input label="Destination Country" placeholder="e.g. USA" {...register("destination")} />
        </div>

        <Select label="Cargo Type / Industry" {...register("industry")}>
          <option value="Textile & Apparel">Textile & Apparel</option>
          <option value="High-Tech">High-Tech & Electronics</option>
          <option value="Pharmaceuticals">Pharmaceuticals</option>
          <option value="Automotive">Automotive</option>
          <option value="Agri Products">Agri Products</option>
          <option value="General Cargo">General Cargo</option>
          <option value="Other">Other</option>
        </Select>

        <Textarea
          label="Message / Details"
          placeholder="Volume, weight, special handling requirements..."
          {...register("message")}
        />

        {status === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="text-center pt-2">
          <Button type="submit" variant="primary" className="min-w-[200px]" loading={isSubmitting}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
