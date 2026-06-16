export interface DepthTunnelProps {
  className?: string;
}

export default function DepthTunnel({ className = '' }: DepthTunnelProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Depth Tunnel component</div>
  );
}
