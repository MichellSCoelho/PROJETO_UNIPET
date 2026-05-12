import express from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import { criarTriagem, listarFila, atualizarStatus, historicoAnimal, historicoGeral } from "../controllers/triagem.controller.js";

const router = express.Router();

router.post("/", autenticar, criarTriagem);
router.get("/fila", autenticar, listarFila);
router.get("/painel", listarFila);
router.get("/historico", autenticar, historicoGeral);
router.get("/historico/animal/:animalId", autenticar, historicoAnimal);
router.put("/:id/status", autenticar, atualizarStatus);

export default router;
