import { verify } from "node:crypto";

let signingKey = null;

export function setSigningKey(key) {
  signingKey = key;
}

function base64UrlDecode(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function verifyJwt(token) {
  if (!signingKey) {
    throw createError({ statusCode: 500, message: "Signing key not available" });
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw createError({ statusCode: 401, message: "Invalid token format" });
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const data = Buffer.from(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const valid = verify(null, data, signingKey, signature);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Invalid token signature" });
  }

  const payload = JSON.parse(base64UrlDecode(payloadB64).toString());

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw createError({ statusCode: 401, message: "Token expired" });
  }

  return payload;
}
