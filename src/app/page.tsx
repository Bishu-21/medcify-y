import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofRibbon } from "@/components/landing/SocialProofRibbon";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navbar />
      <HeroSection />
      <SocialProofRibbon />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}
