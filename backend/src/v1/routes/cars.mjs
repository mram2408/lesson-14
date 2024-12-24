import { Router } from "express";
const router = Router();

import CarController from "../controllers/carController.mjs";

router.get("/", CarController.autopark);

export default router;
