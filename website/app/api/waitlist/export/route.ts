import { NextResponse } from "next/server";

import { hasWaitlistAdminAccess } from "../../../../lib/admin-auth";
import { listWaitlistSignups } from "../../../../lib/waitlist-store";

export const runtime = "nodejs";

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!hasWaitlistAdminAccess(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const signups = await listWaitlistSignups();
  const header = ["email", "interest", "source", "created_at", "updated_at"];
  const rows = signups.map((signup) =>
    [
      signup.email,
      signup.interest,
      signup.source,
      signup.createdAt,
      signup.updatedAt,
    ]
      .map(escapeCsv)
      .join(","),
  );

  return new NextResponse([header.join(","), ...rows].join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="revcast-waitlist.csv"',
    },
  });
}
