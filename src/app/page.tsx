import Header from "@/components/Header";
import HeroCanvas from "@/components/HeroCanvas";
import Portfolio from "@/components/Portfolio";
import Categories from "@/components/Categories";
import TechnicalStack from "@/components/TechnicalStack";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 relative z-10">
        <HeroCanvas />
        <Portfolio />
        <Categories />
        <TechnicalStack />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}