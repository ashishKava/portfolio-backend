import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import experienceRoutes from "./routes/experiences";
import contactRoutes from "./routes/contacts";
import { errorHandler } from "./middleware/errorHandler";
import prisma from "./config/prisma";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Request logging (simple console log)
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: String(error) });
  }
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/contacts", contactRoutes);

// 404 route handling
app.use((req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("[DB] SQLite database connected successfully via Prisma.");

    app.listen(PORT, () => {
      console.log(`[Server] Portfolio backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[DB] Failed to connect to SQLite database:", error);
    process.exit(1);
  }
};

startServer();
