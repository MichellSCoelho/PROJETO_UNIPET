import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fallback offline se a API cair
const classificarPorRegras = (sintomas) => {
    const texto = sintomas.toLowerCase();

    const urgentes = ["convulsão", "não respira", "colapso", "hemorragia",
        "desmaio", "cianose", "envenenamento", "inconsciente"];
    const moderados = ["vômito", "diarreia", "letargia", "febre",
        "dor intensa", "não come", "fratura"];

    if (urgentes.some(s => texto.includes(s)))
        return { prioridade: "URGENTE", justificativa: "Sinal crítico detectado (modo offline).", modo: "offline" };

    if (moderados.some(s => texto.includes(s)))
        return { prioridade: "MODERADO", justificativa: "Sintoma de atenção detectado (modo offline).", modo: "offline" };

    return { prioridade: "NORMAL", justificativa: "Sem urgência imediata (modo offline).", modo: "offline" };
};

export const classificarTriagem = async ({ sintomas, tipo_animal, porte }) => {
    const prompt = `Você é um assistente de triagem veterinária.

DADOS DO PACIENTE:
- Tipo: ${tipo_animal || "Não informado"}
- Porte: ${porte || "Não informado"}
- Sintomas: ${sintomas}

Classifique em exatamente uma das categorias:
- URGENTE: risco de vida imediato
- MODERADO: requer atenção em até 2 horas
- NORMAL: sem urgência

Responda APENAS neste formato:
URGENTE: motivo
ou MODERADO: motivo
ou NORMAL: motivo`;

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 150,
        });

        const texto = response.choices[0].message.content.trim();
        const match = texto.match(/^(URGENTE|MODERADO|NORMAL):\s*(.+)$/);

        if (!match) return classificarPorRegras(sintomas);

        return {
            prioridade: match[1],
            justificativa: match[2],
            modo: "openai"
        };

    } catch (erro) {
        console.warn("OpenAI indisponível, usando regras offline:", erro.message);
        return classificarPorRegras(sintomas);
    }
};