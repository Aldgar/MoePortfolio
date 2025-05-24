"use client";

import { motion } from "framer-motion";

interface ExperienceItem {
  title: string;
  company: string;
  date: string;
  bullets: string[];
}

interface ExperienceCardProps {
  experience: ExperienceItem;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ amount: 0.1, once: true }}
      className="rounded-2xl p-8 shadow-lg bg-white dark:bg-neutral-950 mt-10"
    >
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">{experience.title}</h3>
      <div className="text-l text-gray-500 dark:text-gray-300 mb-2 mt-3">
        {experience.company} — <span>{experience.date}</span>
      </div>
      <ul className="list-disc list-inside space-y-3 mt-5 text-xl text-gray-700 dark:text-gray-400">
        {experience.bullets.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </motion.div>
  );
}

