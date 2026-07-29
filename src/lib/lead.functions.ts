import { createServerFn } from "@tanstack/react-start";
import { leadSchema } from "./quote-schema";
import { services } from "./site-data";

function serviceLabel(slug: string): string {
  if (slug === "other") return "Something else";
  return services.find((s) => s.slug === slug)?.title ?? slug;
}

function splitName(full: string): { first_name: string; last_name: string } {
  const parts = full.trim().split(/\s+/);
  const first_name = parts.shift() ?? "";
  return { first_name, last_name: parts.join(" ") };
}

// Receives a validated quote submission and forwards it to the GoHighLevel
// inbound webhook. Runs only on the server, so GHL_WEBHOOK_URL never reaches the
// browser and the cross-origin POST to GHL isn't blocked by CORS.
export const submitLead = createServerFn({ method: "POST" })
  .validator(leadSchema)
  .handler(async ({ data }) => {
    // Honeypot: a real person never sees or fills `website`. If it's filled,
    // it's a bot — pretend success and quietly drop it.
    if (data.website && data.website.trim() !== "") {
      return { ok: true as const };
    }

    const webhookUrl = process.env.GHL_WEBHOOK_URL;
    if (!webhookUrl) {
      // Backstop: log the full lead so it's recoverable from Cloudflare logs
      // even before the webhook URL is configured.
      console.error(
        "[submitLead] GHL_WEBHOOK_URL is not set — lead NOT forwarded:",
        JSON.stringify(data),
      );
      throw new Error("Lead destination is not configured.");
    }

    const { first_name, last_name } = splitName(data.name);
    const payload = {
      first_name,
      last_name,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      suburb: data.suburb,
      service: serviceLabel(data.service),
      service_slug: data.service,
      details: data.details ?? "",
      source: "Website — Quote Form",
      page: data.page || "",
      page_url: data.pageUrl || "",
      referrer: data.referrer || "",
      submitted_at: new Date().toISOString(),
      // UTM / click-id attribution (utm_source, gclid, fbclid, ...) if present.
      ...data.tracking,
    };

    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(
        "[submitLead] Network error POSTing to GHL webhook:",
        error,
        "Lead:",
        JSON.stringify(payload),
      );
      throw new Error("Failed to send lead.");
    }

    if (!res.ok) {
      console.error(
        `[submitLead] GHL webhook responded ${res.status} — lead may not have arrived. Lead:`,
        JSON.stringify(payload),
      );
      throw new Error(`Webhook responded ${res.status}`);
    }

    return { ok: true as const };
  });
