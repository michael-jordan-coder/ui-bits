import './DepthTunnel.css';

export interface DepthTunnelProps {
  className?: string;
}

export default function DepthTunnel({ className = '' }: DepthTunnelProps) {
  return <div className={`depth-tunnel-root ${className}`}>Depth Tunnel component</div>;
}
