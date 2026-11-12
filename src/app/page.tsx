import Header from "@/components/Header";
import HeroCanvasWrapper from "@/components/HeroCanvasWrapper";
import ProjectSection from "@/components/ProjectSection";
import Approach from "@/components/Approach";
import TechStack from "@/components/TechStack";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ContactMethods from "@/components/ContactMethods";
import SkillsTagCloud from "@/components/SkillsTagCloud";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MouseTrail from "@/components/MouseTrail";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import BottomSheet from "@/components/BottomSheet";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 relative z-10">
        <HeroCanvasWrapper />
        <ProjectSection />
        <Approach />
        <TechStack />
        <CaseStudiesSection />
        <SkillsTagCloud />
        <ContactMethods />
        <Contact />
      </main>
      <MouseTrail />
      <EmailCaptureModal />
      <BottomSheet />
      <Footer />
    </>
  );
}