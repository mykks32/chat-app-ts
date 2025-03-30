import { createOrGetRoomMessage } from "@controllers/room.controller";
import { Router } from "express";

const router = Router();

router.post("/", createOrGetRoomMessage);

export default router;