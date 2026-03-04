import { authedFetch } from "../../utils/authedFetch";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const scope = body?.scope ?? "local";
  const { ssoBaseUrl } = useRuntimeConfig();

  if (scope === "global") {
    try {
      await authedFetch(event, ssoBaseUrl, "/identity/logout", { method: "POST" });
    } catch {
      // Clear cookies even if SSO logout fails
    }
  }

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  };

  setCookie(event, "auth_token", "", cookieOpts);
  setCookie(event, "init_vector", "", cookieOpts);
  setCookie(event, "jwt", "", cookieOpts);

  return { success: true };
});
