export interface CoverFlowProps {
  className?: string;
}

export default function CoverFlow({ className = '' }: CoverFlowProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Cover Flow component</div>
  );
}
