import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react';

export default function Card3D({ 
  children, 
  className = '', 
  intensity = 3, 
  glow = 'rgba(212,175,97,0.04)', 
  onClick 
}: { 
  children: ReactNode; 
  className?: string; 
  intensity?: number; 
  glow?: string; 
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -intensity;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * intensity;
    setTransform(`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.005,1.005,1.005)`);
    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(350px circle at ${x}px ${y}px, ${glow}, transparent 55%)`,
      transition: 'opacity .06s',
    });
  }, [intensity, glow]);

  const handleMouseLeave = useCallback(() => {
    setTransform('');
    setGlowStyle({ opacity: 0, transition: 'opacity 1s cubic-bezier(.16,1,.3,1)' });
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transform: transform || undefined,
        transformStyle: 'preserve-3d',
        transition: transform ? 'transform .04s linear' : 'transform 1s cubic-bezier(.16,1,.3,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Glow — no pointer events */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ ...glowStyle, zIndex: 1 }}
      />
      {/* Top shine line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        style={{ zIndex: 1 }}
      />
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
