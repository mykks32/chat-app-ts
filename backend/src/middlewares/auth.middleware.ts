import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import AppDataSource from "@bootstrap/data-source";
import { User } from "@entity";
import { IUser } from "@interfaces";
const { UNAUTHORIZED } = StatusCodes;

export interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    if (!decoded.id) {
      return res.status(UNAUTHORIZED).json({
        message: "Invalid token",
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(UNAUTHORIZED).json({
        message: "User not found",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({
      message: "Invalid token",
    });
  }
};
