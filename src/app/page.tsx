import Header from "@/components/Header";
import HeroCanvas from "@/components/HeroCanvas";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 relative z-10">
        <HeroCanvas />
        <ProjectSection />
      </main>
      <Footer />
    </>
  );
}