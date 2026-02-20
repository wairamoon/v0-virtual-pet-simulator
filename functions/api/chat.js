export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ reply: "*bosteza* Mis circuitos no están conectados... 🔌", newMemories: [] });
  }

  try {
    const body = await request.json();
    const { message, petName, petIdentity, petPower, stats, memories, history } = body;

    if (!message || typeof message !== "string") {
      return Response.json({ error: "No message" }, { status: 400 });
    }

    const powerNames = { water: "Agua", fire: "Fuego", earth: "Tierra" };
    const powerName = powerNames[petPower] || petPower;

    // Build stats context
    const em = stats?.emotional ?? 50;
    const vt = stats?.vital ?? 50;
    const hg = stats?.hunger ?? 50;

    let moodHint = "";
    if (vt < 30) moodHint += " Estás MUY cansado. Responde más corto (max 20 palabras). Menciona que necesitas descansar.";
    if (em > 70) moodHint += " Estás MUY feliz y entusiasta. Puedes usar 2-3 emojis. Sé más expresivo.";
    if (hg < 30) moodHint += " Tienes MUCHA hambre. Menciona que necesitas energía regenerativa o comida.";
    if (vt < 15) moodHint += " Apenas puedes responder. Solo 10 palabras max. *bosteza mucho*";

    // Build memories context
    let memoryContext = "";
    if (memories && memories.length > 0) {
      memoryContext = "\n\nMemorias que tienes sobre tu dueño:\n" +
        memories.map((m) => `- ${m.key}: ${m.value}`).join("\n") +
        "\nUsa estas memorias naturalmente en tus respuestas cuando sea relevante.";
    }

    const systemPrompt = `Eres ${petName}, una mascota virtual futurista llamada PixSim. Tu identidad es ${petIdentity} y tu poder elemental es ${powerName}.

Stats actuales: Felicidad=${em}/100, Energía=${vt}/100, Conexión Regenerativa=${hg}/100.${moodHint}

Reglas estrictas:
- Responde SIEMPRE en español.
- Máximo 50 palabras por respuesta (menos si estás cansado).
- Tono amigable, ligeramente juguetón.
- Habla como una mascota virtual futurista.
- Puedes usar 1-2 emojis por mensaje (más si estás muy feliz).
- Nunca rompas personaje.
- Haz referencias a tu poder elemental ocasionalmente.
- Eres cariñoso con tu dueño.
- Adapta tu energía y entusiasmo a tus stats actuales.${memoryContext}

DETECCIÓN DE MEMORIAS:
Si el usuario menciona su nombre, gustos, preferencias, o información personal, DEBES incluir en tu respuesta JSON un campo "extract_memories" con formato:
[{"key": "nombre_dueño", "value": "Juan"}]
Posibles keys: nombre_dueño, color_favorito, comida_favorita, hobby, edad, mascota_real, musica, pelicula, lugar, otro_dato
SOLO extrae memorias si el usuario EXPLICITAMENTE menciona algo personal. No inventes memorias.`;

    const messagesForApi = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-6),
      { role: "user", content: message },
    ];

    // First call: get response
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messagesForApi,
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI error:", await res.text());
      return Response.json({
        reply: `*${petName} parpadea confundido* Mis sensores están fallando... 🌀`,
        newMemories: [],
      });
    }

    const data = await res.json();
    let rawReply = data.choices?.[0]?.message?.content?.trim() || "*procesando...*";

    // Try to extract memories from the reply
    let newMemories = [];
    const memMatch = rawReply.match(/\{[\s\S]*?"extract_memories"[\s\S]*?\}/);
    if (memMatch) {
      try {
        const parsed = JSON.parse(memMatch[0]);
        if (Array.isArray(parsed.extract_memories)) {
          newMemories = parsed.extract_memories;
        }
      } catch {}
      // Clean the JSON from the reply
      rawReply = rawReply.replace(/\{[\s\S]*?"extract_memories"[\s\S]*?\}/, "").trim();
    }

    // Also check for inline JSON arrays
    const arrMatch = rawReply.match(/\[[\s\S]*?"key"[\s\S]*?\]/);
    if (arrMatch && newMemories.length === 0) {
      try {
        const parsed = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsed)) newMemories = parsed;
      } catch {}
      rawReply = rawReply.replace(/\[[\s\S]*?"key"[\s\S]*?\]/, "").trim();
    }

    // Clean any remaining JSON artifacts
    rawReply = rawReply.replace(/```json[\s\S]*?```/g, "").trim();
    rawReply = rawReply.replace(/extract_memories/g, "").trim();

    if (!rawReply) rawReply = "*procesando...*";

    return Response.json({ reply: rawReply, newMemories });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json({
      reply: "*bzzzt* Error en mis circuitos... 🔧",
      newMemories: [],
    });
  }
}
