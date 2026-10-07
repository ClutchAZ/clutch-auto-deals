"use client";

import { useState } from "react";

export const REQUEST_TYPES = [
  "Lease quote",
  "Finance or cash quote",
  "Free deal review",
  "Sell my car",
  "Buy out my lease",
  "Something else",
] as const;

type Props = {
  defaultType?: (typeof REQUEST_TYPES)[number];
  vehicle?: string;
  dealReference?: string;
  submitLabel?: string;
  messageLabel?: string;
  compact?: boolean;
};

export function QuoteForm({
  defaultType = "Lease quote",
  vehicle = "",
  dealReference = "",
  submitLabel = "Send to a Clutch broker",
  messageLabel = "Anything else? Trade-in, a quote to beat, timing",
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("ok");
      form.reset();
    } catch {
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="form-card" role="status">
        <span className="disp" style={{ fontSize: 28, lineHeight: 1.05 }}>
          Got it. We're on it.
        </span>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)" }}>
          A Clutch broker will reach out shortly, usually the same business day. Need us sooner? Text{" "}
          <a href="sms:+14805306890" style={{ fontWeight: 700, borderBottom: "2px solid var(--orange)" }}>
            (480) 530-6890
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate={false}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="first_name">First name</label>
          <input id="first_name" name="first_name" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="last_name">Last name</label>
          <input id="last_name" name="last_name" autoComplete="family-name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="request_type">What do you need?</label>
        <select id="request_type" name="request_type" defaultValue={defaultType} required>
          {REQUEST_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="vehicle">Vehicle</label>
          <input id="vehicle" name="vehicle" defaultValue={vehicle} placeholder="e.g. 2026 BMW X5 xDrive40i" />
        </div>
        <div className="field">
          <label htmlFor="delivery_zip">Delivery ZIP</label>
          <input id="delivery_zip" name="delivery_zip" inputMode="numeric" autoComplete="postal-code" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{messageLabel}</label>
        <textarea id="message" name="message" rows={3} />
      </div>
      {dealReference && <input type="hidden" name="deal_reference" value={dealReference} />}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      {state === "err" && (
        <div className="form-status err" role="alert">
          That didn't go through. Please text or call us at (480) 530-6890 and we'll take it from there.
        </div>
      )}
      <button className="btn btn-ink btn-block" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
      <p className="form-note">Goes straight to the Clutch team. No credit pull to get a quote.</p>
    </form>
  );
}
