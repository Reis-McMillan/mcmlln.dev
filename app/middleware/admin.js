import { useAuth } from "~/composables/useAuth";
import { validateJwt } from "~/utils/validateJwt";

export default defineNuxtRouteMiddleware(async (to) => {
  const { jwt, isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }

  const payload = validateJwt(jwt.value);
  if (!payload?.roles?.includes("admin")) {
    return navigateTo({ path: "/unauthorized", query: { from: to.fullPath } });
  }
});
