"use client"
import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { motion } from "framer-motion";

function footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.5 }}
      className="w-full bg-gray-200 dark:bg-gray-900 py-6 mt-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
        <span className="text-gray-600 dark:text-gray-300 text-xl">
          © {new Date().getFullYear()} Mohamed Ibrahim. All rights reserved.
        </span>
        <div className="flex gap-4">
          <a href="https://github.com/Aldgar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-2xl text-gray-600 dark:text-gray-300 hover:text-primary transition" />
          </a>
          <a href="https://www.linkedin.com/in/mohamed-ibrahim-539308180/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="text-2xl text-gray-600 dark:text-gray-300 hover:text-primary transition" />
          </a>
        </div>
      </div>
    </motion.footer>
  )
}

export default footer