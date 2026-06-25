import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { validate } from "../middleware/validation";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_change_me_in_prod";

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        res.status(401).json({
          status: "fail",
          message: "Invalid username or password",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          status: "fail",
          message: "Invalid username or password",
        });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        status: "success",
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/me (Verify token)
router.get(
  "/me",
  authenticate as any,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: "success",
        user: {
          id: req.userId,
          username: req.username,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
