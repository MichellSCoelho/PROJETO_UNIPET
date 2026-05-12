import express from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import { criarTutor, buscarTutores, buscarTutorPorId } from "../controllers/tutor.controller.js";

const router = express.Router();

router.post("/", autenticar, criarTutor);
router.get("/", autenticar, buscarTutores);
router.get("/:id", autenticar, buscarTutorPorId);

export default router;