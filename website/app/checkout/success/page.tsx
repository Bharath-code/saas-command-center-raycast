type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    email?: string;
    plan?: string;
    status?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const plan = params.plan ?? "plan";

  return (
    <main className="status-page">
      <section className="status-panel">
        <p className="eyebrow">Checkout update</p>
        <h1>{status === "succeeded" ? "Payment confirmed." : "Checkout received."}</h1>
        <p>
          {status === "succeeded"
            ? `Your ${plan} purchase was successful. We sent the confirmation to ${params.email ?? "your email"}.`
            : "Dodo Payments has your checkout session. If the payment is still processing, this page will make sense of the return state for you."}
        </p>
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
