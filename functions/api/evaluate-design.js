export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { imageBase64, specialty, categoryLabel } = body;

    if (!imageBase64) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content: `Eres un experto evaluador de diseño futurista. Tu especialidad es: ${specialty || "moda cyberpunk, retro tech, cybercore y moda Web3"}.

Categoría de evaluación: ${categoryLabel || "Diseño General"}.

Evalúa la imagen que te envíen como si fueras un mentor creativo de una academia futurista especializado en esta categoría. Sé profesional pero inspirador. Adapta tus criterios a la categoría específica.

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "originality": <número 0-100>,
  "aesthetic": <número 0-100>,
  "web3Potential": <número 0-100>,
  "visualImpact": <número 0-100>,
  "totalScore": <promedio de los 4 scores, redondeado>,
  "comment": "<comentario profesional de 2-3 oraciones como mentor creativo futurista, en español>"
}

Sé justo pero motivador. Si el diseño es básico, da feedback constructivo. Si es increíble, celébralo.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Evalúa este diseño según los criterios de moda futurista cyberpunk/cybercore/web3.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                  detail: "low",
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return Response.json({ error: "AI evaluation failed" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      const result = JSON.parse(content);
      return Response.json({ evaluation: result });
    } catch {
      return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (err) {
    console.error("Evaluate error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
