import Navbar from '../components/landingnew/Navbar/Navbar';
import Hero from '../components/landingnew/Hero/Hero';
import Gallery from '../components/landingnew/Gallery/Gallery';
import QuickStart from '../components/landingnew/QuickStart/QuickStart';
import Footer from '../components/landingnew/Footer/Footer';
import useScrollToTop from '../hooks/useScrollToTop';

const LandingPage = () => {
  useScrollToTop();

  return (
    <section className="landing-wrapper">
      <Navbar />
      <Hero />
      <Gallery />
      <QuickStart />
      <Footer />
    </section>
  );
};

export default LandingPage;
