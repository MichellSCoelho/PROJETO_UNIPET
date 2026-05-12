import { pool } from "../config/db.js";

export const criarTutor = async (req, res) => {
    const { nome, cpf, telefone, email } = req.body;
    if (!nome) return res.status(400).json({ erro: "Nome é obrigatório." });
    try {
        if (cpf) {
            const existe = await pool.query(
                "SELECT id FROM tutores WHERE cpf = $1", [cpf]
            );
            if (existe.rows.length > 0)
                return res.status(409).json({ erro: "CPF já cadastrado." });
        }
        const result = await pool.query(
            `INSERT INTO tutores (nome, cpf, telefone, email)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [nome, cpf || null, telefone || null, email || null]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const buscarTutores = async (req, res) => {
    const { q } = req.query;
    try {
        let query = "SELECT id, nome, cpf, telefone, email FROM tutores";
        let params = [];
        if (q) {
            query += " WHERE nome ILIKE $1 OR cpf LIKE $1 OR telefone LIKE $1";
            params.push(`%${q}%`);
        }
        query += " ORDER BY nome LIMIT 50";
        const result = await pool.query(query, params);
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const buscarTutorPorId = async (req, res) => {
    try {
        const tutor = await pool.query(
            "SELECT * FROM tutores WHERE id = $1", [req.params.id]
        );
        if (tutor.rows.length === 0)
            return res.status(404).json({ erro: "Tutor não encontrado." });

        const animais = await pool.query(
            "SELECT * FROM animais WHERE tutor_id = $1 ORDER BY nome",
            [req.params.id]
        );
        return res.json({ ...tutor.rows[0], animais: animais.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};