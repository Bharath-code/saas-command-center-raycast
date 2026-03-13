import { NextResponse } from "next/server";

import { getDodoClient } from "../../../../lib/dodo";
import { getStoredLicense } from "../../../../lib/license-store";

export const runtime = "nodejs";

type ValidateRequest = {
  instanceId?: string;
  licenseKey?: string;
  licenseKeyId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidateRequest;
    const licenseKey = body.licenseKey?.trim();

    if (!licenseKey) {
      return NextResponse.json(
        { error: "Enter a license key." },
        { status: 400 },
      );
    }

    const result = await getDodoClient().licenses.validate({
      license_key: licenseKey,
      license_key_instance_id: body.instanceId?.trim() || undefined,
    });

    const storedLicense = body.licenseKeyId
      ? await getStoredLicense(body.licenseKeyId.trim())
      : null;

    return NextResponse.json({
      customerEmail: storedLicense?.customerEmail ?? null,
      licenseStatus: storedLicense?.licenseStatus ?? null,
      plan: storedLicense?.plan ?? null,
      subscriptionStatus: storedLicense?.subscriptionStatus ?? null,
      valid: result.valid,
    });
  } catch (error) {
    console.error("Failed to validate license", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to validate this license right now.",
      },
      { status: 400 },
    );
  }
}
