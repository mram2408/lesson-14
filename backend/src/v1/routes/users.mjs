import express from "express";
import UserController from "../controllers/userController.mjs";
import UserValidator from "../../../validators/userValidator.mjs";
import { checkSchema } from "express-validator";
// import UploadManager from '../utils/UploadManager.mjs'

const router = express.Router();

router.get("/", UserController.usersList);

router.get("/register/:id?", UserController.registerForm);

router.post(
  "/register/:id?",
  // UploadManager.single('userImg'),
  checkSchema(UserValidator.userSchema),
  // UserValidator.checkFile,
  UserController.registerUser
);

router.delete("/", UserController.deleteUser);

export default router;
