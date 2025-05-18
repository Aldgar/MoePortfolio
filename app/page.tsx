import AboutSection from "@/components/aboutSection";
import SkillsSection from "@/components/skillsSection"; 
import ProjectSection from "@/components/projectSection";
import ExperienceSection from "@/components/experienceSection"; 
import ContactForm from "@/components/contactForm";
import Footer from "@/components/footer";
import DownloadCv from "@/components/downloadCv";
import Hero from "@/components/hero";

export default function HomePage() {
  return (
    <div>
      <main>
        <section id="/"><Hero /></section>
        <section id="about"><AboutSection /></section>
        <section id="skills"><SkillsSection /></section>
        <section id="projects"><ProjectSection /> {}</section>
        <section id="experience"><ExperienceSection /></section>
        <section id="contact"><ContactForm /></section>
        <section id="downloadcv"><DownloadCv /></section>
      </main>
      <Footer />
    </div>
  );
}