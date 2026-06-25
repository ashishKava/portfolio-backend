import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

const experienceSchema = z.object({
  body: z.object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    duration: z.string().min(1, "Duration is required"),
    description: z.string().min(1, "Description is required"),
    skills: z.string().min(1, "Skills list is required"),
    order: z.number().int().optional().default(0),
  }),
});

// GET /api/experiences - Public
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    res.status(200).json({ status: "success", data: experiences });
  } catch (error) {
    next(error);
  }
});

// POST /api/experiences - Protected
router.post(
  "/",
  authenticate as any,
  validate(experienceSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { company, role, duration, description, skills, order } = req.body;
      const experience = await prisma.experience.create({
        data: {
          company,
          role,
          duration,
          description,
          skills,
          order: order ?? 0,
        },
      });
      res.status(201).json({ status: "success", data: experience });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/experiences/:id - Protected
router.put(
  "/:id",
  authenticate as any,
  validate(experienceSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { company, role, duration, description, skills, order } = req.body;

      const existingExperience = await prisma.experience.findUnique({ where: { id } });
      if (!existingExperience) {
        res.status(404).json({ status: "fail", message: "Experience not found" });
        return;
      }

      const experience = await prisma.experience.update({
        where: { id },
        data: {
          company,
          role,
          duration,
          description,
          skills,
          order: order ?? 0,
        },
      });
      res.status(200).json({ status: "success", data: experience });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/experiences/:id - Protected
router.delete(
  "/:id",
  authenticate as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const existingExperience = await prisma.experience.findUnique({ where: { id } });
      if (!existingExperience) {
        res.status(404).json({ status: "fail", message: "Experience not found" });
        return;
      }

      await prisma.experience.delete({ where: { id } });
      res.status(200).json({ status: "success", message: "Experience deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
