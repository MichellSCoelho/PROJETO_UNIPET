import { pool } from "../config/db.js";

export const criarAnimal = async (req, res) => {
    const { tutorId, nome, especie, raca, sexo, pesoKg, porte } = req.body;
    if (!tutorId || !nome || !especie)
        return res.status(400).json({ erro: "Tutor, nome e espécie são obrigatórios." });
    try {
        const result = await pool.query(
            `INSERT INTO animais (tutor_id, nome, especie, raca, sexo, peso_kg, porte)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [tutorId, nome, especie, raca || null, sexo || null, pesoKg || null, porte || null]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const buscarAnimalPorId = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, t.nome as tutor_nome, t.telefone as tutor_telefone
             FROM animais a JOIN tutores t ON a.tutor_id = t.id
             WHERE a.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ erro: "Animal não encontrado." });

        const historico = await pool.query(
            `SELECT id, prioridade_ia, sintomas, status, criado_em
             FROM triagens WHERE animal_id = $1
             ORDER BY criado_em DESC LIMIT 10`,
            [req.params.id]
        );
        return res.json({ ...result.rows[0], historico: historico.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};