import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha)
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 AND ativo = true",
            [email]
        );
        if (result.rows.length === 0)
            return res.status(401).json({ erro: "Email ou senha incorretos." });

        const usuario = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida)
            return res.status(401).json({ erro: "Email ou senha incorretos." });

        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};