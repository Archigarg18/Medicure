import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DoctorCategories from "@/components/DoctorCategories";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DoctorCategories />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default Index;
