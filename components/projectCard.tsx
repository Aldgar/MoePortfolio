import React from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  index?: number;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tech,
  github,
  index = 0,
}) => (
 <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.18, delay: index * 0.02 }}
  viewport={{ amount: 0.1, once: true }}
  className="bg-white dark:bg-neutral-950 rounded-3xl shadow-lg p-3 sm:p-6 flex flex-col h-full mb-5"
>
    <h3 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
      {title}
    </h3>
    <p className="text-gray-700 dark:text-gray-400 mb-4 flex-1 text-xl">
      {description}
    </p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tech.map((t) => (
        <span
          key={t}
          className="bg-gray-200 dark:bg-gray-800 text-l px-2 py-1 rounded font-medium text-gray-800 dark:text-gray-200"
        >
          {t}
        </span>
      ))}
    </div>
    <div className="flex gap-4 mt-auto">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub className="text-gray-700 dark:text-gray-400 text-3xl hover:text-black dark:hover:text-white transition" />
        </a>
      )}
    </div>
  </motion.div>
);

export default ProjectCard;