import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
} from "@controllers/user.controller";
import { authMiddleware } from "@middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getAllUsers);
router.get("/:userId", authMiddleware, getUserById);

export default router;
