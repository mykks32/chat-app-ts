import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import chatRouter from "./chat.route";
import userRouter from "./user.route";

const {
  BAD_REQUEST,
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  NOT_FOUND,
} = StatusCodes;

const baseRouter = () => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    res.status(OK).json({
      message: "Hello World",
    });
  });

  router.use("/rooms", chatRouter);
  router.use("/users", userRouter);

  router.use("*", (req: Request, res: Response) => {
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Route not found" });
  });

  return router;
};

export default baseRouter;
