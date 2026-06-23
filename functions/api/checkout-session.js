export async function onRequestGet(context) {
  const sessionId = context.url.searchParams.get('session_id');
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'private, no-store',
  };

  if (!sessionId || !/^cs_(test|live)_/.test(sessionId)) {
    return new Response(JSON.stringify({ error: 'Invalid session_id' }), {
      status: 400,
      headers,
    });
  }

  const secretKey = context.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Payment lookup is not configured' }), {
      status: 503,
      headers,
    });
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Checkout session not found' }), {
        status: response.status === 404 ? 404 : 502,
        headers,
      });
    }

    const session = await response.json();
    const name = session.customer_details?.name || null;

    return new Response(JSON.stringify({ name }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to retrieve checkout session' }), {
      status: 500,
      headers,
    });
  }
}
