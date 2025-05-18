"use client";
import React from 'react'
import { motion } from 'framer-motion'

function AboutSection() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.5 }}
      className="py-16 bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ amount: 0.5 }}
          className="text-4xl font-bold text-gray-700 dark:text-gray-400 mb-8"
        >
          About Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ amount: 0.5 }}
          className="mt-4 text-2xl text-gray-700 dark:text-gray-500"
        >
          Passionate and results-driven Web Developer with hands-on experience in modern JavaScript frameworks including
          <span className="font-semibold text-gray-700 dark:text-gray-400 "> React, Next.js,</span>, <span className="font-semibold text-gray-700 dark:text-gray-400">NestJS</span> and <span className="font-semibold text-gray-700 dark:text-gray-400">Express.JS</span>. Specialized in building responsive, high-performance web applications with clean,
          maintainable code and a strong focus on user experience.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ amount: 0.5 }}
          className="mt-4 text-2xl text-gray-700 dark:text-gray-500"
        >
          Adept at solving complex challenges through innovative,
          scalable solutions in collaborative, fast-paced environments. Committed to continuous learning and staying current
          with industry trends to deliver cutting-edge digital experiences. Eager to contribute skills and grow within a dynamic
          development team.
        </motion.p>
      </div>
    </motion.section>
  )
}

export default AboutSection