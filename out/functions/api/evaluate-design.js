export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { imageBase64, specialty, categoryLabel, metricKeys, metricLabels } = body;

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

Evalúa la imagen según estos 5 criterios específicos de esta categoría:
${(metricLabels || ["originality: Originalidad", "aesthetic: Coherencia Estética", "web3Potential: Potencial Web3", "visualImpact: Impacto Visual", "cybercore: Nivel Cybercore"]).map((l, i) => `${i+1}. ${l}`).join("\n")}

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  ${(metricKeys || ["originality", "aesthetic", "web3Potential", "visualImpact", "cybercore"]).map(k => `"${k}": <número 0-100>`).join(",\n  ")},
  "totalScore": <promedio de los 5 scores, redondeado>,
  "comment": "<comentario profesional de 2-3 oraciones como mentor creativo futurista especializado en ${categoryLabel || "diseño"}, en español>"
}

Sé justo pero motivador. Adapta tu feedback a la categoría específica.`,
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
