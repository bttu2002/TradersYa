export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders(),
    });
  }

  // Remove /api/proxy from path — the remaining path already starts with /api/...
  const path = url.pathname.replace("/api/proxy", "");

  const targetUrl = `https://api.coinlore.net${path}${url.search}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}