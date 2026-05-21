import Navbar from '../components/landingnew/Navbar/Navbar';
import Hero from '../components/landingnew/Hero/Hero';
import Features from '../components/landingnew/Features/Features';
import Testimonials from '../components/landingnew/Testimonials/Testimonials';
import LiveDemo from '../components/landingnew/LiveDemo/LiveDemo';
import QuickStart from '../components/landingnew/QuickStart/QuickStart';
import CTA from '../components/landingnew/CTA/CTA';
import Footer from '../components/landingnew/Footer/Footer';
import useScrollToTop from '../hooks/useScrollToTop';

const LandingPage = () => {
  useScrollToTop();

  return (
    <section className="landing-wrapper">
      <Navbar />
      <Hero />
      <Features />
      <LiveDemo />
      <QuickStart />
      <Testimonials />
      <CTA />
      <Footer />
    </section>
  );
};

export default LandingPage;
