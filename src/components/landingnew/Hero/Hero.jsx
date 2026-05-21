import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import ActiveMembers from './ActiveMembers';

const Hero = () => (
  <section className="cb-hero">
    <ActiveMembers />
    <h1 className="cb-hero-headline">
      Components for
      <br />
      the community
    </h1>
    <p className="cb-hero-description">
      A growing collection of animated, interactive React components, shared openly so anyone can drop them into their
      project.
    </p>
    <div className="cb-hero-buttons">
      <Link to="/get-started/introduction" className="cb-hero-btn cb-hero-btn-primary">
        Get started <FaArrowRight size={12} />
      </Link>
      <Link to="/components/index" className="cb-hero-btn">
        Browse components
      </Link>
    </div>
  </section>
);

export default Hero;
