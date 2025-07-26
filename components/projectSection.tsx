"use client";
import ProjectCard from "@/components/projectCard";
import React from "react";

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  website?: string;
};

const projects: Project[] = [
  {
    title: "MonDo",
    description: "A modern, responsive social media platform built with TypeScriopt, Next.js, Tailwind CSS. It features a sleek design, user authentication, real-time updates using WebSockets, Clerk for managing the login and users, and a RESTful API for data management. and MongoDB for data storage.",
    tech: ["Next.js", "Tailwind CSS", "React", "Node.js", "MongoDB", "NextAuth.js", "Clerk", "ShadCn"],
    website: "https://mon-do.vercel.app",
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

const ProjectsSection: React.FC = () => (
  <div className="bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-white">
  <h1 className="text-5xl font-bold text-center mb-12 mt-8 pt-8 text-gray-600">
    Projects
  </h1>
  <section className="w-full px-2 py-6 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, idx) => (
        <ProjectCard key={project.title} {...project} index={idx} />
      ))}
    </section>
    </div>
);

export default ProjectsSection;