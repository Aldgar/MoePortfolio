// components/SkillCard.tsx
"use client";

import { IconType } from "react-icons";
import { motion } from "framer-motion"; 

interface SkillCardProps {
  category: string;
  skills: { name: string; icon: IconType }[];
}

export default function SkillCard({ category, skills }: SkillCardProps) {
  return (
    <motion.div
      className="rounded-2xl shadow-md p-4  bg-white dark:bg-neutral-950 mt-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{category}</h3>
      <ul className="grid grid-cols-2 gap-3">
        {skills.map(({ name, icon: Icon }) => (
          <li key={name} className="flex items-center gap-2 text-xl text-gray-700 dark:text-gray-400">
            {Icon && <Icon className="text-3xl text-blue-400" />}
            {name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}