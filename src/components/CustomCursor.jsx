import React, { useEffect, useRef } from 'react';

/**
 * Ultra-smooth, zero-lag Custom Cursor
 * - Hardware-accelerated translate3d via requestAnimationFrame
 * - Instantaneous dot tracking (0ms input lag, zero React state updates on mousemove)
 * - Fluid lerped ambient cyan ring for modern cyber aesthetic
 * - Automatically disabled on touch/coarse devices
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run on desktop/fine pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Check if hovering over interactive elements
      const target = e.target;
      if (target) {
        const interactive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.classList?.contains('cursor-pointer');
        isHovering = !!interactive;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      // 1. Instant dot tracking: exactly at mouse coordinates, 0ms latency
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // 2. Silky smooth ambient ring lerp (fluid follow)
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      const ringScale = isHovering ? 1.5 : 1.0;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Outer ambient glow / ring (smooth lerping) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform transition-opacity duration-200"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1.5px solid rgba(6, 182, 212, 0.45)',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(6, 182, 212, 0.03) 70%, transparent 100%)',
          boxShadow: '0 0 14px rgba(6, 182, 212, 0.2)',
        }}
      />
      {/* Inner precise dot (tracks cursor instantly with 0ms latency) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform transition-opacity duration-200"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          boxShadow: '0 0 8px #38bdf8, 0 0 14px rgba(56, 189, 248, 0.7)',
        }}
      />
    </>
  );
}
