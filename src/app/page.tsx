import Header from "@/components/Header";
import HeroCanvasWrapper from "@/components/HeroCanvasWrapper";
import ProjectSection from "@/components/ProjectSection";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MouseTrail from "@/components/MouseTrail";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import TechStack from "@/components/TechStack";
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
        <Contact />
      </main>
      <MouseTrail />
      <EmailCaptureModal />
      <BottomSheet />
      <Footer />
    </>
  );
}