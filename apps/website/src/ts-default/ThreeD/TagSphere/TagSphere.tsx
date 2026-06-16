import './TagSphere.css';

export interface TagSphereProps {
  className?: string;
}

export default function TagSphere({ className = '' }: TagSphereProps) {
  return <div className={`tag-sphere-root ${className}`}>Tag Sphere component</div>;
}
