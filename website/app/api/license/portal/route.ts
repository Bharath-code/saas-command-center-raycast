import { NextResponse } from "next/server";

import { getDodoClient } from "../../../../lib/dodo";
import { getCustomerForLicense } from "../../../../lib/license-store";

export const runtime = "nodejs";

type PortalRequest = {
  licenseKeyId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PortalRequest;
    const licenseKeyId = body.licenseKeyId?.trim();

    if (!licenseKeyId) {
      return NextResponse.json(
        { error: "Missing license key reference." },
        { status: 400 },
      );
    }

    const stored = await getCustomerForLicense(licenseKeyId);

    if (!stored) {
      return NextResponse.json(
        { error: "We could not find that customer in the billing store yet." },
        { status: 404 },
      );
    }

    const portal = await getDodoClient().customers.customerPortal.create(
      stored.customer.dodoCustomerId,
      { send_email: false },
    );

    return NextResponse.json({ url: portal.link });
  } catch (error) {
    console.error("Failed to create portal session", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to open the billing portal right now.",
      },
      { status: 400 },
    );
  }
}
