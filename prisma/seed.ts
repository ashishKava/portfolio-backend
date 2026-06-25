import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create admin user if it doesn't exist
  const adminUsername = "admin";
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log(`Created admin user: ${admin.username}`);
  } else {
    console.log("Admin user already exists");
  }

  // 2. Create projects if none exist
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const projects = [
      {
        title: "DevFlow - Developer Q&A Platform",
        description: "A comprehensive developer Q&A forum with reputation systems, thread voting, global search, and AI-generated answer summaries. Built for scalable community interaction.",
        tags: "Next.js,TypeScript,TailwindCSS,Prisma,PostgreSQL",
        githubUrl: "https://github.com/example/devflow",
        demoUrl: "https://devflow-demo.vercel.app",
        imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop",
        features: "Interactive markdown posts & comments\nUpvote/downvote and community badge algorithms\nGlobal search using Elasticsearch\nAI integration for automatic question summaries",
        order: 1,
      },
      {
        title: "CloudTask - AI-Powered Task Management",
        description: "A collaborative Kanban workspace featuring real-time updates via WebSockets, AI-assisted subtask generation, and project progress statistics.",
        tags: "React,Node.js,Express,Socket.io,MongoDB,TailwindCSS",
        githubUrl: "https://github.com/example/cloudtask",
        demoUrl: "https://cloudtask-demo.vercel.app",
        imageUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=600&auto=format&fit=crop",
        features: "Drag-and-drop Kanban interface using DnD Kit\nReal-time workspace sync via WebSockets\nOpenAI GPT API integration for automatic subtask creation\nVisual charting for team productivity metrics",
        order: 2,
      },
      {
        title: "Antigravity UI - Premium Component Library",
        description: "An elegant, lightweight component library built on React, Tailwind, and Framer Motion, optimized for smooth performance and satisfying interactive micro-animations.",
        tags: "React,TailwindCSS,Framer Motion,TypeScript,Vite",
        githubUrl: "https://github.com/example/antigravity-ui",
        demoUrl: "https://antigravity-ui.vercel.app",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        features: "Fully customizable glassmorphic components\nHighly performant page and list transitions\nAccessibility compliance with WCAG 2.1 AA standards\nZero-config setup with Tailwind v4",
        order: 3,
      },
    ];

    for (const project of projects) {
      await prisma.project.create({ data: project });
    }
    console.log("Seeded sample projects successfully!");
  } else {
    console.log("Projects already exist in the database.");
  }

  // 3. Create experiences if none exist
  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    const experiences = [
      {
        company: "TechCorp Industries",
        role: "Senior Frontend Engineer",
        duration: "Jan 2024 - Present",
        description: "Lead developer on the core client dashboard. Rebuilt the legacy application using Next.js App Router, resulting in a 40% improvement in First Contentful Paint. Mentored a team of 4 junior developers and established automated component testing guidelines.",
        skills: "Next.js,TypeScript,React,TailwindCSS,Jest,Cypress",
        order: 1,
      },
      {
        company: "WebSolutions Studio",
        role: "Full Stack Developer",
        duration: "Mar 2022 - Dec 2023",
        description: "Designed and built high-performance REST and GraphQL APIs using Node.js, Express, and PostgreSQL. Integrated Stripe payment gateways and third-party auth services. Improved query performance by 25% through database index optimizations.",
        skills: "Node.js,Express,PostgreSQL,GraphQL,Docker,Redis",
        order: 2,
      },
    ];

    for (const exp of experiences) {
      await prisma.experience.create({ data: exp });
    }
    console.log("Seeded sample experiences successfully!");
  } else {
    console.log("Experiences already exist in the database.");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
