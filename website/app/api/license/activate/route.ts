import { NextResponse } from "next/server";

import { getPlanForProduct, getDodoClient } from "../../../../lib/dodo";
import { syncLicenseKeyRecord } from "../../../../lib/license-store";

export const runtime = "nodejs";

type ActivateRequest = {
  instanceName?: string;
  licenseKey?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ActivateRequest;
    const instanceName = body.instanceName?.trim();
    const licenseKey = body.licenseKey?.trim();

    if (!instanceName || !licenseKey) {
      return NextResponse.json(
        { error: "Enter your license key and a device name." },
        { status: 400 },
      );
    }

    const dodo = getDodoClient();
    const activation = await dodo.licenses.activate({
      license_key: licenseKey,
      name: instanceName,
    });

    const plan = getPlanForProduct(activation.product.product_id);

    if (!plan) {
      return NextResponse.json(
        { error: "This license key is not mapped to a Revcast paid plan." },
        { status: 403 },
      );
    }

    const synced = await syncLicenseKeyRecord(dodo, activation.license_key_id);

    return NextResponse.json({
      customerEmail: activation.customer.email,
      customerName: activation.customer.name,
      instanceId: activation.id,
      instanceName: activation.name,
      licenseKeyId: activation.license_key_id,
      licenseStatus: synced?.licenseKey.status ?? "active",
      plan,
      productId: activation.product.product_id,
      subscriptionStatus: null,
    });
  } catch (error) {
    console.error("Failed to activate license", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to activate this license right now.",
      },
      { status: 400 },
    );
  }
}
