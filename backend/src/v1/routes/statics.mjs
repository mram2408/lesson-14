import { Router } from "express";
const router = Router();
import MainController from "../controllers/mainController.mjs";

router.get("/", MainController.index);
router.get("/about", MainController.about);

export default router;
