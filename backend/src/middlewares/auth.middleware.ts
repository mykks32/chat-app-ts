import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const { UNAUTHORIZED } = StatusCodes;

export interface JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({
      message: "Invalid token",
    });
  }
};
