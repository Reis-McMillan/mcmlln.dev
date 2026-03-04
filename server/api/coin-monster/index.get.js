export default defineEventHandler(async () => {
  const { coinMonsterUrl } = useRuntimeConfig();
  try {
    return await $fetch(`${coinMonsterUrl}/coins`);
  } catch (e) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message });
  }
});
