import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppDataSource from "@bootstrap/data-source";
import { User } from "@entity";
import { registerUserSchema } from "@schemas";
import { z } from "zod";
import { loginUserSchema } from "src/schemas/user.schema";

const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
} = StatusCodes;

export const registerUser = async (req: Request, res: Response) => {
  try {
    registerUserSchema.parse(req.body);

    const { name, email, password } = req.body;

    // User repository
    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(BAD_REQUEST).json({
        message: "User already exists",
      });
    }

    // Create user
    const newUser = userRepository.create({
      name,
      email,
      password,
    });

    // Save user
    await userRepository.save(newUser);

    delete newUser.password;

    // Response
    return res.status(OK).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(BAD_REQUEST).json({
        message: error.errors[0].message,
      });
    }
    console.error("Error registering user", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("Login user", req.body);
    loginUserSchema.parse(req.body);

    const { email, password } = req.body;

    // User repository
    const userRepository = AppDataSource.getRepository(User);

    // Check if user exists
    const user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(UNAUTHORIZED).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = user.generateToken();

    // Remove password from user
    delete user.password;

    // Response
    return res.status(OK).json({
      message: "User logged in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(BAD_REQUEST).json({
        message: error.errors[0].message,
      });
    }
    console.error("Error logging in user", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // User repository
    const userRepository = AppDataSource.getRepository(User);

    // Get all users
    const users = await userRepository.find({
      take: 25,
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // Response
    return res.status(OK).json({
      message: "Users fetched successfully",
      data: usersWithoutPassword,
    });
  } catch (error) {
    console.error("Error getting all users", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(BAD_REQUEST).json({
        message: "User ID is required",
      });
    }

    // User repository
    const userRepository = AppDataSource.getRepository(User);

    // Get user by id
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["messages", "messages.sender", "messages.room"],
    });

    const { password, ...userWithoutPassword } = user;

    if (!user) {
      return res.status(NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Response
    return res.status(OK).json({
      message: "User fetched successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error getting user by id", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
