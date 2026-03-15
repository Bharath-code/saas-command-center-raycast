import { hasWaitlistAdminAccess } from "../../../lib/admin-auth";
import { listWaitlistSignups } from "../../../lib/license-store";
import { waitlistInterestLabels } from "../../../lib/content";

type WaitlistAdminPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function WaitlistAdminPage({
  searchParams,
}: WaitlistAdminPageProps) {
  const params = await searchParams;
  const token = params.token?.trim() || "";

  if (!hasWaitlistAdminAccess(token)) {
    return (
      <main className="status-page">
        <section className="status-panel">
          <p className="eyebrow">Waitlist admin</p>
          <h1>Access required.</h1>
          <p>
            Add a valid `token` query parameter and set `WAITLIST_ADMIN_TOKEN`
            in the website environment before opening this page.
          </p>
        </section>
      </main>
    );
  }

  const signups = await listWaitlistSignups();
  const counts = signups.reduce<Record<string, number>>((accumulator, signup) => {
    accumulator.total += 1;
    accumulator[signup.interest] = (accumulator[signup.interest] || 0) + 1;
    return accumulator;
  }, {
    total: 0,
    general: 0,
    free: 0,
    pro_monthly: 0,
    pro_yearly: 0,
    pro_lifetime: 0,
  });

  return (
    <main className="page-shell admin-page">
      <section className="section section-grid">
        <div className="section-head">
          <p className="eyebrow">Waitlist admin</p>
          <h1>Launch interest overview</h1>
          <p>
            Review who joined the Revcast prelaunch list and export the data as CSV
            from the same project.
          </p>
        </div>

        <div className="admin-summary-grid">
          <article className="admin-summary-card">
            <span>Total</span>
            <strong>{counts.total}</strong>
          </article>
          <article className="admin-summary-card">
            <span>General</span>
            <strong>{counts.general}</strong>
          </article>
          <article className="admin-summary-card">
            <span>Free</span>
            <strong>{counts.free}</strong>
          </article>
          <article className="admin-summary-card">
            <span>Pro Monthly</span>
            <strong>{counts.pro_monthly}</strong>
          </article>
          <article className="admin-summary-card">
            <span>Pro Yearly</span>
            <strong>{counts.pro_yearly}</strong>
          </article>
          <article className="admin-summary-card">
            <span>Lifetime</span>
            <strong>{counts.pro_lifetime}</strong>
          </article>
        </div>

        <div className="admin-actions">
          <a
            className="button button-primary"
            href={`/api/waitlist/export?token=${encodeURIComponent(token)}`}
          >
            Export CSV
          </a>
          <a className="button button-secondary" href="/">
            Back to site
          </a>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Interest</th>
                <th>Source</th>
                <th>Joined</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {signups.length > 0 ? (
                signups.map((signup) => (
                  <tr key={signup.id}>
                    <td>{signup.email}</td>
                    <td>{waitlistInterestLabels[signup.interest]}</td>
                    <td>{signup.source}</td>
                    <td>{formatDate(signup.createdAt)}</td>
                    <td>{formatDate(signup.updatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="admin-table__empty" colSpan={5}>
                    No waitlist signups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
