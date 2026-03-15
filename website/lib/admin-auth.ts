import crypto from "node:crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasWaitlistAdminAccess(token: string | null | undefined) {
  const expected = process.env.WAITLIST_ADMIN_TOKEN?.trim();

  if (!expected || !token) {
    return false;
  }

  return safeEqual(token, expected);
}
