import { validateJwt } from "../utils/validateJwt";

export function useAuth() {
  const identity = useState("sso-identity", () => null);
  const jwt = useCookie("jwt", {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 5 * 60,
  });
  const isAuthenticated = computed(() => !!validateJwt(jwt.value));

  async function checkAuth() {
    if (validateJwt(jwt.value)) return true;

    try {
      const headers = import.meta.server ? useRequestHeaders(["cookie"]) : {};
      const data = await $fetch("/api/auth/jwt", { headers });
      jwt.value = data.token;
      identity.value = validateJwt(data.token);
      return true;
    } catch {
      jwt.value = null;
      identity.value = null;
      return false;
    }
  }

  async function login(email) {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email },
    });
  }

  async function verify(userEmail, code) {
    await $fetch("/api/auth/verify", {
      params: { email: userEmail, code },
    });
    const authed = await checkAuth();
    if (!authed) {
      throw new Error("Authentication failed");
    }
    return identity.value;
  }

  async function logout(scope = "local") {
    await $fetch("/api/auth/logout", { method: "POST", body: { scope } });
    identity.value = null;
    jwt.value = null;
    await navigateTo("/");
  }

  function hasRole(role) {
    return identity.value?.roles?.includes(role) ?? false;
  }

  return { identity, jwt, isAuthenticated, hasRole, checkAuth, login, verify, logout };
}
