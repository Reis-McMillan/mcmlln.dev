import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, checkAuth } = useAuth();

  if (!isAuthenticated.value) {
    await checkAuth();
  }

  if (!isAuthenticated.value) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }
});
