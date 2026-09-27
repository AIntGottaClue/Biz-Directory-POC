import { useState } from "react";
import { Phone, Send, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Business } from "@/data/types";
import {
  postTrackingEvent,
  TRACKING_ID,
  LOCATION_ID,
  PROJECT_ID,
} from "@/lib/tracking";

const HOME_SERVICE_CATS = new Set([
  "electricians",
  "roofers",
  "plumbers",
  "mechanics",
  "hvac",
]);

interface LeadGenFormProps {
  business: Business;
}

export default function LeadGenForm({ business }: LeadGenFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Don't show for premium or non-home-service categories
  if (business.premium || !HOME_SERVICE_CATS.has(business.category))
    return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizePhone = (p: string) => {
      const digits = p.replace(/\D/g, "");
      if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
      if (digits.length === 10) return `+1${digits}`;
      return p.startsWith("+") ? p : `+1${digits}`;
    };

    const trackingPayload = {
      type: "external_form_submission",
      timestamp: Date.now(),
      formId: "lead-gen-form",
      formData: {
        full_name: form.name,
        phone: normalizePhone(form.phone),
        email: form.email,
      },
      formLabels: {
        full_name: "Your Name",
        phone: "Phone Number",
        email: "Email Address",
      },
      url: window.location.href,
      title: document.title,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      trackingId: TRACKING_ID,
      locationId: LOCATION_ID,
      projectId: PROJECT_ID,
      sessionId: crypto.randomUUID(),
      properties: {
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
          ? "mobile"
          : "desktop",
        source: "ai_studio",
        projectId: PROJECT_ID,
        formName: `Lead Gen Form — ${business.name}`,
      },
    };

    postTrackingEvent(trackingPayload, {
      customFields: {
        "75QOZQxMb3IzxmlTlPew": {
          value: form.details,
          label: "Service Details",
        },
        Pzl0XET3CWGrHYlf7eFD: { value: business.name, label: "Business Name" },
        WCB0u2Md6qOUKK8xt3eh: { value: business.slug, label: "Business Slug" },
      },
    });

    setSubmitted(true);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-[#3a2a1e] via-[#4a3a2a] to-[#3a2a1e] text-white shadow-xl">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-[#fbbf24] mb-2">
            Free Estimate — No Obligation
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            Get a Free {business.categoryName} Estimate
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">
            Transform Your Home with{" "}
            <strong className="text-white">{business.name}</strong>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            Looking for trusted help in Round Rock? {business.name} is your
            go-to{" "}
            <strong className="text-white/85">{business.categoryName}</strong>{" "}
            for home projects big and small. From repairs to full renovations,
            get a free estimate from a local pro who's ready to get the job done
            right.{" "}
            <span className="font-semibold text-white">
              Quick. Reliable. Zero pressure.
            </span>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Licensed & Insured
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/15 border border-blue-300/25 px-3 py-1.5 text-xs font-semibold text-blue-300">
            <Clock className="h-3.5 w-3.5" /> Fast Response
          </span>
          <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70">
            Free Quote
          </span>
        </div>

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your Name"
                  className="border-white/10 bg-white/8 text-white placeholder:text-white/40 focus:border-accent focus-visible:ring-accent"
                />
                <Input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="Phone Number"
                  className="border-white/10 bg-white/8 text-white placeholder:text-white/40 focus:border-accent focus-visible:ring-accent"
                />
              </div>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Email Address"
                className="border-white/10 bg-white/8 text-white placeholder:text-white/40 focus:border-accent focus-visible:ring-accent"
              />
              <Textarea
                value={form.details}
                onChange={(e) =>
                  setForm((f) => ({ ...f, details: e.target.value }))
                }
                placeholder={`Briefly describe what you need (e.g., "Need AC repair", "Leaky faucet in kitchen")...`}
                rows={3}
                className="resize-none border-white/10 bg-white/8 text-white placeholder:text-white/40 focus:border-accent focus-visible:ring-accent"
              />

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 rounded-xl bg-[#e8a87c] font-bold text-[#3a2a1e] shadow-lg hover:bg-[#f0bd95] hover:brightness-105 transition-all hover:-translate-y-0.5"
                >
                  <Send className="mr-2 h-4 w-4" /> Get Your Free{" "}
                  {business.categoryName} Quote
                </Button>
                <a
                  href="tel:+15125551234"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" /> Call Now: (512) 555-1234
                </a>
              </div>
            </form>

            <p className="mt-4 text-center text-[11px] uppercase tracking-wider text-white/30">
              By submitting, you agree to be contacted about your request. This
              is not the business's direct contact info.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="font-display text-xl font-bold">Request Sent!</h3>
            <p className="mt-2 text-sm text-white/70">
              A local {business.categoryName} pro will contact you within
              minutes.
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setForm({ name: "", phone: "", email: "", details: "" });
                setSubmitted(false);
              }}
              className="mt-4 text-accent hover:text-accent/80"
            >
              Submit another request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
