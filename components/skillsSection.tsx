"use client";
import { SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiBootstrap, SiNodedotjs, SiMongodb, SiGraphql, SiExpress, SiNestjs, SiJest, SiDocker, SiSupabase, SiPowers, SiGooglecloud, SiRedux, SiPrisma } from "react-icons/si";
import { FaGitAlt, FaGithub, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { MdGroupWork, MdOutlinePsychologyAlt, MdSpeakerNotes } from "react-icons/md";
import SkillCard from "@/components/skillsCard";

export default function SkillsSection() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <h2 className="text-4xl font-bold text-center pt-10 text-cyan-400">Skills</h2>
      <section className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <SkillCard
          category="Languages & Core"
          skills={[
            { name: "JavaScript", icon: SiJavascript },
            { name: "TypeScript", icon: SiTypescript },
          ]}
        />
        <SkillCard
          category="Frontend Development"
          skills={[
            { name: "HTML", icon: FaHtml5 },
            { name: "CSS", icon: FaCss3Alt },
            { name: "React.js", icon: SiReact },
            { name: "Next.js", icon: SiNextdotjs },
            { name: "Tailwind CSS", icon: SiTailwindcss },
            { name: "Bootstrap", icon: SiBootstrap },
            { name: "Redux", icon: SiRedux },
          ]}
        />
        <SkillCard
          category="Backend Development"
          skills={[
            { name: "Node.js", icon: SiNodedotjs },
            { name: "NestJS", icon: SiNestjs },
            { name: "Express.js", icon: SiExpress },
            { name: "MongoDB", icon: SiMongodb },
            { name: "GraphQL", icon: SiGraphql },
            { name: "Prisma", icon: SiPrisma },
          ]}
        />
        <SkillCard
          category="DevOps & Testing"
          skills={[
            { name: "Docker", icon: SiDocker },
            { name: "Supabase", icon: SiSupabase },
            { name: "Jest", icon: SiJest },
            { name: "Git", icon: FaGitAlt },
            { name: "GitHub", icon: FaGithub },
          ]}
        />
        <SkillCard
          category="Tools & Platforms"
          skills={[
            { name: "PowerShell", icon: SiPowers },
            { name: "Azure AD", icon: SiGooglecloud }, // Placeholder
            { name: "Google Workspace", icon: SiGooglecloud },
          ]}
        />
        <SkillCard
          category="Soft Skills"
          skills={[
            { name: "Problem Solving", icon: MdOutlinePsychologyAlt },
            { name: "Team Collaboration", icon: MdGroupWork },
            { name: "Communication", icon: MdSpeakerNotes },
          ]}
        />
      </section>
    </div>
  );
}