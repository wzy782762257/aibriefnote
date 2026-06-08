function unauthorized(message = "Authentication required") {
  return new Response(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AI Brief Note Admin", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}

export async function onRequest(context) {
  const expectedUser = context.env.ADMIN_USER;
  const expectedPassword = context.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new Response("Admin auth is not configured. Set ADMIN_USER and ADMIN_PASSWORD in Cloudflare Pages.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  const auth = context.request.headers.get("Authorization") || "";
  if (!auth.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";
  try {
    decoded = atob(auth.slice("Basic ".length));
  } catch (error) {
    return unauthorized("Invalid authentication header");
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return unauthorized("Invalid authentication format");
  }

  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  const isValid = timingSafeEqual(user, expectedUser) && timingSafeEqual(password, expectedPassword);

  if (!isValid) {
    return unauthorized();
  }

  const response = await context.next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
