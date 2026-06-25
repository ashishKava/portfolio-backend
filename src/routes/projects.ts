import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    tags: z.string().min(1, "At least one tag is required"),
    githubUrl: z.string().url("Invalid GitHub URL").optional().nullable().or(z.literal("")),
    demoUrl: z.string().url("Invalid Demo URL").optional().nullable().or(z.literal("")),
    imageUrl: z.string().url("Invalid Image URL").optional().nullable().or(z.literal("")),
    features: z.string().optional().nullable(),
    order: z.number().int().optional().default(0),
  }),
});

// GET /api/projects - Public
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Protected
router.post(
  "/",
  authenticate as any,
  validate(projectSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, tags, githubUrl, demoUrl, imageUrl, features, order } = req.body;
      const project = await prisma.project.create({
        data: {
          title,
          description,
          tags,
          githubUrl: githubUrl || null,
          demoUrl: demoUrl || null,
          imageUrl: imageUrl || null,
          features: features || null,
          order: order ?? 0,
        },
      });
      res.status(201).json({ status: "success", data: project });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/projects/:id - Protected
router.put(
  "/:id",
  authenticate as any,
  validate(projectSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, tags, githubUrl, demoUrl, imageUrl, features, order } = req.body;

      const existingProject = await prisma.project.findUnique({ where: { id } });
      if (!existingProject) {
        res.status(404).json({ status: "fail", message: "Project not found" });
        return;
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          title,
          description,
          tags,
          githubUrl: githubUrl || null,
          demoUrl: demoUrl || null,
          imageUrl: imageUrl || null,
          features: features || null,
          order: order ?? 0,
        },
      });
      res.status(200).json({ status: "success", data: project });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/projects/:id - Protected
router.delete(
  "/:id",
  authenticate as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const existingProject = await prisma.project.findUnique({ where: { id } });
      if (!existingProject) {
        res.status(404).json({ status: "fail", message: "Project not found" });
        return;
      }

      await prisma.project.delete({ where: { id } });
      res.status(200).json({ status: "success", message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
