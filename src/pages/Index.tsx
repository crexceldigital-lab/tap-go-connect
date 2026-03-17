import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import ProductCardsSection from "@/components/ProductCardsSection";
import PricingSection from "@/components/PricingSection";
import DemoSection from "@/components/DemoSection";
import LocalAdvantageSection from "@/components/LocalAdvantageSection";
import FinalCTASection from "@/components/FinalCTASection";
import FooterSection from "@/components/FooterSection";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <HeroSection />
    <TrustSection />
    <HowItWorksSection />
    <FeaturesSection />
    <UseCasesSection />
    <ProductCardsSection />
    <PricingSection />
    <DemoSection />
    <LocalAdvantageSection />
    <FinalCTASection />
    <FooterSection />
  </div>
);

export default Index;
