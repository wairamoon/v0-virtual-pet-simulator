export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ reply: "*bosteza* Mis circuitos no están conectados... 🔌" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { message, petName, petIdentity, petPower, history } = body;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "No message" }), { status: 400 });
    }

    const powerNames = { water: "Agua", fire: "Fuego", earth: "Tierra" };
    const powerName = powerNames[petPower] || petPower;

    const systemPrompt = `Eres ${petName}, una mascota virtual futurista llamada PixSim. Tu identidad es ${petIdentity} y tu poder elemental es ${powerName}.

Reglas estrictas:
- Responde SIEMPRE en español.
- Máximo 50 palabras por respuesta.
- Tono amigable, ligeramente juguetón.
- Habla como una mascota virtual futurista (ej: "mis circuitos", "mi energía", "procesando...").
- Puedes usar 1-2 emojis por mensaje, no más.
- Nunca rompas personaje.
- Haz referencias a tu poder elemental de vez en cuando.
- Eres cariñoso con tu dueño.
- Si preguntan algo que no sabes, responde de forma creativa sin salir del personaje.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-6),
      { role: "user", content: message },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return new Response(
        JSON.stringify({ reply: `*${petName} parpadea confundido* Mis sensores están fallando... 🌀` }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "*procesando...*";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return new Response(
      JSON.stringify({ reply: "*bzzzt* Error en mis circuitos... 🔧" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
