'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Cache-Control': 'private, no-store',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId || !/^cs_(test|live)_/.test(sessionId)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid session_id' }),
    };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      statusCode: 503,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Payment lookup is not configured' }),
    };
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
      return {
        statusCode: response.status === 404 ? 404 : 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Checkout session not found' }),
      };
    }

    const session = await response.json();
    const name = session.customer_details?.name || null;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ name }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Failed to retrieve checkout session' }),
    };
  }
};
