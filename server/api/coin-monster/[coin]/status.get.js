export default defineEventHandler(async (event) => {
  const coin = getRouterParam(event, "coin");
  const { coinMonsterUrl } = useRuntimeConfig();
  try {
    return await $fetch(`${coinMonsterUrl}/coins/${encodeURIComponent(coin)}/status`);
  } catch (e) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message });
  }
});
