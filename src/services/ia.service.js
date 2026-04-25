export const classificarTriagem = async ({ sintomas }) => {
    const texto = sintomas.toLowerCase();

    // 🔥 Regras críticas (hard rules)
    if (texto.includes("convulsão") || texto.includes("não respira")) {
        return "URGENTE";
    }

    if (texto.includes("vômito") || texto.includes("diarreia")) {
        return "MODERADO";
    }

    return "NORMAL";
};