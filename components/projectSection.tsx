"use client";
import ProjectCard from "@/components/projectCard";
import React from "react";
import { motion } from "framer-motion"; 

type Project = {
  title: string;
  description: string;
  tech: string[];
  github: string;
};

const projects: Project[] = [
  {
    title: "MonDo",
    description: "A modern, responsive social media platform built with TypeScriopt, Next.js, Tailwind CSS. It features a sleek design, user authentication, real-time updates using WebSockets, Clerk for managing the login and users, and a RESTful API for data management. and MongoDB for data storage.",
    tech: ["Next.js", "Tailwind CSS", "React", "Node.js", "MongoDB", "NextAuth.js", "Clerk", "ShadCn"],
    github: "https://github.com/Aldgar/MonDo",
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

const ProjectsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.5 }} 
      className="bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 "
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ amount: 0.5 }}
        className="text-4xl font-bold text-primary flex justify-center pt-6"
      >
        Projects
      </motion.h1>

      <section className="px-2 py-6 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard key={project.title} {...project} index={idx} />
        ))}
      </section>
    </motion.div>
  );
};

export default ProjectsSection;