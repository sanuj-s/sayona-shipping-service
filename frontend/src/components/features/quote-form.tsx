"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitQuote } from "@/lib/api/endpoints";
import { CheckCircle, AlertCircle } from "lucide-react";

const quoteSchema = z.object({
  cargo: z.string().min(1, "Product type is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  email: z.string().email("Valid email is required"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    try {
      setStatus("idle");
      await submitQuote(data);
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="quote" className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
      <Container size="sm">
        <SectionTitle title="Get a Free Quote" />

        {status === "success" ? (
          <div className="text-center p-8 rounded-[var(--radius-lg)] bg-success-light border border-success/20">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Quote Request Sent!</h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              We&apos;ll get back to you within 24 hours with a competitive rate.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
              Submit Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input name="_honey" type="text" className="hidden" tabIndex={-1} />
            <Input
              label="Product Type"
              placeholder="e.g. Textiles, Electronics, Chemicals"
              error={errors.cargo?.message}
              {...register("cargo")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Origin Country"
                placeholder="e.g. India"
                error={errors.origin?.message}
                {...register("origin")}
              />
              <Input
                label="Destination"
                placeholder="e.g. USA"
                error={errors.destination?.message}
                {...register("destination")}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {status === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Request Quote
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}
