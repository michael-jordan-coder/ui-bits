import './CubeShowcase.css';

export interface CubeShowcaseProps {
  className?: string;
}

export default function CubeShowcase({ className = '' }: CubeShowcaseProps) {
  return <div className={`cube-showcase-root ${className}`}>Cube Showcase component</div>;
}
