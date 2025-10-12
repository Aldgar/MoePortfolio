"use client";

import { motion } from "framer-motion";
import ExperienceCard from "@/components/experienceCard";

const experiences = [
  {
    title: "Freelance Web Developer",
    company: "Freelance",
    date: "July 2024 – Present",
    bullets: [
      "Full-Lifecycle Development: Proven ability to independently manage projects from ideation to deployment, delivering end-to-end solutions focused on performance, scalability, and exceptional user experience.",
      "Technical Versatility: Proficient in JavaScript, TypeScript, React, Next.js, and NestJS, building dynamic UIs with Tailwind CSS/Bootstrap and robust backends with RESTful APIs, MongoDB, GraphQL NestJS Microservices. Ensures code quality through Jest-based testing and Docker containerization.",
      "Problem-Solving & Innovation: Adept at implementing creative solutions, committed to best practices in debugging, clean architecture, and delivering maintainable, production-ready applications.",
      "Strategic & Collaborative Mindset: Cultivated strong project management and communication skills, translating needs into technical execution. Eager to contribute business acumen to fast-evolving, collaborative teams.",
      "Adaptability & Tooling: Comfortable navigating diverse tech stacks and cloud environments, with familiarity in AWS, Google Suites, Power BI & Microsoft Azure AD Administration.",
    ],
  },
  {
    title: "Senior Quality Analyst",
    company: "Teleperformance Portugal",
    date: "September 2020 – Present",
    bullets: [
      "Worked with Google Analytics, GTM, custom JS tags, and Data Layers.",
      "Audited specialist performance and managed analytics dashboards, using tools such as Power BI, Excel, SharePoint, and Looker Studio.",
      "Experience in data projects across multiple industries, including e-commerce, digital marketing, and customer support. Skilled in extracting insights from large datasets, optimizing analytics implementations (GA4, GTM, data layers).",
    ],
  },
  {
    title: "Marketing Expert",
    company: "Teleperformance Portugal",
    date: "July 2019 – September 2020",
    bullets: [
      "Executed cross-channel campaigns for brand and product growth.",
      "Utilized Meta Ads tools for campaign optimization and analysis.",
      "Performed A/B testing and data-driven content strategy improvements.",
      "Conducted market research and audience targeting.",
    ],
  },
];

export default function ExperienceData() {
  return (
    <main className="min-h-screen py-12 px-4 bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-white">
      <h1 className="text-5xl font-bold text-center mb-12 mt-6 text-cyan-400">Professional Experience</h1>
    <section className="mx-auto max-w-7xl grid gap-10 md:grid-cols-2 lg:grid-cols-3 px-6 mb-24">
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
            viewport={{ amount: 0.1, once: true }}
          >
            <ExperienceCard experience={exp} />
          </motion.div>
        ))}
      </section>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ amount: 0.1, once: true }}
        className="rounded-2xl p-8 shadow-lg bg-white dark:bg-neutral-950 mt-24 w-full max-w-7xl mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Certifications</h2>
        <ul className="text-lg space-y-4 text-gray-700 dark:text-gray-400">
          <li>
            <p className="font-semibold">Full-Stack Web Development Bootcamp — CodeLabs Academy</p>
            <p className="italic text-gray-500">2025 – CodeLabs Academy – Berlin, Germany</p>
          </li>
          <li>
            <p className="font-semibold">Learn PowerShell — Codecademy</p>
            <p className="italic text-gray-600">2024 – Codecademy – Online</p>
          </li>
          <li>
            <p className="font-semibold">Microsoft Azure Services and Lifecycles — Coursera</p>
            <p className="italic text-gray-600">2024 – Coursera – Online</p>
          </li>
        </ul>
      </motion.div>

      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ amount: 0.1, once: true }}
        className="rounded-2xl p-8 shadow-lg bg-white dark:bg-neutral-950 mt-16 w-full max-w-7xl mx-auto px-6"
      >
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-400 mb-6">Languages</h2>
        <ul className="text-lg space-y-3 text-gray-700 dark:text-gray-500">
          <li>• Arabic: Native</li>
          <li>• English: Fluent</li>
          <li>• Turkish: Fluent</li>
          <li>• Portuguese: Conversational</li>
        </ul>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        viewport={{ amount: 0.1, once: true }}
        className="rounded-2xl p-8 shadow-lg bg-white dark:bg-neutral-950 mt-16 w-full max-w-7xl mx-auto px-6 mb-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-cyan-400">Education</h2>
        <ul className="text-lg space-y-4 text-gray-700 dark:text-gray-400">
          <li>
            <p className="font-semibold">BSC Computer Science — Web and Mobile Development</p>
            <p className="italic text-gray-500">2022 – Ongoing – Goldsmiths, University of London – UK</p>
          </li>
        </ul>
      </motion.div>
    </main>
  );
}