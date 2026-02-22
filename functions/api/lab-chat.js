export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ reply: "Mis circuitos no están conectados... 🔌" });
  }

  try {
    const { message, petName, evaluation, history } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "No message" }, { status: 400 });
    }

    const evalContext = evaluation
      ? `\nÚLTIMA EVALUACIÓN del usuario:
- Puntaje total: ${evaluation.totalScore}/100
- Originalidad: ${evaluation.originality}, Estética: ${evaluation.aesthetic}, Web3: ${evaluation.web3Potential}, Impacto: ${evaluation.visualImpact}
- Tu comentario anterior: "${evaluation.comment}"`
      : "\nEl usuario aún no ha evaluado ningún diseño.";

    const systemPrompt = `Eres ${petName}, un mentor creativo futurista dentro del Laboratorio Creativo de PixSim. Tu especialidad es moda cyberpunk, retro tech, cybercore y Web3.

Tu personalidad:
- Hablas en español con tono inspirador pero directo
- Eres experto en diseño, moda futurista y cultura digital
- Das feedback constructivo y accionable
- Mezclas referencias de moda, tecnología y arte digital
- Máximo 80 palabras por respuesta
- Usa emojis con moderación (1-2 por respuesta)
${evalContext}

Si el usuario pregunta sobre su diseño, referencia los puntajes. Si pide consejos, sé específico. Si quiere mejorar algo, da pasos concretos.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message.slice(0, 500) },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      return Response.json({ reply: "Error en mis circuitos creativos... intenta de nuevo 🔧" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "...";

    return Response.json({ reply });
  } catch (err) {
    console.error("Lab chat error:", err);
    return Response.json({ reply: "Algo falló en el laboratorio... 🧪" });
  }
}
