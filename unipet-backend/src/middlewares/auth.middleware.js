import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const autenticar = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Token não fornecido." });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch {
        return res.status(401).json({ erro: "Token inválido ou expirado." });
    }
};