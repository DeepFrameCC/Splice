export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({ ping: "pong", time: Date.now() }), {
    headers: { "content-type": "application/json" },
  });
}
