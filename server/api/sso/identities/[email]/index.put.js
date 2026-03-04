import { authedFetch } from "../../../../utils/authedFetch";

export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");
  const body = await readBody(event);
  const { ssoBaseUrl } = useRuntimeConfig();

  try {
    return await authedFetch(event, ssoBaseUrl, `/identity/${encodeURIComponent(email)}`, {
      method: "PUT",
      body: body,
    });
  } catch (e) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message });
  }
});
