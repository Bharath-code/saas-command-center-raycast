"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import type { WaitlistInterest } from "../lib/content";
import { waitlistConfig } from "../lib/content";

const validInterests = new Set<WaitlistInterest>([
  "general",
  "free",
  "pro_monthly",
  "pro_yearly",
  "pro_lifetime",
]);

function getInterest(value: string | null): WaitlistInterest {
  if (value && validInterests.has(value as WaitlistInterest)) {
    return value as WaitlistInterest;
  }

  return "general";
}

export function WaitlistForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<WaitlistInterest>("general");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setInterest(getInterest(searchParams.get("interest")));
  }, [searchParams]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/waitlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              interest,
              source: waitlistConfig.source,
            }),
          });

          const payload = (await response.json()) as { ok?: true; error?: string };

          if (!response.ok || !payload.ok) {
            throw new Error(payload.error || "Unable to join the waitlist.");
          }

          setEmail("");
          setMessage(waitlistConfig.successMessage);
        } catch (submitError) {
          const nextError =
            submitError instanceof Error
              ? submitError.message
              : "Unable to join the waitlist.";
          setError(nextError);
        }
      })();
    });
  };

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <label className="waitlist-form__field">
        <span>Email</span>
        <input
          autoComplete="email"
          className="waitlist-form__input"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
      </label>

      <button className="button button-primary" disabled={isPending} type="submit">
        {isPending ? waitlistConfig.pendingLabel : waitlistConfig.submitLabel}
      </button>

      <p className="waitlist-form__hint">{waitlistConfig.finePrint}</p>

      <div aria-live="polite" className="waitlist-form__status">
        {message ? <p className="field-note field-note-success">{message}</p> : null}
        {error ? <p className="field-note field-note-error">{error}</p> : null}
      </div>
    </form>
  );
}
