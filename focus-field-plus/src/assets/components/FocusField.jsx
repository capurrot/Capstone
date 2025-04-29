import CookieMessage from "./home/CookieMessage";
import Faq from "./home/Faq";
import FocusCards from "./home/FocusCards";
import FocusHero from "./home/FocusHero";
import FocusNavBar from "./home/FocusNavBar";
import Footer from "./home/Footer";
import HowTo from "./home/HowTo";
import TestimonialsCarousel from "./home/Testimonials";
import TryYouTo from "./home/TryYouTo";

const FocusField = () => {
  return (
    <>
      <FocusNavBar />
      <FocusHero />
      <FocusCards />
      <HowTo />
      <TryYouTo />
      <TestimonialsCarousel />
      <Faq />
      <Footer />
      <CookieMessage />
    </>
  );
};

export default FocusField;
