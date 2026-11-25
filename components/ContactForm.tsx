"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dict } from "@/lib/content";
import { getProjectName, onProjectName } from "@/lib/projectName";

type Field = "fullName" | "email" | "phone" | "service" | "details";
type Errors = Partial<Record<Field, string>>;

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9٠-٩\s-]{7,20}$/;

/**
 * Sends through EmailJS. Field names (fullName, email, phone, companyName,
 * service, budget, timeline, details) match the EmailJS template variables.
 */
export default function ContactForm({ t, prefill }: { t: Dict["contact"]["form"]; prefill: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  // If the visitor named a project in the hero demo, start the message with it.
  useEffect(() => {
    const apply = (name: string) => {
      const field = formRef.current?.elements.namedItem("details") as HTMLTextAreaElement | null;
      if (!field) return;
      const untouched = field.value === "" || field.dataset.auto === field.value;
      if (!untouched) return;
      field.value = name ? `${prefill}${name}\n` : "";
      field.dataset.auto = field.value;
    };
    apply(getProjectName());
    return onProjectName(apply);
  }, [prefill]);

  const validate = (data: FormData): Errors => {
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const e: Errors = {};
    if (get("fullName").length < 2) e.fullName = t.vName;
    if (!EMAIL.test(get("email"))) e.email = t.vEmail;
    if (!PHONE.test(get("phone"))) e.phone = t.vPhone;
    if (!get("service")) e.service = t.vService;
    if (get("details").length < 10) e.details = t.vDetails;
    return e;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current!;
    const data = new FormData(form);
    setStatus(null);

    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Honeypot: real people never fill this field.
    if (data.get("website")) return;
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({ kind: "error", text: t.notConfigured });
      return;
    }

    setSending(true);
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setStatus({ kind: "success", text: t.success });
      form.reset();
    } catch {
      setStatus({ kind: "error", text: t.error });
    } finally {
      setSending(false);
    }
  };

  const err = (name: Field) =>
    errors[name] ? (
      <span className="field__error" id={`${name}-error`} role="alert">
        {errors[name]}
      </span>
    ) : null;
  const aria = (name: Field) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">{t.name}</label>
        <input id="fullName" name="fullName" autoComplete="name" {...aria("fullName")} />
        {err("fullName")}
      </div>
      <div className="field">
        <label htmlFor="email">{t.email}</label>
        <input id="email" name="email" type="email" dir="ltr" autoComplete="email" {...aria("email")} />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor="phone">{t.phone}</label>
        <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" {...aria("phone")} />
        {err("phone")}
      </div>
      <div className="field">
        <label htmlFor="companyName">{t.company}</label>
        <input id="companyName" name="companyName" autoComplete="organization" />
      </div>
      <div className="field field--full">
        <label htmlFor="service">{t.service}</label>
        <select id="service" name="service" defaultValue="" {...aria("service")}>
          <option value="" disabled>
            {t.servicePlaceholder}
          </option>
          {t.services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {err("service")}
      </div>
      <div className="field">
        <label htmlFor="budget">{t.budget}</label>
        <input id="budget" name="budget" />
      </div>
      <div className="field">
        <label htmlFor="timeline">{t.timeline}</label>
        <input id="timeline" name="timeline" />
      </div>
      <div className="field field--full">
        <label htmlFor="details">{t.details}</label>
        <textarea id="details" name="details" placeholder={t.detailsPlaceholder} {...aria("details")} />
        {err("details")}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form__foot">
        <button type="submit" className="btn btn--solid" disabled={sending}>
          {sending ? t.sending : t.submit}
        </button>
        <p className="form__status" data-kind={status?.kind} aria-live="polite">
          {status?.text}
        </p>
      </div>
    </form>
  );
}
