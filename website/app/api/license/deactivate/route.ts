import { NextResponse } from "next/server";

import { getDodoClient } from "../../../../lib/dodo";

export const runtime = "nodejs";

type DeactivateRequest = {
  instanceId?: string;
  licenseKey?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeactivateRequest;
    const instanceId = body.instanceId?.trim();
    const licenseKey = body.licenseKey?.trim();

    if (!instanceId || !licenseKey) {
      return NextResponse.json(
        { error: "Missing license key or activation instance." },
        { status: 400 },
      );
    }

    await getDodoClient().licenses.deactivate({
      license_key: licenseKey,
      license_key_instance_id: instanceId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to deactivate license", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to deactivate this license right now.",
      },
      { status: 400 },
    );
  }
}
