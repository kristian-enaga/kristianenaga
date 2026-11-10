import Header from "@/components/Header";
import HeroCanvas from "@/components/HeroCanvas";
import PainPoints from "@/components/PainPoints";
import CapabilitiesMatrix from "@/components/CapabilitiesMatrix";
import ProofOfWork from "@/components/ProofOfWork";
import QuoteBanner from "@/components/QuoteBanner";
import Architecture from "@/components/Architecture";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 relative z-10">
        <HeroCanvas />
        <PainPoints />
        <CapabilitiesMatrix />
        <ProofOfWork />
        <QuoteBanner />
        <Architecture />
      </main>
      <Footer />
    </>
  );
}