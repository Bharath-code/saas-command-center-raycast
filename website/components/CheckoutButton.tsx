"use client";

import { useState, useTransition } from "react";

import type { CheckoutPlan } from "../lib/content";

type CheckoutButtonProps = {
  label: string;
  plan: CheckoutPlan;
  featured?: boolean;
};

export function CheckoutButton({ label, plan, featured = false }: CheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setError(null);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ plan }),
          });

          const payload = (await response.json()) as { checkoutUrl?: string; error?: string };

          if (!response.ok || !payload.checkoutUrl) {
            throw new Error(payload.error || "Unable to start checkout right now.");
          }

          window.location.href = payload.checkoutUrl;
        } catch (checkoutError) {
          const message =
            checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout right now.";
          setError(message);
        }
      })();
    });
  };

  return (
    <div className="checkout-wrap">
      <button
        className={featured ? "button button-primary" : "button button-secondary"}
        onClick={handleClick}
        type="button"
        disabled={isPending}
      >
        {isPending ? "Starting checkout..." : label}
      </button>
      {error ? <p className="field-note field-note-error">{error}</p> : null}
    </div>
  );
}
