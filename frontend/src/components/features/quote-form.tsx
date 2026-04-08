"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitQuote } from "@/lib/api/endpoints";
import { CheckCircle, AlertCircle, Clock, Shield, Globe } from "lucide-react";

const quoteSchema = z.object({
  cargo: z.string().min(1, "Product type is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  email: z.string().email("Valid email is required"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const trustItems = [
  { icon: Clock, text: "Average response: 2 hours" },
  { icon: Shield, text: "No spam, no obligations" },
  { icon: Globe, text: "50+ destination countries" },
];

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
    <section id="quote" className="py-[var(--spacing-section)] bg-[var(--background)]">
      <Container>
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-start">

          {/* ═══ Left: Persuasive Copy ═══ */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              Free Quote
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 leading-tight">
              Get a Free Quote
            </h2>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-8 max-w-md">
              Tell us about your shipment and our logistics team will provide a competitive rate within hours — no obligations, no hidden fees.
            </p>

            {/* Trust Items */}
            <div className="space-y-4">
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-[var(--foreground-secondary)] font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Right: Form Card ═══ */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-card)]">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Quote Request Sent!</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mb-6">
                  We&apos;ll get back to you within 2 hours with a competitive rate.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")}>
                  Submit Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                <p className="text-[11px] text-[var(--foreground-secondary)] text-center">
                  By submitting, you agree to our privacy policy. No spam guaranteed.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
