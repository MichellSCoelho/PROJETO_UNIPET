import { pool } from "../config/db.js";
import { classificarTriagem } from "../services/ia.service.js";

export const criarTriagem = async (req, res) => {
    const { animalId, sintomas, temperatura, mucosas, dorAparente, historicoRelevante } = req.body;
    if (!animalId || !sintomas)
        return res.status(400).json({ erro: "Animal e sintomas são obrigatórios." });
    try {
        const animalResult = await pool.query(
            `SELECT a.*, t.nome as tutor_nome FROM animais a
             JOIN tutores t ON a.tutor_id = t.id WHERE a.id = $1`,
            [animalId]
        );
        if (animalResult.rows.length === 0)
            return res.status(404).json({ erro: "Animal não encontrado." });
        const animal = animalResult.rows[0];
        const classificacao = await classificarTriagem({
            sintomas, tipo_animal: animal.especie, porte: animal.porte,
        });
        const result = await pool.query(
            `INSERT INTO triagens
             (animal_id, sintomas, temperatura, prioridade_ia, justificativa_ia, status)
             VALUES ($1,$2,$3,$4,$5,'aguardando') RETURNING *`,
            [animalId, sintomas, temperatura||null, classificacao.prioridade, classificacao.justificativa]
        );
        return res.status(201).json({
            triagem: result.rows[0], classificacao,
            animal: { nome: animal.nome, especie: animal.especie, tutor: animal.tutor_nome },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const listarFila = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.id, t.sintomas, t.prioridade_ia as prioridade,
                t.justificativa_ia, t.status, t.temperatura, t.criado_em,
                a.nome as animal_nome, a.especie, a.porte,
                tu.nome as tutor_nome
            FROM triagens t
            JOIN animais a ON t.animal_id = a.id
            JOIN tutores tu ON a.tutor_id = tu.id
            WHERE t.status IN ('aguardando','em_atendimento')
            ORDER BY
                CASE t.prioridade_ia
                    WHEN 'URGENTE' THEN 1
                    WHEN 'MODERADO' THEN 2
                    WHEN 'NORMAL' THEN 3
                END, t.criado_em ASC
        `);
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const atualizarStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validos = ["aguardando","em_atendimento","concluido","cancelado"];
    if (!validos.includes(status))
        return res.status(400).json({ erro: "Status inválido." });
    try {
        const result = await pool.query(
            `UPDATE triagens SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ erro: "Triagem não encontrada." });
        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const historicoAnimal = async (req, res) => {
    const { animalId } = req.params;
    try {
        const animal = await pool.query(
            `SELECT a.*, t.nome as tutor_nome, t.telefone as tutor_telefone
             FROM animais a JOIN tutores t ON a.tutor_id = t.id
             WHERE a.id = $1`, [animalId]
        );
        if (animal.rows.length === 0)
            return res.status(404).json({ erro: "Animal não encontrado." });

        const triagens = await pool.query(
            `SELECT id, sintomas, temperatura, prioridade_ia, justificativa_ia,
                status, criado_em
             FROM triagens WHERE animal_id = $1
             ORDER BY criado_em DESC`,
            [animalId]
        );
        return res.json({ animal: animal.rows[0], triagens: triagens.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};

export const historicoGeral = async (req, res) => {
    const { pagina = 1, limite = 20, prioridade, busca, dataInicio, dataFim } = req.query;
    const offset = (pagina - 1) * limite;
    try {
        let where = `WHERE t.status = 'concluido'`;
        let params = [];
        let idx = 1;
        if (prioridade) { where += ` AND t.prioridade_ia = $${idx++}`; params.push(prioridade); }
        if (busca) { where += ` AND (a.nome ILIKE $${idx} OR tu.nome ILIKE $${idx++})`; params.push(`%${busca}%`); }
        if (dataInicio) { where += ` AND t.criado_em >= $${idx++}`; params.push(dataInicio); }
        if (dataFim) { where += ` AND t.criado_em <= $${idx++}`; params.push(dataFim); }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM triagens t
             JOIN animais a ON t.animal_id = a.id
             JOIN tutores tu ON a.tutor_id = tu.id ${where}`, params
        );
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limite), offset);
        const result = await pool.query(
            `SELECT t.id, t.sintomas, t.temperatura, t.prioridade_ia,
                t.justificativa_ia, t.status, t.criado_em,
                a.id as animal_id, a.nome as animal_nome, a.especie, a.porte,
                tu.nome as tutor_nome, tu.telefone as tutor_telefone
             FROM triagens t
             JOIN animais a ON t.animal_id = a.id
             JOIN tutores tu ON a.tutor_id = tu.id
             ${where}
             ORDER BY t.criado_em DESC
             LIMIT $${idx} OFFSET $${idx+1}`,
            params
        );
        return res.json({
            triagens: result.rows, total,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limite)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno." });
    }
};
