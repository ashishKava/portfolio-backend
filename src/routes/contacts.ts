import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().optional().nullable(),
    message: z.string().min(10, "Message must be at least 10 characters long"),
  }),
});

// POST /api/contacts - Public (Send contact message)
router.post(
  "/",
  validate(contactSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, subject, message } = req.body;
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject: subject || null,
          message,
        },
      });
      res.status(201).json({ status: "success", data: submission });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/contacts - Protected (List contact messages)
router.get("/", authenticate as any, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ status: "success", data: submissions });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/contacts/:id/read - Protected (Toggle read status)
router.patch(
  "/:id/read",
  authenticate as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { read } = req.body; // pass true/false in request body

      const existingSubmission = await prisma.contactSubmission.findUnique({ where: { id } });
      if (!existingSubmission) {
        res.status(404).json({ status: "fail", message: "Submission not found" });
        return;
      }

      const submission = await prisma.contactSubmission.update({
        where: { id },
        data: { read: !!read },
      });
      res.status(200).json({ status: "success", data: submission });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/contacts/:id - Protected (Delete message)
router.delete(
  "/:id",
  authenticate as any,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const existingSubmission = await prisma.contactSubmission.findUnique({ where: { id } });
      if (!existingSubmission) {
        res.status(404).json({ status: "fail", message: "Submission not found" });
        return;
      }

      await prisma.contactSubmission.delete({ where: { id } });
      res.status(200).json({ status: "success", message: "Submission deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
