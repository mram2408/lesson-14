import { Router } from "express";
const router = Router();
import carsRoutes from "./cars.mjs";
import staticsRoutes from "./statics.mjs";
import usersRoutes from "./users.mjs";
import authRoutes from "./authRoutes.mjs";
import cartRoutes from "./cartRoutes.mjs";

router.use("/", staticsRoutes);
router.use("/autopark", carsRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);

export default router;
