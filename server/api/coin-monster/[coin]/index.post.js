import { authedFetch } from "../../../utils/authedFetch";

export default defineEventHandler(async (event) => {
  const coin = getRouterParam(event, "coin");
  const { coinMonsterUrl } = useRuntimeConfig();
  try {
    return await authedFetch(event, coinMonsterUrl, `/coins/${encodeURIComponent(coin)}`, {
      method: "POST",
    });
  } catch (e) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message });
  }
});
