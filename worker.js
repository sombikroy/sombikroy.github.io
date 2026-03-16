// ── Cloudflare Worker — Anthropic API Proxy ──

export default {
  async fetch(request, env) {

    // CORS headers — allow all origins for now to debug
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Check API key is configured
    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured in Worker secrets' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      const body = await request.json();

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: body.model || 'claude-haiku-4-5-20251001',
          max_tokens: body.max_tokens || 1000,
          system: body.system,
          messages: body.messages,
        }),
      });

      const data = await response.json();

      // Forward exact status from Anthropic (helps debug auth errors etc)
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }
};
