"use client";
import { useState, type FormEvent } from "react";
import { Icon } from "./icons";
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
      setStatus("Thank you — your message has reached our team. We’ll be in touch soon.");
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "Unable to send. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="np-form" onSubmit={submit}>
      <div className="np-form__row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            placeholder="Full name"
          />
        </label>
        <label>
          Email address
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
        Subject
        <input
          name="subject"
          defaultValue={jobTitle ? "Career enquiry: " + jobTitle : subject || ""}
          required
          minLength={2}
          maxLength={180}
          placeholder="How can we help?"
        />
      </label>
      <label>
        {jobTitle ? "Tell us about your experience" : "Your message"}
        <textarea
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          placeholder={
            jobTitle
              ? "Share your experience and a link to your professional profile."
              : "Tell us a little more…"
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
        Please don’t include personal health information or sensitive documents.
        For medical advice, consult a qualified healthcare professional.
      </p>
      <button className="np-btn np-btn--primary" disabled={pending || done}>
        {pending ? "Sending…" : done ? "Message sent" : "Send message"}
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
