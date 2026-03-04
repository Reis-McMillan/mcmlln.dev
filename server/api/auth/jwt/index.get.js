export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authToken = getCookie(event, "auth_token");
  const initVector = getCookie(event, "init_vector");

  if (!authToken || !initVector) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const response = await fetch(`${config.ssoBaseUrl}/jwt/`, {
    headers: {
      "X-Auth-Token": authToken,
      "X-Init-Vector": initVector,
    },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: "Failed to get JWT" });
  }

  const data = await response.json();

  setCookie(event, "jwt", data.token, {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 5 * 60, // 5 minutes, matching SSO JWT_EXPIRY
  });

  return { token: data.token };
});
