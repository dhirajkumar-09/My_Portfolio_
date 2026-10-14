import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Sparkles, DollarSign, ArrowUpRight, ShieldCheck } from 'lucide-react';

const CURRENCIES = [
  { symbol: '₹', name: 'INR', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { symbol: '$', name: 'USD', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { symbol: '€', name: 'EUR', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
  { symbol: '₿', name: 'BTC', color: '#facc15', glow: 'rgba(250, 204, 21, 0.4)' },
  { symbol: '¥', name: 'JPY', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  { symbol: '£', name: 'GBP', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' }
];

export default function CurrencyRainStage({ className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [rainCount, setRainCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // References for animation loop
  const particlesRef = useRef([]);
  const splashesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isOver: false });
  const animFrameRef = useRef(null);
  const countAccumulatorRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width = container.clientWidth || 460;
    let height = container.clientHeight || 500;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 460;
      height = container.clientHeight || 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Spawner function
    const spawnDroplet = (fromCursor = false, customX = null, customY = null) => {
      const allowedCurrencies =
        activeFilter === 'ALL'
          ? CURRENCIES
          : CURRENCIES.filter((c) => c.name === activeFilter);
      const curr =
        allowedCurrencies[Math.floor(Math.random() * allowedCurrencies.length)] ||
        CURRENCIES[0];

      const depth = 0.4 + Math.random() * 0.6; // 0.4 to 1.0 depth perception
      const size = Math.floor(16 + depth * 18); // 16px to 34px
      const vy = 5 + depth * 9 + (fromCursor ? Math.random() * 4 : 0); // speed 5 to 18 px/f
      const vx = (Math.random() - 0.5) * 1.5; // subtle horizontal wind drift

      let startX = customX !== null ? customX + (Math.random() - 0.5) * 40 : Math.random() * width;
      let startY = customY !== null ? customY + (Math.random() - 0.5) * 20 : -35;

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.06,
        size,
        depth,
        symbol: curr.symbol,
        color: curr.color,
        glow: curr.glow,
        trailLength: 20 + depth * 35,
        alpha: 0.6 + depth * 0.4
      });

      countAccumulatorRef.current += 1;
    };

    // Splash generator when droplet hits bottom floor
    const spawnSplash = (x, y, color) => {
      // 1. Expanding water ripple ring
      splashesRef.current.push({
        type: 'ripple',
        x,
        y,
        radius: 3,
        maxRadius: 18 + Math.random() * 12,
        alpha: 0.8,
        color
      });

      // 2. 2-4 mini bouncing droplets
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        splashesRef.current.push({
          type: 'droplet',
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: -(2 + Math.random() * 3.5),
          gravity: 0.25,
          radius: 1.5 + Math.random() * 1.5,
          alpha: 0.9,
          color
        });
      }
    };

    // Main 60 FPS Animation Loop
    let lastSpawnTime = performance.now();

    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render);

      // Semi-transparent clear creates subtle rain motion streak
      ctx.clearRect(0, 0, width, height);

      // Spawn rate: heavy when hovered, gentle ambient when idle
      const spawnInterval = mouseRef.current.isOver ? 24 : 110;
      if (time - lastSpawnTime > spawnInterval) {
        lastSpawnTime = time;
        const batch = mouseRef.current.isOver ? 3 : 1;
        for (let b = 0; b < batch; b++) {
          spawnDroplet(false);
        }
      }

      // Update & Draw Splashes
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

      // Update & Draw Falling Currency Droplets ("pip down pip down")
      const floorY = height - 15;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy;

        // Check if reached floor
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
        ctx.lineWidth = 1.8 * p.depth;
        ctx.stroke();

        // 2. Draw currency symbol droplet
        ctx.font = `bold ${p.size}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glow shadow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * p.depth;

        ctx.fillStyle = p.color;
        ctx.fillText(p.symbol, p.x, p.y);

        ctx.restore();
      }

      // Sync counter every few frames
      if (countAccumulatorRef.current > 0) {
        setRainCount((prev) => prev + countAccumulatorRef.current);
        countAccumulatorRef.current = 0;
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Mouse handlers on container
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y, isOver: true };

      // Spawning currency droplets right where the cursor moves!
      spawnDroplet(true, x, y);
      if (Math.random() > 0.4) {
        spawnDroplet(true, x + (Math.random() - 0.5) * 30, y - 10);
      }
    };

    const onMouseEnter = () => {
      mouseRef.current.isOver = true;
      setIsHovered(true);
      // Immediate shower burst upon hover
      for (let i = 0; i < 8; i++) {
        spawnDroplet(false);
      }
    };

    const onMouseLeave = () => {
      mouseRef.current.isOver = false;
      setIsHovered(false);
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      mouseRef.current = { x, y, isOver: true };
      spawnDroplet(true, x, y);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchstart', onMouseEnter, { passive: true });
    container.addEventListener('touchend', onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchstart', onMouseEnter);
        container.removeEventListener('touchend', onMouseLeave);
      }
    };
  }, [activeFilter]);

  // Click to trigger money downpour splash
  const handleCardClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Burst 15 currency droplets cascading down!
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const allowedCurrencies =
          activeFilter === 'ALL'
            ? CURRENCIES
            : CURRENCIES.filter((c) => c.name === activeFilter);
        const curr = allowedCurrencies[Math.floor(Math.random() * allowedCurrencies.length)];
        const depth = 0.5 + Math.random() * 0.5;
        particlesRef.current.push({
          x: clickX + (Math.random() - 0.5) * 90,
          y: clickY + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 4,
          vy: 6 + Math.random() * 8,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.08,
          size: Math.floor(20 + depth * 14),
          depth,
          symbol: curr.symbol,
          color: curr.color,
          glow: curr.glow,
          trailLength: 35,
          alpha: 0.95
        });
      }, i * 25);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCardClick}
      className={`relative w-full h-[460px] sm:h-[510px] rounded-3xl overflow-hidden cursor-crosshair select-none transition-all duration-500 group ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(5, 10, 20, 0.95) 100%)',
        boxShadow: isHovered
          ? '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 0 40px rgba(16, 185, 129, 0.2) inset'
          : '0 20px 45px -10px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Dynamic Animated Glass Ambient Glow */}
      <div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
      />

      {/* Luxury Border Outline */}
      <div className="absolute inset-0 rounded-3xl border border-amber-500/30 group-hover:border-amber-400/60 pointer-events-none transition-colors duration-500" />

      {/* Top Gold Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-3xl pointer-events-none" />

      {/* 60 FPS Currency Rain Physics Canvas (Directly on Stage) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Centerpiece Executive Business & Wealth Display (Interactive Glass HUD) */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-7 pointer-events-none">
        
        {/* Header HUD Line */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 backdrop-blur-md">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="text-[11px] font-mono font-semibold text-amber-300">
              EXECUTIVE ASSET CORE
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-emerald-400">
              LIVE FLOW
            </span>
          </div>
        </div>

        {/* Center Status Card & Interactive Hover Prompt */}
        <div className="my-auto text-center space-y-4 py-4">
          <motion.div
            animate={{ scale: isHovered ? [1, 1.03, 1] : 1 }}
            transition={{ repeat: isHovered ? Infinity : 0, duration: 2 }}
            className="inline-block p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                ₹  $  €  ₿  ¥
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
              Business & Financial Wealth Stream
            </h3>

            <p className="text-xs font-mono text-slate-300 mt-1 max-w-xs mx-auto">
              Strategic capital allocation, algorithmic systems & corporate growth.
            </p>

            {/* Live Hover Status Tag */}
            <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-amber-400/40 text-xs font-mono font-semibold text-amber-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                {isHovered ? '⚡ Raining Wealth • Pip Down Active!' : '🌧️ Hover cursor to trigger Currency Rain'}
              </span>
            </div>
          </motion.div>

          {/* Quick Financial Telemetry Pills */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Strategic ROI</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+38.5% ALPHA</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Capital Velocity</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>99.8% OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Filter & Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          {/* Currency Switcher Buttons (Pointer events enabled) */}
          <div className="flex items-center gap-1 pointer-events-auto">
            {['ALL', 'INR', 'USD', 'EUR', 'BTC'].map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter(cur);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  activeFilter === cur
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cur === 'ALL' ? '✦ ALL' : cur}
              </button>
            ))}
          </div>

          {/* Live Pipped Currency Counter */}
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pipped Down:</span>
            <span className="text-xs font-bold text-emerald-300">
              {rainCount.toLocaleString()} Drops
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
