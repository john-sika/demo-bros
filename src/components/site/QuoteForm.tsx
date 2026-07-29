import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CtaButton } from "./CtaButton";
import { services } from "@/lib/site-data";
import { quoteSchema, type QuoteValues } from "@/lib/quote-schema";
import { submitLead } from "@/lib/lead.functions";
import { captureTracking, getTracking } from "@/lib/tracking";

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-5 py-4 text-base text-charcoal placeholder:text-muted-foreground/70 transition-all duration-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30 focus:outline-none hover:border-black/20 shadow-sm";

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({ resolver: zodResolver(quoteSchema), defaultValues: { service: "" } });

  // Record first-touch ad/campaign attribution as soon as the form mounts.
  useEffect(() => {
    captureTracking();
  }, []);

  const onSubmit = async (values: QuoteValues) => {
    setErrorMsg(null);
    try {
      await submitLead({
        data: {
          ...values,
          website: honeypotRef.current?.value ?? "",
          page: window.location.pathname,
          pageUrl: window.location.href,
          referrer: document.referrer,
          tracking: getTracking(),
        },
      });
      setSubmitted(true);
    } catch {
      setErrorMsg(
        "Something went wrong sending your request. Please try again — or call us on 1800 960 625 and we'll sort it straight away.",
      );
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center rounded-lg border border-border bg-card px-6 sm:px-8 py-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary"
            >
              <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
                <motion.path
                  d="M2 13 12 23 32 3"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </svg>
            </motion.div>
            <h3 className="font-heading mt-8 text-2xl">Quote request received</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              Thanks — one of the Bros will be in touch within one business day with your fixed
              quote.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            exit={{ opacity: 0, y: -12 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {/* Honeypot: hidden from real users; bots that fill it are dropped server-side. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
            >
              <label htmlFor="q-website">Website</label>
              <input
                id="q-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                ref={honeypotRef}
              />
            </div>
            <div>
              <label htmlFor="q-name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <input
                id="q-name"
                placeholder="Your full name"
                className={inputClass}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="q-phone" className="mb-2 block text-sm font-medium">
                Phone
              </label>
              <input
                id="q-phone"
                type="tel"
                placeholder="04xx xxx xxx"
                className={inputClass}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="q-email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="q-email"
                type="email"
                placeholder="you@email.com"
                className={inputClass}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="q-suburb" className="mb-2 block text-sm font-medium">
                Suburb
              </label>
              <input
                id="q-suburb"
                placeholder="e.g. Paddington"
                className={inputClass}
                {...register("suburb")}
              />
              {errors.suburb && (
                <p className="mt-1.5 text-sm text-destructive">{errors.suburb.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="q-service" className="mb-2 block text-sm font-medium">
                Service required
              </label>
              <select id="q-service" className={inputClass} {...register("service")}>
                <option value="" disabled>
                  Select a service…
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
                <option value="other">Something else</option>
              </select>
              {errors.service && (
                <p className="mt-1.5 text-sm text-destructive">{errors.service.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="q-details" className="mb-2 block text-sm font-medium">
                Project details <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="q-details"
                rows={5}
                placeholder="Tell us about the space, timing and access…"
                className={inputClass}
                {...register("details")}
              />
            </div>
            <div className="sm:col-span-2">
              <CtaButton
                type="submit"
                disabled={isSubmitting}
                fullWidth
                icon={!isSubmitting}
                className="sm:w-auto"
              >
                {isSubmitting ? "Sending…" : "Request My Fixed Quote"}
              </CtaButton>
              {errorMsg && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {errorMsg}
                </p>
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                Fixed quotes within 24 hours. No obligation. Your details are never shared.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
