type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    email?: string;
    plan?: string;
    status?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const plan = params.plan === "pro" ? "Pro" : "your plan";
  const isSucceeded = status === "succeeded";

  return (
    <main className="status-page">
      <section className="status-panel">
        <p className="eyebrow">Checkout update</p>
        <h1>{isSucceeded ? "Payment confirmed." : "Checkout received."}</h1>
        <p>
          {isSucceeded
            ? `Your ${plan} purchase was successful. Dodo Payments will email your license key so you can unlock Pro inside Raycast.`
            : "Dodo Payments has your checkout session. If the payment is still processing, wait for the confirmation email with your license key before activating Pro."}
        </p>
        <ol className="status-steps">
          <li>Open Raycast and run the `License & Billing` command.</li>
          <li>
            Choose `Activate License` and paste the Dodo license key from your
            email.
          </li>
          <li>
            Keep your Stripe projects local on this device while Pro unlocks
            unlimited workspaces.
          </li>
        </ol>
        <div className="button-row">
          <a className="button button-primary" href="/">
            Back to Revcast
          </a>
          <a className="button button-secondary" href="/#pricing">
            Review plans
          </a>
        </div>
      </section>
    </main>
  );
}
