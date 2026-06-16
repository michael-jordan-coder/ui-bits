export interface CubeShowcaseProps {
  className?: string;
}

export default function CubeShowcase({ className = '' }: CubeShowcaseProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Cube Showcase component</div>
  );
}
