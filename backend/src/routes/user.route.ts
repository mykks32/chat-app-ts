import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserInfo,
} from "@controllers/user.controller";
import { authMiddleware } from "@middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getAllUsers);
router.get("/me", authMiddleware, getUserInfo);

export default router;
