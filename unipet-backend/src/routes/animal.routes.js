import express from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import { criarAnimal, buscarAnimalPorId } from "../controllers/animal.controller.js";

const router = express.Router();

router.post("/", autenticar, criarAnimal);
router.get("/:id", autenticar, buscarAnimalPorId);

export default router;