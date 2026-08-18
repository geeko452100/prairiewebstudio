/**
 * Server-side relay for the Prairie Dispatch API.
 *
 * The browser SDK (prairie-dispatch.js) posts here, same-origin, with no
 * credentials attached. This function holds the tenant's secret key
 * (PRAIRIE_SECRET_KEY, a Pages secret — never exposed to the browser) and
 * forwards the job to the real dispatch API server-to-server, as required
 * post secret-key cutover: https://dispatch.prairiewebstudio.com/api/v1/dispatch
 * rejects any request without a valid X-Prairie-Secret-Key header.
 */
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.text();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const upstream = await fetch('https://dispatch.prairiewebstudio.com/api/v1/dispatch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Prairie-Secret-Key': env.PRAIRIE_SECRET_KEY,
    },
    body,
  });

  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
