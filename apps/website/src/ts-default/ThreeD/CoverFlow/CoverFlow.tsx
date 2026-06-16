import './CoverFlow.css';

export interface CoverFlowProps {
  className?: string;
}

export default function CoverFlow({ className = '' }: CoverFlowProps) {
  return <div className={`cover-flow-root ${className}`}>Cover Flow component</div>;
}
