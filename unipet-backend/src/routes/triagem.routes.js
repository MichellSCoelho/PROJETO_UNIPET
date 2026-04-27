import express from "express";
import { criarTriagem } from "../controllers/triagem.controller.js";

const router = express.Router();

router.post("/", criarTriagem);

export default router;