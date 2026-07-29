import { Link } from "@tanstack/react-router";
import logoLight from "@/assets/logo-light.svg";
import { CtaButton } from "./CtaButton";
import { SITE, services, serviceAreas } from "@/lib/site-data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  
  // Track scroll over the footer element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Parallax effects: scale up and move slightly as you scroll into the footer
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <footer ref={containerRef} className="border-t border-border bg-charcoal relative overflow-hidden">
      <motion.div 
        style={isMobile ? {} : { y, scale, opacity }} 
        className="w-full h-full relative flex flex-col pt-16 lg:pt-24 min-h-[85vh] justify-between"
      >
        <div className="container-wide">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <img src={logoLight} alt="Demo Bros" className="h-28 w-auto" width={334} height={330} loading="lazy" />
              <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
                Melbourne's precision demolition specialists. Strip outs, defits and controlled demolition —
                delivered with the discipline of engineering and the care of an Australian family business.
              </p>
              <div className="mt-8 flex flex-col gap-2 text-sm">
                <a href={SITE.phoneHref} className="font-semibold text-foreground hover:text-primary transition-colors">
                  {SITE.phone}
                </a>
                <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {SITE.email}
                </a>
                <span className="text-muted-foreground">{SITE.address}</span>
              </div>
            </div>

            <div className="lg:col-span-3 lg:pl-10">
              <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">Services</h3>
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">Company</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {(
                  [
                    ["About", "/about"],
                    ["Projects", "/projects"],
                    ["Industries", "/industries"],
                    ["Reviews", "/reviews"],
                    ["Locations", "/locations"],
                    ["FAQ", "/faq"],
                    ["Contact", "/contact"],
                    ["Get a Quote", "/quote"],
                  ] as const
                ).map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-foreground/80 transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">Service Areas</h3>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-3 text-sm">
                {serviceAreas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to="/locations/$slug"
                      params={{ slug: a.slug }}
                      className="text-muted-foreground hover:text-primary transition-colors relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <CtaButton to="/quote" size="md" className="mt-10">
                Start Your Project
              </CtaButton>
            </div>
          </div>
        </div>
        
        {/* Massive Branding at the bottom */}
        <div className="w-full mt-8 overflow-hidden flex flex-col items-center justify-end select-none pointer-events-none px-4">
          <h2 className="text-[12.5vw] leading-none font-black text-white/5 font-heading text-center tracking-tighter">
            DEMO BROS
          </h2>
        </div>

        {/* Copyright Bar */}
        <div className="container-wide pb-8 pt-4 relative z-10 bg-charcoal/50 backdrop-blur-sm border-t border-white/5 mt-auto">
          <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} Demo Bros Pty Ltd · ABN {SITE.abn} · VBA Compliant · $20M Insured
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
