import React, { useEffect, useRef } from 'react';

const CURRENCIES = [
  { symbol: '₹', color: '#10b981', glow: 'rgba(16, 185, 129, 0.45)' }, // Emerald INR
  { symbol: '$', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' }, // Amber USD
  { symbol: '€', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' }, // Sky EUR
  { symbol: '₿', color: '#facc15', glow: 'rgba(250, 204, 21, 0.45)' }, // Gold BTC
  { symbol: '¥', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)' }, // Rose JPY
  { symbol: '£', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)' }  // Cyan GBP
];

export default function GlobalCurrencyRain() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const splashesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, lastMoved: 0, isMoving: false });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Spawner for currency raindrop
    const spawnDroplet = (fromCursor = false, customX = null, customY = null) => {
      // Don't overwhelm: cap max particles
      if (particlesRef.current.length > 130) return;

      const curr = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
      const depth = 0.45 + Math.random() * 0.55; // Depth factor: 0.45 to 1.0
      const size = Math.floor(15 + depth * 19); // Size 15px to 34px
      const vy = 5 + depth * 8.5 + (fromCursor ? Math.random() * 3 : 0); // Downward velocity
      const vx = (Math.random() - 0.5) * 1.6; // Slight natural wind drift

      let startX = customX !== null ? customX + (Math.random() - 0.5) * 50 : Math.random() * width;
      let startY = customY !== null ? customY + (Math.random() - 0.5) * 20 : -35;

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.05,
        size,
        depth,
        symbol: curr.symbol,
        color: curr.color,
        glow: curr.glow,
        trailLength: 22 + depth * 35,
        alpha: 0.65 + depth * 0.35
      });
    };

    // Splash ripple generator when hitting screen bottom
    const spawnSplash = (x, y, color) => {
      if (splashesRef.current.length > 50) return;

      // Expanding water ripple ring
      splashesRef.current.push({
        type: 'ripple',
        x,
        y,
        radius: 3,
        maxRadius: 18 + Math.random() * 12,
        alpha: 0.75,
        color
      });

      // 2-3 bouncing micro droplets
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        splashesRef.current.push({
          type: 'droplet',
          x,
          y,
          vx: (Math.random() - 0.5) * 3.5,
          vy: -(2 + Math.random() * 3),
          gravity: 0.22,
          radius: 1.2 + Math.random() * 1.5,
          alpha: 0.85,
          color
        });
      }
    };

    // Global cursor tracking
    const handleMouseMove = (e) => {
      const now = performance.now();
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastMoved = now;
      mouseRef.current.isMoving = true;

      // Spawn currency stream right at cursor tip!
      spawnDroplet(true, e.clientX, e.clientY);
      if (Math.random() > 0.35) {
        spawnDroplet(true, e.clientX + (Math.random() - 0.5) * 35, e.clientY - 12);
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const now = performance.now();
      mouseRef.current.x = touch.clientX;
      mouseRef.current.y = touch.clientY;
      mouseRef.current.lastMoved = now;
      mouseRef.current.isMoving = true;

      spawnDroplet(true, touch.clientX, touch.clientY);
    };

    // Click burst jackpot on screen
    const handleClick = (e) => {
      // If clicking interactive UI, subtle burst
      const target = e.target;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT')) {
        return;
      }
      for (let i = 0; i < 14; i++) {
        setTimeout(() => {
          spawnDroplet(true, e.clientX + (Math.random() - 0.5) * 120, e.clientY + (Math.random() - 0.5) * 50);
        }, i * 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);

    // Main 60 FPS Render Loop
    let lastAmbientTime = performance.now();

    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render);

      // Check if mouse stopped moving recently
      if (time - mouseRef.current.lastMoved > 180) {
        mouseRef.current.isMoving = false;
      }

      ctx.clearRect(0, 0, width, height);

      // Ambient natural rain trickling down from top
      const ambientInterval = mouseRef.current.isMoving ? 160 : 80;
      if (time - lastAmbientTime > ambientInterval) {
        lastAmbientTime = time;
        spawnDroplet(false);
      }

      // Update & Draw Splashes at screen bottom
      for (let i = splashesRef.current.length - 1; i >= 0; i--) {
        const s = splashesRef.current[i];
        if (s.type === 'ripple') {
          s.radius += 0.85;
          s.alpha -= 0.035;
          if (s.alpha <= 0) {
            splashesRef.current.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 1.6, s.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.stroke();
          ctx.restore();
        } else if (s.type === 'droplet') {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += s.gravity;
          s.alpha -= 0.03;
          if (s.alpha <= 0 || s.y > height) {
            splashesRef.current.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fill();
          ctx.restore();
        }
      }

      // Update & Draw Falling Currency Droplets ("pip down pip down like rainwater")
      const floorY = height - 8;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy;

        // When droplet hits bottom floor
        if (p.y >= floorY) {
          spawnSplash(p.x, floorY, p.color);
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        // 1. Draw glowing rainwater streak trail
        const trailY = Math.max(-20, p.y - p.trailLength);
        const streakGrad = ctx.createLinearGradient(p.x, trailY, p.x, p.y);
        streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        streakGrad.addColorStop(0.7, p.glow);
        streakGrad.addColorStop(1, p.color);

        ctx.beginPath();
        ctx.moveTo(p.x, trailY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = 1.6 * p.depth;
        ctx.stroke();

        // 2. Draw currency glyph
        ctx.font = `bold ${p.size}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = p.color;
        ctx.shadowBlur = 9 * p.depth;

        ctx.fillStyle = p.color;
        ctx.fillText(p.symbol, p.x, p.y);

        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
}
