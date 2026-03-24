export default {
  async fetch(request, env) {
    // Handle CORS (so your website can talk to this worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (request.method === "POST") {
      const { message } = await request.json();

      // System prompt to give the AI context about you
      const systemPrompt = "You are an AI assistant for Sombik Roy, a POD Plugin Developer and SAP DM Specialist. Answer professionally about his skills in JavaScript, Java, and System Integration.";

      try {
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        });

        return new Response(JSON.stringify({ response: response.response }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Send a POST request", { status: 400 });
  }
};
