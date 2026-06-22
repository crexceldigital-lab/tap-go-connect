import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import ComparisonSection from "@/components/ComparisonSection";
import ProductCardsSection from "@/components/ProductCardsSection";
import PricingSection from "@/components/PricingSection";
import DemoSection from "@/components/DemoSection";
import LocalAdvantageSection from "@/components/LocalAdvantageSection";
import FAQSection from "@/components/FAQSection";
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
    <ComparisonSection />
    <ProductCardsSection />
    <PricingSection />
    <DemoSection />
    <LocalAdvantageSection />
    <FAQSection />
    <FinalCTASection />
    <FooterSection />
  </div>
);

export default Index;
