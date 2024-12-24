import express from "express";
import CartController from "../controllers/cartController.mjs";

const router = express.Router();

router.get("/", CartController.getCartDetails);
router.post("/", CartController.addProduct);
router.put("/", CartController.updateProductAmount);
router.delete("/", CartController.deleteProduct);

export default router;
