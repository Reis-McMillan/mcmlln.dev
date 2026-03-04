async function refreshJwt(event) {
  const config = useRuntimeConfig();
  const authToken = getCookie(event, "auth_token");
  const initVector = getCookie(event, "init_vector");

  if (!authToken || !initVector) return null;

  const response = await fetch(`${config.ssoBaseUrl}/jwt/`, {
    headers: {
      "X-Auth-Token": authToken,
      "X-Init-Vector": initVector,
    },
  });

  if (!response.ok) return null;

  const data = await response.json();

  setCookie(event, "jwt", data.token, {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 5 * 60,
  });

  return data.token;
}

export async function authedFetch(event, url, path, options = {}) {
  let jwt = getCookie(event, "jwt");

  const makeHeaders = (token) => ({
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  try {
    return await $fetch(`${url}${path}`, {
      ...options,
      headers: makeHeaders(jwt),
    });
  } catch (e) {
    if (e.statusCode !== 401) throw e;

    jwt = await refreshJwt(event);
    if (!jwt) throw e;

    return $fetch(`${url}${path}`, {
      ...options,
      headers: makeHeaders(jwt),
    });
  }
}
