"use client";
import ProjectCard from "@/components/projectCard";
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  website?: string;
  bullets?: string[]; // Add bullets for detailed projects
};

const projects: Project[] = [
  {
    title: "MonDo",
    description: "A modern, responsive social media platform built with TypeScript, Next.js, Tailwind CSS. It features a sleek design, user authentication, real-time updates using WebSockets, Clerk for managing the login and users, and a RESTful API for data management. and MongoDB for data storage.",
    tech: ["Next.js", "Tailwind CSS", "React", "Node.js", "MongoDB", "NextAuth.js", "Clerk", "ShadCn"],
    website: "https://mon-do.vercel.app",
  },
  {
    title: "NilToum Connect (in development)",
    description: "The platform's core mission is to bridge the employment gap by offering a localized, community-driven hiring solution for regions often left out of global job networks.",
    tech: ["Next.JS", "Tailwind CSS", "Zod", "NestJS", "MongoDB", "Supabase", "Docker", "Turborepo", "Prisma", "NextAuth.js", "Jest",],
    github: "https://github.com/Aldgar/NilToum",
    bullets: [
      "Built using TypeScript, with a Turborepo monorepo combining Next.js (frontend) and NestJS (backend), using MongoDB, Prisma, and NextAuth (Google login).",
      "Key features include a job board, skill-based profile matching, user authentication, and application tracking — designed for both candidates and recruiters.",
      "Developed a mobile-first, low-bandwidth-optimized UI with Tailwind CSS to ensure accessibility across devices and slow networks for underserved regions.",
      "Applied a microservices-inspired modular structure with NestJS for long-term maintainability and separation of concerns.",
      "Implementing component-driven development on the frontend, preparing the foundation for a future design system.",
      "Integrating Jest for backend testing and using GitHub Actions CI/CD for test and deployment pipelines.",
      "Focused on real-world trade-offs — building with awareness of infrastructure cost, understanding of trade-offs between performance, time-to-market and — simulating large-scale product thinking in real-world projects.",
    ],
  },
  {
    title: "Users Dashboard",
    description: "A user management dashboard built with JavaScript, React.js, and Tailwind CSS. It includes secure user authentication, a RESTful API for efficient data handling, and a server backend powered by Express.js and MongoDB. The application is designed with performance and scalability in mind, and is deployed using Docker and Supabase.",
    tech: ["React", "Tailwind CSS", "Zod", "Express.js", "MongoDB", "Supabase", "Docker"],
    github: "https://github.com/Aldgar/Express.js-assesment",
  },
  {
    title: "Managers Dashboard using Next.Js & NestJS",
    description: "A full-stack dashboard application designed for managing managers, built with TypeScript, Next.js, and Tailwind CSS. It includes secure manager authentication using NextAuth.js, a RESTful API built with NestJS for efficient data handling, and MongoDB for data storage. The project seamlessly integrates Next.js with NestJS to provide a robust backend and frontend experience. The application is containerized with Docker and deployed using Supabase.",
    tech: ["Next.js", "Tailwind CSS", "React", "Node.js", "MongoDB", "NextAuth.js"],
    github: "https://github.com/Aldgar/Project-Managers-Backend-With-Nestjs",
  },
];

// Special component for detailed project (NilToum)
const DetailedProjectCard: React.FC<Project & { index: number }> = ({ 
  title, 
  description, 
  tech, 
  github, 
  website, 
  bullets,
  index 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
    viewport={{ amount: 0.1, once: true }}
    className="bg-white dark:bg-neutral-950 rounded-3xl shadow-lg p-6 flex flex-col h-full"
  >
    <h3 className="text-3xl font-bold mb-4 text-gray-700 dark:text-gray-300">
      {title}
    </h3>
    
    {/* Brief Description */}
    <p className="text-gray-700 dark:text-gray-400 mb-4 text-lg">
      {description}
    </p>
    
    {/* Detailed Bullet Points */}
    {bullets && (
      <ul className="space-y-3 mb-6 flex-1">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="text-gray-700 dark:text-gray-400 leading-relaxed">
            • {bullet}
          </li>
        ))}
      </ul>
    )}
    
    {/* Tech Stack */}
    <div className="flex flex-wrap gap-2 mb-4">
      {tech.map((t) => (
        <span
          key={t}
          className="bg-gray-200 dark:bg-gray-800 text-sm px-3 py-1 rounded-full font-medium text-gray-800 dark:text-gray-200"
        >
          {t}
        </span>
      ))}
    </div>
    
    {/* Links */}
    <div className="flex gap-4 mt-auto">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Website"
        >
          <FaExternalLinkAlt className="text-3xl" />
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          <FaGithub className="text-gray-700 dark:text-gray-400 text-3xl hover:text-black dark:hover:text-white transition" />
        </a>
      )}
    </div>
  </motion.div>
);

const ProjectsSection: React.FC = () => {
  // Separate NilToum project from others
  const niltoumProject = projects.find(p => p.title.includes("NilToum"));
  const otherProjects = projects.filter(p => !p.title.includes("NilToum"));

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-white">
      <h1 className="text-5xl font-bold text-center mb-12 mt-8 pt-8 text-gray-600">
        Projects
      </h1>
      
      {/* NilToum Project - Full Width */}
      {niltoumProject && (
        <section className="w-full px-6 py-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <DetailedProjectCard {...niltoumProject} index={0} />
          </div>
        </section>
      )}
      
      {/* Other Projects - Grid Layout */}
      <section className="w-full px-2 py-6 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProjects.map((project, idx) => (
          <ProjectCard key={project.title} {...project} index={idx + 1} />
        ))}
      </section>
    </div>
  );
};

export default ProjectsSection;