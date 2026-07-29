import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { QuoteForm } from "@/components/site/QuoteForm";
import { SITE, serviceAreas } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Demo Bros | Demolition Melbourne — 1800 960 625" },
      {
        name: "description",
        content:
          "Contact Demo Bros for demolition and strip outs in Melbourne. Call 1800 960 625 or request a fixed quote. Licensed, insured to $20M, family-owned since 2013.",
      },
      { property: "og:title", content: "Contact Demo Bros | Demolition Melbourne" },
      { property: "og:description", content: "Talk to Melbourne's strip-out and demolition specialists — call, email or request a fixed quote." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Left column parallax
  const yLeft = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);
  const yRight = useTransform(scrollYProgress, [0, 1], ["-2%", "5%"]);

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Talk to a human who's held a jackhammer."
        description="No call centres, no bots. Call, email or send your project details — a specialist responds within one business day."
        image="/images/trend-demobros-acmi-stage3-apr26-12.jpg"
        video="https://res.cloudinary.com/eksopivw/video/upload/q_auto,f_auto,w_1920/v1783693988/Demo_Bros_video_1_ACMI_horizontal_V1_xjirhk.mp4"
      />
      <section className="bg-white text-charcoal py-20 lg:py-32 overflow-hidden border-t border-black/10" ref={ref}>
        <div className="container-wide grid gap-16 lg:grid-cols-12 lg:gap-24 items-start">
          <motion.div style={{ y: yLeft }} className="lg:col-span-5 lg:sticky lg:top-32">
            <Reveal>
              <div className="space-y-10 lg:space-y-16">
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Phone</h2>
                  <a href={SITE.phoneHref} className="font-heading mt-4 block text-3xl sm:text-4xl text-charcoal hover:text-primary lg:text-5xl transition-colors">
                    {SITE.phone}
                  </a>
                  <p className="mt-3 text-sm text-charcoal/60 uppercase tracking-widest">Mon–Sat, 6:30am – 6pm</p>
                </div>
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Email</h2>
                  <a href={`mailto:${SITE.email}`} className="mt-4 block text-xl sm:text-2xl font-semibold hover:text-primary transition-colors lg:text-3xl break-all">
                    {SITE.email}
                  </a>
                </div>
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">Based in</h2>
                  <p className="mt-4 text-xl sm:text-2xl font-semibold lg:text-3xl break-words">{SITE.address}</p>
                  <p className="mt-3 text-sm text-charcoal/60 uppercase tracking-widest">Servicing {serviceAreas.length} regions across greater Melbourne</p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-light p-6 sm:p-8 lg:p-10 shadow-lg">
                  <h2 className="font-heading text-xl sm:text-2xl uppercase tracking-tight text-primary">Site inspections</h2>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-charcoal/70">
                    Most projects are quoted after a free 20-minute site walk. Commercial defits can usually be quoted
                    from drawings and a make-good scope.
                  </p>
                </div>
              </div>
            </Reveal>
          </motion.div>
          
          <motion.div style={{ y: yRight }} className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="group relative overflow-hidden rounded-3xl border border-black/10 bg-light p-6 shadow-xl transition-colors duration-500 hover:border-primary/50 sm:p-10 lg:p-14">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <h2 className="relative z-10 font-heading text-2xl sm:text-3xl uppercase tracking-tight text-charcoal lg:text-4xl">Send your project details</h2>
                <p className="relative z-10 mt-4 mb-10 text-lg text-charcoal/70">Fixed quote within 24 hours of inspection.</p>
                <div className="relative z-10">
                  <QuoteForm />
                </div>
              </div>
            </Reveal>
          </motion.div>
        </div>
      </section>
    </>
  );
}
