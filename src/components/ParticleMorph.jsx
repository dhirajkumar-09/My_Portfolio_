import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

/**
 * ============================================================================
 * SHAPE GENERATOR FUNCTIONS
 * Each generator populates a Float32Array of length (count * 3) with [x, y, z]
 * coordinates in 3D object space (approx radius: 110 - 150 units).
 * ============================================================================
 */

// 1. Fibonacci Sphere: perfectly uniform particle distribution on a sphere
function generateSphere(count, radius = 135) {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    // Distance from south to north pole (-1 to +1)
    const y = 1 - (i / (count - 1 || 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * angleIncrement;

    const x = Math.cos(phi) * radiusAtY;
    const z = Math.sin(phi) * radiusAtY;

    const idx = i * 3;
    positions[idx] = x * radius;
    positions[idx + 1] = y * radius;
    positions[idx + 2] = z * radius;
  }
  return positions;
}

// 2. Cube: random points uniformly distributed across the 6 faces
function generateCube(count, size = 115) {
  const positions = new Float32Array(count * 3);
  const half = size;

  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6);
    // u and v in [-half, half]
    const u = (Math.random() * 2 - 1) * half;
    const v = (Math.random() * 2 - 1) * half;

    let x = 0, y = 0, z = 0;
    switch (face) {
      case 0: x = half; y = u; z = v; break;   // +X
      case 1: x = -half; y = u; z = v; break;  // -X
      case 2: x = u; y = half; z = v; break;   // +Y
      case 3: x = u; y = -half; z = v; break;  // -Y
      case 4: x = u; y = v; z = half; break;   // +Z
      case 5: x = u; y = v; z = -half; break;  // -Z
      default: break;
    }

    const idx = i * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }
  return positions;
}

// 3. Torus (Donut): Major radius R, minor tube radius r
function generateTorus(count, majorRadius = 110, minorRadius = 45) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2; // Angle around main ring
    const v = Math.random() * Math.PI * 2; // Angle around tube cross-section

    const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    const y = minorRadius * Math.sin(v);
    const z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);

    const idx = i * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }
  return positions;
}

// 4. Double Helix (DNA): Two interlocking helical strands with connecting base-pair rungs
function generateDoubleHelix(count, radius = 70, height = 280, turns = 2.5) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const isRung = i % 5 === 0; // 20% particles form bridge rungs between strands
    const t = (i / (count - 1 || 1)) * 2 - 1; // Normalized height [-1, +1]
    const y = t * (height / 2);
    const angle = t * Math.PI * 2 * turns;

    let x = 0, z = 0;
    if (isRung) {
      // Linear bridge between Strand 1 and Strand 2
      const interp = (Math.random() * 2 - 1);
      x = Math.cos(angle) * radius * interp;
      z = Math.sin(angle) * radius * interp;
    } else {
      // Strand 1 (phase 0) or Strand 2 (phase PI)
      const strandPhase = (i % 2 === 0) ? 0 : Math.PI;
      x = Math.cos(angle + strandPhase) * radius;
      z = Math.sin(angle + strandPhase) * radius;
    }

    const idx = i * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }
  return positions;
}

// Map of shape generator functions
const SHAPE_GENERATORS = {
  SPHERE: generateSphere,
  CUBE: generateCube,
  TORUS: generateTorus,
  'DOUBLE HELIX': generateDoubleHelix
};

