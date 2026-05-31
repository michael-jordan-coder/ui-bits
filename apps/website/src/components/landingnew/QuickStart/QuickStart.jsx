import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import './QuickStart.css';

const INSTALL_COMMAND = 'npx jsrepo add @community-bits/<Component>';

const QuickStart = () => (
  <section id="quick-start" className="cb-quickstart">
    <h2 className="cb-quickstart-title">Quick start</h2>
    <p className="cb-quickstart-lead">
      Every component ships as copy-paste source. Install any of them with jsrepo.
    </p>
    <div className="cb-quickstart-cmd">
      <code>{INSTALL_COMMAND}</code>
    </div>
    <p className="cb-quickstart-sub">Grab the exact command from any component’s page.</p>
    <Link to="/get-started/introduction" className="cb-quickstart-link">
      Read the guide <FaArrowRight size={12} />
    </Link>
  </section>
);

export default QuickStart;
