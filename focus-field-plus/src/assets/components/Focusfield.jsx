import CookieMessage from "./CookieMessage";
import Focuscards from "./Focuscards";
import Focushero from "./Focushero";
import Focusnavbar from "./Focusnavbar";
import HowTo from "./HowTo";
import Testimonials from "./Testimonials";
import TryYouTo from "./TryYouTo";

const Focusfield = () => {
  return (
    <>
      <Focusnavbar />
      <Focushero />
      <Focuscards />
      <HowTo />
      <TryYouTo />
      <Testimonials />
      <CookieMessage />
    </>
  );
};

export default Focusfield;
