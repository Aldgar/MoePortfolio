"use client";

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
  const formatBulletPoint = (text: string) => {
    const colonIndex = text.indexOf(':');
    if (colonIndex !== -1) {
      const header = text.substring(0, colonIndex + 1);
      const description = text.substring(colonIndex + 1);
      return (
        <>
          <span className="font-bold">{header}</span>
          {description}
        </>
      );
    }
    return text;
  };

  return (
    <div className="rounded-2xl p-8 shadow-lg bg-white dark:bg-neutral-950 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">{experience.title}</h3>
      <div className="text-lg text-gray-500 dark:text-gray-300 mb-4">
        {experience.company} — <span>{experience.date}</span>
      </div>
      <ul className="space-y-3 flex-1 text-gray-700 dark:text-gray-400">
        {experience.bullets.map((point, idx) => (
          <li key={idx} className="leading-relaxed">
            • {formatBulletPoint(point)}
          </li>
        ))}
      </ul>
    </div>
  );
}