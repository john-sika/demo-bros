import { z } from "zod";

// Visible quote-form fields. Used by the QuoteForm's client-side resolver AND
// re-validated server-side inside the submitLead server function, so the browser
// and the server agree on exactly what a valid submission looks like.
export const quoteSchema = z.object({
  name: z.string().trim().nonempty("Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(8, "Please enter a valid phone number").max(20),
  suburb: z.string().trim().nonempty("Please enter your suburb").max(100),
  service: z.string().nonempty("Please select a service"),
  details: z.string().trim().max(2000).optional(),
});

export type QuoteValues = z.infer<typeof quoteSchema>;

// Full payload the browser sends to the server: the visible fields plus a spam
// honeypot and marketing attribution captured from the page/URL. Every extra
// field is optional so older cached clients never fail validation.
export const leadSchema = quoteSchema.extend({
  // Honeypot — hidden from real users; only bots fill it. Handled server-side.
  website: z.string().max(500).optional().default(""),
  page: z.string().max(300).optional().default(""),
  pageUrl: z.string().max(1000).optional().default(""),
  referrer: z.string().max(1000).optional().default(""),
  tracking: z.record(z.string(), z.string()).optional().default({}),
});

export type LeadInput = z.infer<typeof leadSchema>;
