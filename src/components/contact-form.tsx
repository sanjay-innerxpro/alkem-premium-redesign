"use client";
import { useState, type FormEvent } from "react";
import { Icon } from "./icons";
import { useI18n } from "./i18n-provider";
export function ContactForm({
  jobId,
  jobTitle,
  subject,
}: {
  jobId?: string;
  jobTitle?: string;
  subject?: string;
}) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const { t } = useI18n();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPending(true);
    setStatus("");
    try {
      const body = { ...Object.fromEntries(new FormData(form)), jobId };
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      form.reset();
      setStatus(t.f_success);
    } catch (e) {
      setStatus(
        e instanceof Error && e.message ? e.message : t.f_failed,
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="np-form" onSubmit={submit}>
      <div className="np-form__row">
        <label>
          {t.f_name}
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            placeholder={t.f_name_ph}
          />
        </label>
        <label>
          {t.f_email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label>
        {t.f_subject}
        <input
          name="subject"
          defaultValue={jobTitle ? t.career_enquiry + jobTitle : subject || ""}
          required
          minLength={2}
          maxLength={180}
          placeholder={t.f_subject_ph}
        />
      </label>
      <label>
        {jobTitle ? t.f_experience : t.f_message}
        <textarea
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          placeholder={
            jobTitle ? t.f_experience_ph : t.f_message_ph
          }
        />
      </label>
      <div className="np-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="np-form__note">
        {t.f_note}
      </p>
      <button className="np-btn np-btn--primary" disabled={pending || done}>
        {pending ? t.f_sending : done ? t.f_sent : t.f_send}
        <Icon name="arrow" size={18} />
      </button>
      <p
        role="status"
        className={done ? "np-form__ok" : "np-form__error"}
      >
        {status}
      </p>
    </form>
  );
}
