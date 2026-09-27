import { useCity } from "@/lib/router";
import { useParams, useNavigate, Link } from "@/lib/router";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Store,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBySlug } from "@/data/helpers";
import {
  postTrackingEvent,
  TRACKING_ID,
  LOCATION_ID,
  PROJECT_ID,
} from "@/lib/tracking";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Generate 30-minute-increment time options in 12-hour format
const TIME_OPTIONS: string[] = (() => {
  const opts: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? "AM" : "PM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      opts.push(`${hour12}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return opts;
})();

function parseTimeRange(time: string): {
  closed: boolean;
  open: string;
  close: string;
} {
  if (!time || time.trim().toLowerCase() === "closed")
    return { closed: true, open: "9:00 AM", close: "5:00 PM" };
  const parts = time
    .split(/[–-]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2)
    return { closed: true, open: "9:00 AM", close: "5:00 PM" };
  return { closed: false, open: parts[0], close: parts[1] };
}

export default function ClaimListing() {
  const city = useCity();
  const { slug } = useParams();
  const navigate = useNavigate();
  const biz = slug ? getBySlug(slug, city.slug) : undefined;
  const [submitted, setSubmitted] = useState(false);

  // Prefilled listing info (editable)
  const [listing, setListing] = useState({
    name: biz?.name ?? "",
    phone: biz?.phone ?? "",
    email: biz?.email ?? "",
    website: biz?.website ?? "",
    address: biz?.address ?? "",
    city: biz?.city ?? "",
    state: biz?.state ?? "",
    zip: biz?.zip ?? "",
    description: biz?.description ?? "",
    services: biz?.services ?? [],
    hours: biz?.hours ?? DAYS.map((d) => ({ day: d, time: "" })),
  });

  // Claimant contact info
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    relationship: "Owner",
  });

  // Services tag input
  const [serviceInput, setServiceInput] = useState("");

  const addService = () => {
    const v = serviceInput.trim();
    if (v && !listing.services.includes(v)) {
      setListing((l) => ({ ...l, services: [...l.services, v] }));
    }
    setServiceInput("");
  };

  const removeService = (s: string) =>
    setListing((l) => ({ ...l, services: l.services.filter((x) => x !== s) }));

  const updateHour = (day: string, time: string) =>
    setListing((l) => ({
      ...l,
      hours: l.hours.map((h) => (h.day === day ? { ...h, time } : h)),
    }));

  const setDayClosed = (day: string, closed: boolean) =>
    setListing((l) => ({
      ...l,
      hours: l.hours.map((h) =>
        h.day === day
          ? { ...h, time: closed ? "Closed" : "9:00 AM – 5:00 PM" }
          : h,
      ),
    }));

  const setOpenTime = (day: string, open: string) =>
    setListing((l) => ({
      ...l,
      hours: l.hours.map((h) => {
        if (h.day !== day) return h;
        const close = parseTimeRange(h.time).close;
        return { ...h, time: `${open} – ${close}` };
      }),
    }));

  const setCloseTime = (day: string, close: string) =>
    setListing((l) => ({
      ...l,
      hours: l.hours.map((h) => {
        if (h.day !== day) return h;
        const open = parseTimeRange(h.time).open;
        return { ...h, time: `${open} – ${close}` };
      }),
    }));

  if (!biz) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Listing not found</h1>
        <Button onClick={() => navigate("/")} className="mt-6">
          Back to home
        </Button>
      </div>
    );
  }
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
      formId: "claim-listing-form",
      formData: {
        first_name: contact.firstName,
        last_name: contact.lastName,
        phone: normalizePhone(contact.phone),
        email: contact.email,
      },
      formLabels: {
        first_name: "First Name",
        last_name: "Last Name",
        phone: "Phone",
        email: "Email",
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
        formName: `Claim Listing — ${biz.name}`,
      },
    };

    postTrackingEvent(trackingPayload, {
      customFields: {
        EviodFuKp3tTWkaoU5gs: {
          value: contact.relationship,
          label: "Relationship to Business",
        },
        Pzl0XET3CWGrHYlf7eFD: { value: listing.name, label: "Business Name" },
        ol5AZvsHIGba3iXsjRAO: {
          value: listing.website,
          label: "Business Website",
        },
        UhcBJ0Lkypb37ibIv5on: {
          value: listing.description,
          label: "Business Description",
        },
        CK9253SgvA0PvI1Utvxv: {
          value: listing.services.join(", "),
          label: "Business Services",
        },
        S4WxQ8zJ9AnWY5GnMmvA: {
          value: listing.hours.map((h) => `${h.day}: ${h.time}`).join("; "),
          label: "Business Hours",
        },
        WCB0u2Md6qOUKK8xt3eh: { value: biz.slug, label: "Business Slug" },
      },
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-verified/15 ring-4 ring-verified/10">
                <CheckCircle2 className="h-8 w-8 text-verified" />
              </div>
              <h1 className="font-display text-2xl font-bold">
                Claim Request Submitted!
              </h1>
              <p className="mt-3 text-muted-foreground">
                Thank you, {contact.firstName}. We've received your claim
                request for{" "}
                <strong className="text-foreground">{biz.name}</strong>. Our
                team will review your information and contact you within 1–2
                business days to verify ownership.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your edits were sent for review but have not changed the live
                listing yet.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to={`/business/${biz.slug}`}>
                  <Button variant="outline">Back to Listing</Button>
                </Link>
                <Link to="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <SEOHead
        title={biz ? `Claim ${biz.name}` : "Claim Listing"}
        description={
          biz
            ? `Claim ownership of ${biz.name} on Round Rock Local. Verify your business and update your listing information.`
            : "Claim your business listing on Round Rock Local."
        }
        canonical={biz ? `/claim/${biz.slug}` : "/claim"}
        noIndex
      />
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/business/${biz.slug}`}
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {biz.name}
        </Link>

        {/* Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Store className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold">
                Claim This Listing
              </h1>
              <p className="text-muted-foreground">
                Verify your ownership of{" "}
                <strong className="text-foreground">{biz.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <Card className="mb-8 border-accent/20 bg-accent/5">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How claiming works</p>
              <p className="mt-1">
                Fill out your contact info and review the listing details below.
                Once submitted, our team manually verifies your ownership.
                Verified listings get a{" "}
                <Badge className="bg-verified text-verified-foreground border-0 ml-1">
                  Verified
                </Badge>{" "}
                badge and the ability to update their information.
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Claimant contact info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-semibold">
                Your Contact Information
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll use this to verify your ownership and contact you about
                the claim.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    First Name *
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    required
                    value={contact.firstName}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, firstName: e.target.value }))
                    }
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Last Name *
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    required
                    value={contact.lastName}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, lastName: e.target.value }))
                    }
                    placeholder="Smith"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="(512) 555-0100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    required
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">
                    Relationship to Business
                  </label>
                  <select
                    value={contact.relationship}
                    onChange={(e) =>
                      setContact((c) => ({
                        ...c,
                        relationship: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Owner</option>
                    <option>Manager</option>
                    <option>Authorized Representative</option>
                    <option>Marketing Agency</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listing info — prefilled & editable */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-semibold">
                Review & Edit Listing Info
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                These are the current listing details. Make any corrections —
                your edits will be reviewed before going live.
              </p>

              {/* Current image preview */}
              <div className="mt-5 flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-3">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {biz.categoryName}
                  </p>
                  <p className="text-sm text-muted-foreground">Category</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">
                    Business Name
                  </label>
                  <Input
                    value={listing.name}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                    Phone
                  </label>
                  <Input
                    value={listing.phone}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, phone: e.target.value }))
                    }
                  />
                </div>
                {!biz?.hideEmail && (
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                      Email
                    </label>
                    <Input
                      type="email"
                      value={listing.email}
                      onChange={(e) =>
                        setListing((l) => ({ ...l, email: e.target.value }))
                      }
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                    Website
                  </label>
                  <Input
                    value={listing.website}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, website: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                    Street Address
                  </label>
                  <Input
                    value={listing.address}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, address: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    City
                  </label>
                  <Input
                    value={listing.city}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    State
                  </label>
                  <Input
                    value={listing.state}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, state: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    ZIP
                  </label>
                  <Input
                    value={listing.zip}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, zip: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    value={listing.description}
                    onChange={(e) =>
                      setListing((l) => ({ ...l, description: e.target.value }))
                    }
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Services — tag input */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">
                    Services
                  </label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Type a service and press Enter to add it. Click the × to
                    remove.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 rounded-md border border-input bg-background p-2.5 min-h-[44px]">
                    {listing.services.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-sm text-accent"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeService(s)}
                          className="ml-0.5 rounded-sm hover:bg-accent/20"
                          aria-label={`Remove ${s}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addService();
                        }
                      }}
                      onBlur={addService}
                      placeholder={
                        listing.services.length
                          ? "Add another…"
                          : "Type a service and press Enter"
                      }
                      className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Hours — structured dropdowns per day */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                    Business Hours
                  </label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Select open and close times for each day, or mark as closed.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {listing.hours.map((h) => {
                      const parsed = parseTimeRange(h.time);
                      return (
                        <div
                          key={h.day}
                          className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/20 p-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{h.day}</span>
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={parsed.closed}
                                onChange={(e) =>
                                  setDayClosed(h.day, e.target.checked)
                                }
                                className="h-3.5 w-3.5 rounded border-input accent-accent"
                              />
                              Closed
                            </label>
                          </div>
                          {!parsed.closed && (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={parsed.open}
                                onChange={(e) =>
                                  setOpenTime(h.day, e.target.value)
                                }
                                disabled={parsed.closed}
                                className="flex-1 min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                              <span className="text-xs text-muted-foreground">
                                to
                              </span>
                              <select
                                value={parsed.close}
                                onChange={(e) =>
                                  setCloseTime(h.day, e.target.value)
                                }
                                disabled={parsed.closed}
                                className="flex-1 min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              By submitting, you confirm you're authorized to claim this
              business.
            </p>
            <Button type="submit" size="lg" className="sm:min-w-[200px]">
              <ShieldCheck className="mr-2 h-4 w-4" /> Submit Claim Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
