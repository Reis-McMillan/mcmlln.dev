import { authedFetch } from "../../../../utils/authedFetch";

export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");
  const { ssoBaseUrl } = useRuntimeConfig();
  
  try {
    return await authedFetch(
      event,
      ssoBaseUrl,
      `/identity/${encodeURIComponent(email)}`
    );
  } catch (e) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message });
  }
});
