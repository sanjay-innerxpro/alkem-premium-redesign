"use client";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
      setBusy(false);
    }
  }
  const capsCheck = (e: KeyboardEvent<HTMLInputElement>) =>
    setCaps(e.getModifierState("CapsLock"));
  return (
    // method="post" keeps credentials out of the URL if the form is submitted
    // before JavaScript has loaded.
    <form className="login-form" method="post" onSubmit={submit}>
      <label className="login-field">
        <span>Email address</span>
        <div>
          <Icon name="mail" size={18} />
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            placeholder="you@company.com"
            autoFocus
          />
        </div>
      </label>
      <label className="login-field">
        <span>Password</span>
        <div>
          <Icon name="shield" size={18} />
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={200}
            placeholder="Your password"
            onKeyUp={capsCheck}
            onKeyDown={capsCheck}
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      {caps && <p className="login-caps">Caps Lock is on</p>}
      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}
      <button className="login-submit" disabled={busy}>
        {busy ? (
          <>
            <span className="login-spinner" aria-hidden="true" /> Signing in…
          </>
        ) : (
          <>
            Sign in <Icon name="arrow" size={18} />
          </>
        )}
      </button>
    </form>
  );
}
