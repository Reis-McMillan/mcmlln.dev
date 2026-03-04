function parseCookieValue(setCookieHeaders, name) {
  for (const header of setCookieHeaders) {
    if (header.startsWith(`${name}=`)) {
      const value = header.split("=")[1].split(";")[0];
      return value;
    }
  }
  return null;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  if (!query.email || !query.code) {
    throw createError({ statusCode: 400, message: "Email and code are required" });
  }

  // Call SSO verification — use native fetch to access Set-Cookie headers
  const verifyUrl = `${config.ssoBaseUrl}/verification/?email=${encodeURIComponent(query.email)}&code=${encodeURIComponent(query.code)}`;
  const verifyResponse = await fetch(verifyUrl);

  if (!verifyResponse.ok) {
    const detail = await verifyResponse.text();
    throw createError({ statusCode: verifyResponse.status, message: detail });
  }

  // Extract token and token_iv from Set-Cookie headers
  const setCookieHeaders = verifyResponse.headers.getSetCookie();
  const authToken = parseCookieValue(setCookieHeaders, "token");
  const initVector = parseCookieValue(setCookieHeaders, "token_iv");

  if (!authToken || !initVector) {
    throw createError({ statusCode: 500, message: "Missing auth cookies from SSO response" });
  }

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 24 * 60 * 60, // 60 days, matching SSO AUTHENTICATION_TTL
  };

  setCookie(event, "auth_token", authToken, cookieOpts);
  setCookie(event, "init_vector", initVector, cookieOpts);

  return { success: true };
});
