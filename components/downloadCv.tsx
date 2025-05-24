"use client"
import React from 'react'
import { motion } from "framer-motion";

function downloadCv() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.1, once: true }}
      id='downloadCv'
      className="max-w-md w-full mx-auto py-10 mt-8 bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-4xl shadow-lg p-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">Download My CV</h1>
        <p className="text-center mb-8 text-gray-700 dark:text-gray-400">Click the button below to download my CV.</p>
        <div className="flex justify-center">
          <a href="/CV_Resume_Mohamed_Ibrahim_Web_Developer.pdf" download className="bg-cyan-400 text-neutral-950 px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300">
            Download CV
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default downloadCv