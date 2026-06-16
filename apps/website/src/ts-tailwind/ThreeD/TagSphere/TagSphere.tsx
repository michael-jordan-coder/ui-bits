export interface TagSphereProps {
  className?: string;
}

export default function TagSphere({ className = '' }: TagSphereProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Tag Sphere component</div>
  );
}
