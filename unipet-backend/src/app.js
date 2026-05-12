import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import triagemRoutes from "./routes/triagem.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import animalRoutes from "./routes/animal.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API UNIPET rodando 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/triagens", triagemRoutes);
app.use("/api/tutores", tutorRoutes);
app.use("/api/animais", animalRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});