import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started for Ashish Kava's resume data...");

  // 1. Clean existing database records
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.contactSubmission.deleteMany();

  console.log("Cleaned previous data.");

  // 2. Create default Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt); // default password is admin123

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log(`Created admin user with username: ${admin.username} and password: admin123`);

  // 3. Create Projects from Resume
  const projectsData = [
    {
      title: "Seen Jeem",
      description: "A real-time collaborative game platform built using the MERN Stack, supporting high concurrency for web and mobile players.",
      tags: "ReactJS,Node.js,Express.js,MongoDB,WebSockets,MERN",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
      features: "Real-time game synchronization and status tracking via WebSockets\nBackend logic optimized for performance and concurrent users load\nMongoDB updates and queries implementation for live game state, progress tracking & leaderboards\nStreamlined UI/UX design with mobile and web responsive styling",
      order: 1,
    },
    {
      title: "Prompass",
      description: "A vendor-facing admin campaign platform that enables promotions management, tracking campaign performance, and user analytics.",
      tags: "ReactJS,Node.js,Express.js,MongoDB,AWS,MERN",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      features: "Dynamic vendor interfaces to manage promotional packages, track key campaign metrics & views\nFull-scale MERN vendor admin panel with rich analytics representation\nBackend campaign operations API services using Express.js\nAWS integration for deployment ensuring high availability and scalability",
      order: 2,
    },
    {
      title: "Cred Mantra",
      description: "A responsive web application allowing users to request, process, and manage educational and organization certificate verifications online.",
      tags: "ReactJS,Node.js,Prisma,PostgreSQL,PayPal,JWT",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      features: "Secure and scalable RESTful API with Node.js and Prisma ORM\nStructured database models using PostgreSQL for student records & credentials\nJWT-based secure authentication for students and institutional clients\nIntegration with PayPal payment gateway for secure transactions processing",
      order: 3,
    },
    {
      title: "Vital Step",
      description: "A mobile-first medical and health platform focusing on appointment bookings, doctor-patient interactions, and records storage.",
      tags: "ReactJS,Express.js,MongoDB,JWT,UI/UX",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      features: "Responsive, scalable UI in ReactJS prioritizing user-centric health data visibility\nExpress.js endpoints supporting appointment bookings, patient records, and profiles\nMongoDB schemas configured for flexible storage of doctor-patient logs\nJWT authentication guaranteeing secure access to sensitive medical profiles",
      order: 4,
    },
    {
      title: "Ride Rove",
      description: "A dynamic car service and appointment booking application that allows users to easily book services and view available service options.",
      tags: "React,Node.js,Express,MongoDB,JWT",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
      features: "Interactive booking form flow and service slots scheduler\nRESTful APIs handling user appointments, car services inventory, and providers schedules\nMongoDB integration for user profiles, transaction entries, and booking statuses\nSecure user authentication utilizing JSON Web Tokens",
      order: 5,
    },
    {
      title: "Westfield",
      description: "A robust backend system and microservices architecture supporting client stakeholders with emergent technical issue tracking and resolution.",
      tags: "React,Node.js,Prisma,AWS,PostgreSQL,Ruby on Rails",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      features: "RESTful web services with Express for a distributed microservices environment\nPrisma ORM integration in TypeScript for robust database schemas on PostgreSQL\nDeployed backend modules on AWS EC2 servers and managed S3 content storage\nLegacy codebase refactoring for optimal reliability and maintenance",
      order: 6,
    },
    {
      title: "Simple Plan",
      description: "A bespoke internal tool optimized for project management operations, streamlining data tracking and secure operations.",
      tags: "React,Sequelize,Node.js,PostgreSQL,AWS,GraphQL,Material-UI",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      features: "Optimized tool workflow improving general project management by 30%\nInteractive, data-driven dashboards reducing asset data processing time by 40%\nGoogle APIs authentication integration securing frontend and backend channels by 25%\nRole-based API routing using Express, Sequelize ORM, and PostgreSQL",
      order: 7,
    },
    {
      title: "Viapromeds",
      description: "An API-driven logistics tracking system featuring third-party webhook integrations and WebSocket notifications.",
      tags: "Node.js,Express,PostgreSQL,ShipEngine API,WebSockets",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
      features: "Integration of ShipEngine webhooks for automatic shipment status synchronizations\nReal-time notifications sent via WebSocket connections to alert clients of shipping status updates\nHighly optimized REST APIs handling high-frequency webhooks payloads",
      order: 8,
    },
    {
      title: "HDFC Ergo App",
      description: "A desktop support application designed for the sales and tele-department teams to manage client queries and product sales.",
      tags: "React,Electron,Git,Jest,UI Optimization",
      githubUrl: "https://github.com/ashishkava1108",
      demoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
      features: "UI performance optimizations achieving faster load times and smoother view rendering\nSyncing backend APIs data for real-time sales targets and client logs tracking\nComprehensive test suites written with Jest to guarantee core functionality stability",
      order: 9,
    },
  ];

  for (const proj of projectsData) {
    const created = await prisma.project.create({ data: proj });
    console.log(`Created project: ${created.title}`);
  }

  // 4. Create Experiences from Resume
  const experiencesData = [
    {
      company: "Excellent Web World, Ahmedabad",
      role: "Software Engineer",
      duration: "Apr 2025 - Present",
      description: "Engineered Seen Jeem real-time gaming platform using MERN Stack, optimized Node.js API endpoints for low-latency queries, and built Prompass campaign analytics vendor-dashboard using AWS services integration.",
      skills: "MERN Stack,ReactJS,Node.js,Express.js,MongoDB,WebSockets,AWS",
      order: 1,
    },
    {
      company: "Netpair Infotech, Ahmedabad",
      role: "Software Engineer",
      duration: "Sep 2024 - Feb 2025",
      description: "Contributed to HDFC Ergo desktop application optimizing load speeds. Designed and implemented PostgreSQL database schemas for Cred Mantra and structured Express.js APIs for Vital Step health tracking app.",
      skills: "ReactJS,Node.js,Prisma ORM,PostgreSQL,MongoDB,Express.js,JWT,PayPal",
      order: 2,
    },
    {
      company: "Stalwart IT Solution, Ahmedabad",
      role: "Software Engineer",
      duration: "Jul 2024 - Aug 2024",
      description: "Developed Ride Rove car booking platform with React frontend. Configured JWT authentication and integrated MongoDB for storage, coordinating with cross-functional teams for frontend-backend sync.",
      skills: "React,Node.js,Express,MongoDB,JWT,Git,REST APIs",
      order: 3,
    },
    {
      company: "Tech Holding, Ahmedabad",
      role: "Software Engineer",
      duration: "Feb 2022 - Apr 2024",
      description: "Built Simple Plan bespoke project management tool with Sequelize and GraphQL, increasing security with Google APIs authentication. Engineered Westfield microservices and backend with Prisma, and integrated ShipEngine webhooks for Viapromeds.",
      skills: "React,Sequelize,Prisma,NodeJS,Ruby on Rails,Postgres,AWS,GraphQL,WebSockets,Material-UI,Jest",
      order: 4,
    },
  ];

  for (const exp of experiencesData) {
    const created = await prisma.experience.create({ data: exp });
    console.log(`Created experience: ${created.company} - ${created.role}`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
