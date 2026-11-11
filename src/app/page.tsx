import Header from "@/components/Header";
import HeroCanvasWrapper from "@/components/HeroCanvasWrapper";
import ProjectSection from "@/components/ProjectSection";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 relative z-10">
        <HeroCanvasWrapper />
        <ProjectSection />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}