import express from "express";
import connectDB from "@bootstrap/database";
import cors from "cors";
import baseRouter from "@routes";
import { createServer } from "http";
import { initializeSocket } from "@bootstrap/socket";

// Get app
const getApp = async () => {
  // Create express app
  const app = express();

  // Create http server
  const httpServer = createServer(app);

  // Connect to database
  await connectDB();

  // CORS
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  // Initialize socket
  initializeSocket(httpServer);

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check route
  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  // Base router
  app.use("/api", baseRouter());

  // Return app and http server
  return { app, httpServer };
};

export default getApp;
