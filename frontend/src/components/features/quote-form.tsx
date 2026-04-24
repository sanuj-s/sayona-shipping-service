"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { submitQuote, getQuoteEstimate } from "@/lib/api/endpoints";
import { COUNTRIES, SHIPPING_MODES } from "@/lib/utils/countries";
import { CheckCircle, AlertCircle, Clock, Shield, Globe, ArrowRight, ArrowLeft, RefreshCcw } from "lucide-react";
import { EASE, DURATION } from "@/lib/motion/variants";

const CARGO_CATEGORIES = [
  "Industrial Machinery",
  "Textiles & Garments",
  "Electronics & Tech",
  "Automotive Parts",
  "Chemicals & Hazardous",
  "Food & Perishables",
  "Consumer Goods",
  "Pharmaceuticals",
  "Other"
];

const CACHE_KEY = "sayona-quote-draft";

const quoteSchema = z.object({
  // Step 1: Payload
  cargo: z.string().min(2, "Product category required"),
  cargoOther: z.string().optional(),
  shippingMode: z.string().min(1, "Mode is required"),
  weight: z.string().min(1, "Est. weight required"),
  packages: z.string().optional(),
  // Step 2: Route
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  // Step 3: Contact
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone is required"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const trustItems = [
  { icon: Clock, text: "Average AI estimation: Instant" },
  { icon: Shield, text: "No spam, no obligations" },
  { icon: Globe, text: "50+ destination networks" },
];

export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { register, handleSubmit, watch, reset, trigger, setValue, formState: { errors, isSubmitting } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: "onChange"
  });

  const formValues = watch();

  // Phase 4: LocalStorage Persistence
  useEffect(() => {
    const draft = localStorage.getItem(CACHE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        Object.keys(parsed).forEach((key) => {
          setValue(key as keyof QuoteFormData, parsed[key]);
        });
      } catch (e) {}
    }
  }, [setValue]);

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formValues));
    }
  }, [formValues]);

  // Phase 4: Live Price Predictor
  useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      const actualCargo = formValues.cargo === "Other" ? formValues.cargoOther : formValues.cargo;
      
      if (formValues.weight && formValues.origin && formValues.destination && actualCargo) {
        try {
          const res = await getQuoteEstimate({
            origin: formValues.origin,
            destination: formValues.destination,
            weight: formValues.weight,
            cargoType: actualCargo
          });
          if (active && res.estimatedPrice !== undefined) {
            setEstimatedPrice(Math.round(Number(res.estimatedPrice)));
          }
        } catch (e) {
          if (active) setEstimatedPrice(null);
        }
      } else {
        setEstimatedPrice(null);
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [formValues.weight, formValues.cargo, formValues.cargoOther, formValues.origin, formValues.destination]);

  const handleNext = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(["cargo", "shippingMode", "weight", "packages"]);
      if (formValues.cargo === "Other" && !formValues.cargoOther) {
        valid = false;
        // Optionally trigger error on cargoOther if added to schema rules, but manual check works
      }
    }
    if (step === 2) valid = await trigger(["origin", "destination"]);

    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const onSubmit = async (data: QuoteFormData) => {
    try {
      setStatus("idle");
      // Artificial UX Latency (300-800ms) injected Phase 5
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const payloadData = {
        ...data,
        cargo: data.cargo === "Other" && data.cargoOther ? data.cargoOther : data.cargo,
      };
      
      await submitQuote(payloadData);
      setStatus("success");
      localStorage.removeItem(CACHE_KEY);
      reset();
      setStep(1);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    active: { opacity: 1, x: 0, transition: { duration: DURATION.normal, ease: EASE.premium } },
    exit: { opacity: 0, x: -20, transition: { duration: DURATION.fast, ease: EASE.premium } }
  };

  return (
    <section id="quote" className="py-[var(--spacing-section)] bg-[var(--background)]">
      <Container>
        <div className="grid lg:grid-cols-[1fr_520px] gap-12 lg:gap-16 items-start">

          {/* ═══ Left: Context ═══ */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Instant Estimation Engine
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-[var(--foreground)] mb-6 leading-[1.1] tracking-tight">
              Calculate Freight Logistics.
            </h2>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-8 max-w-md">
              Process your payload dimensions through our live estimation matrix. Commit when you're ready — no hidden fees.
            </p>

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
            
            {/* Live Estimation Readout */}
            <div className="mt-12 p-6 glass-3d rounded-2xl border-0 shadow-[var(--shadow-elevated)] max-w-md">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs uppercase font-bold tracking-widest opacity-60">Estimated Cost</span>
                 {estimatedPrice && <span className="flex items-center gap-1 text-[10px] text-success animate-pulse"><RefreshCcw className="h-3 w-3" /> Live</span>}
               </div>
               <div className="text-4xl font-display font-black text-gradient">
                  {estimatedPrice ? `$${estimatedPrice.toLocaleString()}` : "$—"}
               </div>
               <p className="text-xs mt-2 opacity-50">Calculated based on volume, mode, and target port. Final rate subject to carrier dynamic pricing.</p>
            </div>
          </div>

          {/* ═══ Right: Multi-Step Form ═══ */}
          <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-card)] overflow-hidden">
            {status === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-2xl font-black font-display text-[var(--foreground)] mb-3 tracking-tight">Request Logged</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mb-8">
                  Your payload parameters have been securely transmitted. A logistics operative will lock in your rate within 2 hours.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")}>
                  Process Another Payload
                </Button>
              </motion.div>
            ) : (
              <div>
                 {/* Progress Indicator */}
                 <div className="flex justify-between items-end mb-8">
                    <div>
                       <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {step} of 3</span>
                       <h3 className="text-lg font-bold text-[var(--foreground)]">
                          {step === 1 ? "Payload Profile" : step === 2 ? "Node Trajectory" : "Final Authorization"}
                       </h3>
                    </div>
                    <div className="flex gap-1">
                       {[1, 2, 3].map((i) => (
                           <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= step ? "bg-primary" : "bg-[var(--border-color)]"}`} />
                       ))}
                    </div>
                 </div>

                <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-[340px]">
                  <input name="_honey" type="text" className="hidden" tabIndex={-1} />

                  <AnimatePresence mode="wait">
                    {/* STEP 1: Payload */}
                    {step === 1 && (
                      <motion.div key="step1" variants={stepVariants} initial="hidden" animate="active" exit="exit" className="space-y-5">
                        <Select label="Payload Category" error={errors.cargo?.message} {...register("cargo")}>
                          <option value="">Select category</option>
                          {CARGO_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                        
                        {formValues.cargo === "Other" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                            <Input label="Specify Category" placeholder="Please specify..." error={errors.cargoOther?.message} {...register("cargoOther", { required: formValues.cargo === "Other" })} />
                          </motion.div>
                        )}
                        
                        <Select label="Transit Mode" error={errors.shippingMode?.message} {...register("shippingMode")}>
                          <option value="">Select mode</option>
                          {SHIPPING_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </Select>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Mass (kg)" type="number" placeholder="e.g. 1500" error={errors.weight?.message} {...register("weight")} />
                          <Input label="Pallets/Packages" type="number" placeholder="e.g. 12" error={errors.packages?.message} {...register("packages")} />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Route */}
                    {step === 2 && (
                      <motion.div key="step2" variants={stepVariants} initial="hidden" animate="active" exit="exit" className="space-y-5">
                        <Select label="Origin Gateway" error={errors.origin?.message} {...register("origin")}>
                          <option value="">Select outbound node</option>
                          {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </Select>
                        <Select label="Destination Node" error={errors.destination?.message} {...register("destination")}>
                          <option value="">Select inbound node</option>
                          {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </Select>
                      </motion.div>
                    )}

                    {/* STEP 3: Contact */}
                    {step === 3 && (
                      <motion.div key="step3" variants={stepVariants} initial="hidden" animate="active" exit="exit" className="space-y-5">
                        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="Secure Contact Email" type="email" placeholder="agent@company.com" error={errors.email?.message} {...register("email")} />
                          <Input label="Direct Line" type="tel" placeholder="+91..." error={errors.phone?.message} {...register("phone")} />
                        </div>
                        {status === "error" && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-error/[0.05] border border-error/20 text-error text-sm">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
                          </motion.div>
                        )}
                        <div className="p-4 rounded-xl bg-accent/[0.03] border border-accent/10">
                           <p className="text-[10px] uppercase font-bold text-accent tracking-widest mb-1">Pre-flight check</p>
                           <p className="text-sm opacity-80">You are requesting a competitive lock-in rate for <strong className="text-[var(--foreground)]">{formValues.weight}kg</strong> of <strong className="text-[var(--foreground)]">{formValues.cargo === "Other" ? formValues.cargoOther : formValues.cargo}</strong> via {formValues.shippingMode}.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Array */}
                  <div className="absolute bottom-0 w-full flex justify-between gap-4 mt-8 pt-6 border-t border-[var(--border-color)]">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={handleBack}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                    ) : <div />}
                    
                    {step < 3 ? (
                      <Button type="button" variant="accent" onClick={handleNext}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                    ) : (
                      <Button type="submit" variant="primary" loading={isSubmitting}>Transmit Request</Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
