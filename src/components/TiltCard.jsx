import React, { useState, useRef } from 'react';

/**
 * TiltCard creates a smooth, jitter-free 3D tilt effect on hover.
 * Uses a stationary outer wrapper to prevent bounding rect shifting,
 * completely eliminating hover shaking and glitching.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  perspective = 1000,
  glowColor = 'rgba(6, 182, 212, 0.15)',
  ...props
}) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    );

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      {...props}
    >
      <div
        style={{
          transform,
          transition: 'transform 0.16s ease-out',
          transformStyle: 'preserve-3d'
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic 3D lighting glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 240px at ${glare.x}% ${glare.y}%, ${glowColor}, transparent 75%)`
          }}
        />
      </div>
    </div>
  );
}
