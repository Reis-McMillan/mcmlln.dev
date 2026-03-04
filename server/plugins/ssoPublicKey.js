import { createPublicKey } from "node:crypto";
import { setSigningKey } from "../utils/verifyJwt";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  try {
    const data = await $fetch(`${config.ssoBaseUrl}/.well-known/jwks.json`);
    const jwk = data.keys[0];

    const key = createPublicKey({
      key: jwk,
      format: "jwk",
    });

    setSigningKey(key);
    console.log("[sso] Public signing key loaded");
  } catch (e) {
    console.error("[sso] Failed to load public signing key:", e.message);
  }
});
