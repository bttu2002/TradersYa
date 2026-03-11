export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/proxy', '/api');
  
  // Provide full path including query params
  const targetUrl = `https://api.coinlore.net${path}${url.search}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