// Smoothstep easing for fluid, organic transitions: 3t^2 - 2t^3
function smoothstep(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * ============================================================================
 * <ParticleMorph /> Component
 * ============================================================================
 */
export default function ParticleMorph({
  count = 640,
  colors = {
    primary: '#22ff99',       // Neon terminal green
    highlight: '#eafff4',     // Bright white-green sparkle
    glow: 'rgba(34, 255, 153, 0.08)' // Ambient backdrop glow
  },
  holdTime = 2500,           // Time (ms) to showcase each shape statically
  morphTime = 1500,          // Time (ms) to transition between shapes
  shapes = ['SPHERE', 'CUBE', 'TORUS', 'DOUBLE HELIX'],
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Responsive particle count: fewer particles on mobile devices for peak 60fps
  const effectiveCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.min(count, 360);
    }
    return count;
  }, [count]);

  // Current shape display name for the terminal UI overlay
  const [currentShapeName, setCurrentShapeName] = useState(shapes[0] || 'SPHERE');

  // Precompute target buffers for each shape (zero allocations in loop)
  const shapeBuffers = useMemo(() => {
    const buffers = {};
    shapes.forEach((name) => {
      const generator = SHAPE_GENERATORS[name.toUpperCase()] || generateSphere;
      buffers[name] = generator(effectiveCount);
    });
    return buffers;
  }, [shapes, effectiveCount]);

  // Per-particle static metadata (jitter offsets, highlights)
  const particleMeta = useMemo(() => {
    const jitterSeeds = new Float32Array(effectiveCount * 3);
    const isHighlight = new Uint8Array(effectiveCount);

    for (let i = 0; i < effectiveCount; i++) {
      const idx = i * 3;
      // Organic random curl vector for morph dispersion
      jitterSeeds[idx] = (Math.random() * 2 - 1) * 35;
      jitterSeeds[idx + 1] = (Math.random() * 2 - 1) * 35;
      jitterSeeds[idx + 2] = (Math.random() * 2 - 1) * 35;

      // ~14% particles rendered in ultra-bright highlight color
      isHighlight[i] = Math.random() < 0.14 ? 1 : 0;
    }

    return { jitterSeeds, isHighlight };
  }, [effectiveCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Canvas dimensions & device pixel ratio
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    // Use ResizeObserver for responsive dimension sync
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(container);

    // Visibility management: pause when offscreen or tab hidden
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) isVisible = false;
      else isVisible = true;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse / Touch parallax interaction state
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetParallaxX = normX * 0.45;
      targetParallaxY = -normY * 0.35;
    };

    const handlePointerLeave = () => {
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // ========================================================================
    // PRE-ALLOCATED TYPED BUFFERS (0 allocations in requestAnimationFrame loop)
    // ========================================================================
    const currentPositions = new Float32Array(effectiveCount * 3);
    const initialBuffer = shapeBuffers[shapes[0]] || shapeBuffers[Object.keys(shapeBuffers)[0]];
    currentPositions.set(initialBuffer);

    let currentShapeIndex = 0;
    let nextShapeIndex = (currentShapeIndex + 1) % shapes.length;

    let sourceBuffer = shapeBuffers[shapes[currentShapeIndex]];
    let targetBuffer = shapeBuffers[shapes[nextShapeIndex]];

    let phaseStartTime = performance.now();
    let isMorphing = false;

    // Continuous 3D rotation state
    let rotX = 0.22;
    let rotY = 0;
    const baseRotSpeedY = 0.007;

    // Camera Perspective projection settings
    const fov = 380;
    const cameraZ = 360;

    let animFrameId;

    // ========================================================================
    // MAIN RENDER LOOP
    // ========================================================================
    const render = (now) => {
      animFrameId = requestAnimationFrame(render);

      // Skip render calculations when off-screen or tab hidden
      if (!isVisible) return;

      const elapsed = now - phaseStartTime;

      if (!prefersReducedMotion) {
        if (!isMorphing) {
          // HOLD PHASE: Show current shape
          if (elapsed >= holdTime) {
            isMorphing = true;
            phaseStartTime = now;
            sourceBuffer = shapeBuffers[shapes[currentShapeIndex]];
            targetBuffer = shapeBuffers[shapes[nextShapeIndex]];
          }
        } else {
          // MORPH PHASE: Smoothly interpolate towards next shape
          const progress = Math.min(elapsed / morphTime, 1);
          const easeProgress = smoothstep(progress);

          // Bell-curve envelope for organic dispersion noise: peak at midpoint (progress = 0.5)
          const dispersion = Math.sin(progress * Math.PI);

          const { jitterSeeds } = particleMeta;

          for (let i = 0; i < effectiveCount; i++) {
            const idx = i * 3;
            const sx = sourceBuffer[idx];
            const sy = sourceBuffer[idx + 1];
            const sz = sourceBuffer[idx + 2];

            const tx = targetBuffer[idx];
            const ty = targetBuffer[idx + 1];
            const tz = targetBuffer[idx + 2];

            const jx = jitterSeeds[idx] * dispersion;
            const jy = jitterSeeds[idx + 1] * dispersion;
            const jz = jitterSeeds[idx + 2] * dispersion;

            // Smoothstep LERP + organic curl noise
            currentPositions[idx] = sx + (tx - sx) * easeProgress + jx;
            currentPositions[idx + 1] = sy + (ty - sy) * easeProgress + jy;
            currentPositions[idx + 2] = sz + (tz - sz) * easeProgress + jz;
          }

          if (progress >= 1) {
            // Morph complete: snap to exact target and advance index
            currentPositions.set(targetBuffer);
            isMorphing = false;
            phaseStartTime = now;
            currentShapeIndex = nextShapeIndex;
            nextShapeIndex = (currentShapeIndex + 1) % shapes.length;
            setCurrentShapeName(shapes[currentShapeIndex]);
          }
        }

        // Inertia damping for mouse parallax
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

        // Auto-rotation around Y + subtle tilt on X
        rotY += baseRotSpeedY;
      }

      // Clear previous canvas frame
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Optional soft radial depth glow behind particle cloud
      if (colors.glow) {
        const glowRadius = Math.min(width, height) * 0.45;
        const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
        radial.addColorStop(0, colors.glow);
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // Precalculate combined rotation angles (rotation + parallax)
      const effectiveRotX = rotX + currentParallaxY;
      const effectiveRotY = rotY + currentParallaxX;

      const cosX = Math.cos(effectiveRotX);
      const sinX = Math.sin(effectiveRotX);
      const cosY = Math.cos(effectiveRotY);
      const sinY = Math.sin(effectiveRotY);

      const { isHighlight } = particleMeta;

      // ======================================================================
      // 3D TRANSFORM, PERSPECTIVE PROJECTION & RENDER
      // ======================================================================
      for (let i = 0; i < effectiveCount; i++) {
        const idx = i * 3;
        const ox = currentPositions[idx];
        const oy = currentPositions[idx + 1];
        const oz = currentPositions[idx + 2];

        // 1. Rotate around Y axis
        const x1 = ox * cosY + oz * sinY;
        const y1 = oy;
        const z1 = -ox * sinY + oz * cosY;

        // 2. Rotate around X axis
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // 3. Perspective Projection: camera at (0, 0, cameraZ)
        const depth = z2 + cameraZ;
        if (depth <= 10) continue; // Behind near clipping plane

        const scale = fov / depth;
        const projX = cx + x2 * scale;
        const projY = cy + y2 * scale;

        // Depth cueing: particles closer to camera are larger & brighter
        // Normalized depth range: [-1, +1] approx
        const normZ = Math.max(-1, Math.min(1, z2 / 160));
        const alpha = Math.max(0.18, Math.min(1, 0.6 + normZ * 0.4));
        const radius = Math.max(0.7, (1.8 + normZ * 0.9) * scale * 0.7);

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);

        if (isHighlight[i] === 1) {
          ctx.fillStyle = colors.highlight;
          ctx.shadowColor = colors.highlight;
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = colors.primary;
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    };

    animFrameId = requestAnimationFrame(render);

    // ========================================================================
    // CLEANUP ON UNMOUNT
    // ========================================================================
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [
    effectiveCount,
    shapeBuffers,
    shapes,
    holdTime,
    morphTime,
    colors,
    particleMeta
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[340px] select-none overflow-hidden ${className}`}
      style={style}
    >
      {/* 3D Morphing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full cursor-crosshair"
      />

      {/* Terminal UI Status Overlay */}
      <div className="absolute top-3.5 left-4 pointer-events-none z-10 flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-emerald-500/20 font-mono text-[11px] text-emerald-400 tracking-wider shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span className="text-slate-400 uppercase font-semibold">Particle Morph //</span>
        <span className="font-bold text-white tracking-widest">{currentShapeName}</span>
      </div>
    </div>
  );
}
