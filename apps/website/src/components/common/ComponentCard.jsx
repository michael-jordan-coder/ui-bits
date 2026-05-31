import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import './ComponentCard.css';

// A live component preview card with a progressive (Apple-style) backdrop-blur
// label. Shared by the landing hero gallery and the /components/index catalog.
const ComponentCard = ({ item, className = '', style }) => (
  <Link to={item.route} className={`component-card ${className}`.trim()} style={style}>
    <div className="component-card-preview" aria-hidden="true">
      {item.render()}
    </div>
    <div className="component-card-blur" aria-hidden="true">
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
    <span className="component-card-go" aria-hidden="true">
      <FaArrowRight size={12} />
    </span>
    <div className="component-card-overlay">
      <div className="component-card-row">
        <span className="component-card-name">{item.name}</span>
        <span className="component-card-cat">{item.category}</span>
      </div>
      <div className="component-card-tags">
        {item.tags.map(tag => (
          <span key={tag} className="component-card-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default ComponentCard;
