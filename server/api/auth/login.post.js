export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.email) {
    throw createError({ statusCode: 400, message: "Email is required" });
  }

  const url = `${config.ssoBaseUrl}/verification/?email=${encodeURIComponent(body.email)}`;

  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    const detail = await response.text();
    throw createError({ statusCode: response.status, message: detail });
  }

  return { success: true };
});
