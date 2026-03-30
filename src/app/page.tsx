import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import GallerySection from "@/components/home/GallerySection";
import TeamPreview from "@/components/home/TeamPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedServices />
      <TeamPreview />
      <GallerySection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
