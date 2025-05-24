"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiGraphql,
  SiDocker,
  SiNestjs,
} from "react-icons/si";

const techIcons = [
  { Icon: SiHtml5, color: "#e34c26" },
  { Icon: SiCss3, color: "#264de4" },
  { Icon: SiJavascript, color: "#f0db4f" },
  { Icon: SiTypescript, color: "#007acc" },
  { Icon: SiReact, color: "#61dafb" },
  { Icon: SiNextdotjs, color: "" },
  { Icon: SiNodedotjs, color: "#3c873a" },
  { Icon: SiExpress, color: "" },
  { Icon: SiNestjs, color: "#ea2845" },
  { Icon: SiMongodb, color: "#4DB33D" },
  { Icon: SiTailwindcss, color: "#38bdf8" },
  { Icon: SiGraphql, color: "#e535ab" },
  { Icon: SiDocker, color: "#0db7ed" },
];

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[50vh] py-16 bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-300 to-purple-400 blur-lg opacity-60 animate-pulse" />
        <Image
        src="/7B77750B-6530-46BC-B100-F76C8D06BE29_1_201_a.jpg"
        alt="Mohamed Ibrahim"
        width={180}
        height={180}
        className="relative w-45 h-45 rounded-full shadow-lg border-4 border-white dark:border-gray-900 object-cover mt-10"
      />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ amount: 0.5 }}
        className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4 text-center"
      >
        Mohamed Ibrahim
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ amount: 0.5 }}
        className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium text-center"
      >
        A{" "}
        <span className="text-gray-700 dark:text-gray-400 font-semibold">
          Full Stack MERN Developer
        </span>
      </motion.p>

      {/* Marquee with edge padding and gradient-matching fade */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ amount: 0.5 }}
        className="w-full mt-16 px-4 sm:px-8 md:px-20 lg:px-40 xl:px-80"
      >
        {/* Light mode marquee */}
        <div className="block dark:hidden overflow-hidden rounded-xl">
          <Marquee
            gradient={true}
            gradientColor="#bfc5ce"
            gradientWidth={120}
            speed={50}
            pauseOnHover={true}
          >
            {techIcons.map(({ Icon, color }, idx) => (
              <div key={idx} className="px-6">
                <Icon size={50} style={{ color }} />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Dark mode marquee */}
        <div className="hidden dark:block overflow-hidden rounded-xl">
          <Marquee
            gradient={true}
            gradientColor="#111827"
            gradientWidth={120}
            speed={50}
            pauseOnHover={true}
          >
           {techIcons.map(({ Icon, color }, idx) => (
            <div key={idx} className="px-6">
              {Icon === SiNextdotjs || Icon === SiExpress ? (
      <Icon size={50} className="text-black dark:text-white" />
    ) : (
                <Icon size={50} style={{ color }} />
              )}  
              </div>
            ))}   
          </Marquee>
        </div>
      </motion.div>
    </motion.section>
  );
}