import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const classificarPorRegras = (sintomas) => {
    const texto = sintomas.toLowerCase();

    const urgentes = [
        "convulsão", "convulsao", "não respira", "nao respira",
        "colapso", "hemorragia", "sangramento", "sangrando",
        "atropelado", "atropelada", "desmaio", "inconsciente",
        "cianose", "cianótico", "envenenamento", "intoxicação",
        "fratura exposta", "osso aparecendo", "parada",
        "dificuldade respiratória", "dispneia", "engasgado",
        "choque", "trauma", "queda de altura", "mordida de cobra",
        "não consegue respirar", "respiração difícil"
    ];

    const moderados = [
        "vômito", "vomito", "diarreia", "letargia", "letárgico",
        "febre", "dor intensa", "não come", "nao come",
        "fratura", "ferida", "inchaço", "machucado",
        "mancando", "claudicação", "urina com sangue",
        "dificuldade urinar", "tremor", "espasmo",
        "sem apetite", "apatia", "abatido", "fraco"
    ];

    if (urgentes.some(s => texto.includes(s)))
        return { prioridade:"URGENTE", justificativa:"Sinal crítico detectado — atendimento imediato necessário.", modo:"offline" };

    if (moderados.some(s => texto.includes(s)))
        return { prioridade:"MODERADO", justificativa:"Sintoma de atenção — atendimento prioritário em até 2 horas.", modo:"offline" };

    return { prioridade:"NORMAL", justificativa:"Sem sinais de urgência imediata.", modo:"offline" };
};

export const classificarTriagem = async ({ sintomas, tipo_animal, porte }) => {
    const prompt = `Você é um assistente de triagem veterinária especializado.

PACIENTE: ${tipo_animal || "Não informado"}, porte ${porte || "não informado"}
SINTOMAS: ${sintomas}

Classifique em URGENTE, MODERADO ou NORMAL seguindo estes critérios:
- URGENTE: risco de vida imediato (convulsão, dificuldade respiratória grave, hemorragia ativa, atropelamento, envenenamento, inconsciência, trauma grave)
- MODERADO: situação grave sem risco imediato (vômito/diarreia intensa, dor forte, feridas, fraturas sem exposição, letargia marcada)
- NORMAL: consulta de rotina, queixas leves, vacinas, revisões

Responda APENAS neste formato:
URGENTE: motivo objetivo
ou MODERADO: motivo objetivo
ou NORMAL: motivo objetivo`;

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role:"user", content: prompt }],
            temperature: 0.1,
            max_tokens: 150,
        });
        const texto = response.choices[0].message.content.trim();
        const match = texto.match(/^(URGENTE|MODERADO|NORMAL):\s*(.+)$/);
        if (!match) return classificarPorRegras(sintomas);
        return { prioridade: match[1], justificativa: match[2], modo:"openai" };
    } catch (erro) {
        console.warn("OpenAI indisponível, usando regras:", erro.message);
        return classificarPorRegras(sintomas);
    }
};
