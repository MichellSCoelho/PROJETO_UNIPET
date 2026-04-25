import { classificarTriagem } from "../services/ia.service.js";

export const criarTriagem = async (req, res) => {
    try {
        const { sintomas, tipo_animal, porte } = req.body;

        const classificacao = await classificarTriagem({
            sintomas,
            tipo_animal,
            porte,
        });

        res.json({
            sucesso: true,
            classificacao,
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar triagem" });
    }
};