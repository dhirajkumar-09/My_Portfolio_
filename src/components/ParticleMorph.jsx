import React, { useEffect, useRef, useMemo } from 'react';

/**
 * ============================================================================
 * SHAPE GENERATORS (Structured & Height-Sorted for Liquid-Smooth Morphing)
 * Pre-sorted along the Y-axis so particles flow like fluid metal into each shape
 * rather than scattering into chaotic noise.
 * ============================================================================
 */

// 1. Fibonacci Sphere
function generateSphere(count, radius = 160) {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1 || 1)) * 2; // -1 to +1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * angleIncrement;
    const x = Math.cos(phi) * radiusAtY * radius;
    const z = Math.sin(phi) * radiusAtY * radius;
    points.push({ x, y: y * radius, z });
  }

  // Sort by Y ascending for coherent topological flow
  points.sort((a, b) => a.y - b.y);

  const buffer = new Float32Array(count * 3);
  points.forEach((p, i) => {
    buffer[i * 3] = p.x;
    buffer[i * 3 + 1] = p.y;
    buffer[i * 3 + 2] = p.z;
  });
  return buffer;
}

// 2. Structured Cyber Cube (Sharp Edges + Face Grid)
function generateCube(count, size = 135) {
  const points = [];
  const half = size;

  // Allocate 40% particles to the 12 wireframe edges for razor-sharp definition
  const edgeCount = Math.floor(count * 0.42);
  const faceCount = count - edgeCount;

  // 12 edges
  for (let i = 0; i < edgeCount; i++) {
    const edge = Math.floor(Math.random() * 12);
    const t = Math.random() * 2 - 1; // [-1, +1]
    let x = 0, y = 0, z = 0;

    switch (edge) {
      case 0: x = t * half; y = -half; z = -half; break;
      case 1: x = t * half; y = half; z = -half; break;
      case 2: x = t * half; y = -half; z = half; break;
      case 3: x = t * half; y = half; z = half; break;
      case 4: x = -half; y = t * half; z = -half; break;
      case 5: x = half; y = t * half; z = -half; break;
      case 6: x = -half; y = t * half; z = half; break;
      case 7: x = half; y = t * half; z = half; break;
      case 8: x = -half; y = -half; z = t * half; break;
      case 9: x = half; y = -half; z = t * half; break;
      case 10: x = -half; y = half; z = t * half; break;
      case 11: x = half; y = half; z = t * half; break;
      default: break;
    }
    points.push({ x, y, z });
  }

  // 6 faces
  for (let i = 0; i < faceCount; i++) {
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() * 2 - 1) * half;
    const v = (Math.random() * 2 - 1) * half;
    let x = 0, y = 0, z = 0;

    switch (face) {
      case 0: x = half; y = u; z = v; break;
      case 1: x = -half; y = u; z = v; break;
      case 2: x = u; y = half; z = v; break;
      case 3: x = u; y = -half; z = v; break;
      case 4: x = u; y = v; z = half; break;
      case 5: x = u; y = v; z = -half; break;
      default: break;
    }
    points.push({ x, y, z });
  }

  points.sort((a, b) => a.y - b.y);

  const buffer = new Float32Array(count * 3);
  points.forEach((p, i) => {
    buffer[i * 3] = p.x;
    buffer[i * 3 + 1] = p.y;
    buffer[i * 3 + 2] = p.z;
  });
  return buffer;
}

// 3. Torus (Donut Ring with 55° camera tilt for symmetrical vertical presence)
function generateTorus(count, majorRadius = 125, minorRadius = 45) {
  const points = [];
  // Tilt the torus by 55 degrees around the X-axis so its cross-section and central hole face the camera
  const tilt = (55 * Math.PI) / 180;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;

    const ringRad = majorRadius + minorRadius * Math.cos(v);
    const rawX = ringRad * Math.cos(u);
    const rawY = minorRadius * Math.sin(v);
    const rawZ = ringRad * Math.sin(u);

    // Rotate around X-axis so it fills the vertical and horizontal space symmetrically
    const x = rawX;
    const y = rawY * cosT - rawZ * sinT;
    const z = rawY * sinT + rawZ * cosT;
    points.push({ x, y, z });
  }

  points.sort((a, b) => a.y - b.y);

  const buffer = new Float32Array(count * 3);
  points.forEach((p, i) => {
    buffer[i * 3] = p.x;
    buffer[i * 3 + 1] = p.y;
    buffer[i * 3 + 2] = p.z;
  });
  return buffer;
}

// 4. Double Helix (DNA with connecting rungs)
function generateDoubleHelix(count, radius = 95, height = 320, turns = 2.4) {
  const points = [];

  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1 || 1)) * 2 - 1; // -1 to +1
    const y = t * (height / 2);
    const angle = t * Math.PI * 2 * turns;

    const isRung = i % 5 === 0; // 20% connecting ladder rungs
    let x = 0, z = 0;

    if (isRung) {
      const interp = (Math.random() * 2 - 1);
      x = Math.cos(angle) * radius * interp;
      z = Math.sin(angle) * radius * interp;
    } else {
      const phase = (i % 2 === 0) ? 0 : Math.PI; // Strand A or Strand B
      x = Math.cos(angle + phase) * radius;
      z = Math.sin(angle + phase) * radius;
    }
    points.push({ x, y, z });
  }

  // Already ordered along Y
  const buffer = new Float32Array(count * 3);
  points.forEach((p, i) => {
    buffer[i * 3] = p.x;
    buffer[i * 3 + 1] = p.y;
    buffer[i * 3 + 2] = p.z;
  });
  return buffer;
}

const SHAPE_GENERATORS = {
  SPHERE: generateSphere,
  CUBE: generateCube,
  TORUS: generateTorus,
  'DOUBLE HELIX': generateDoubleHelix
};

// Smoothstep interpolation formula: 3t^2 - 2t^3
function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * ============================================================================
 * <ParticleMorph /> Component
 * ============================================================================
 */
export default function ParticleMorph({
  count = 640,
  colors = {
    primary: '#22ff99',              // Neon terminal green
    highlight: '#eafff4',            // Bright white-green sparkle
    glow: 'rgba(34, 255, 153, 0.08)' // Soft ambient depth glow
  },
  holdTime = 2500,                  // Hold time on each shape (ms)
  morphTime = 1400,                 // Fluid morph duration (ms)
  shapes = ['SPHERE', 'CUBE', 'TORUS', 'DOUBLE HELIX'],
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Responsive particle count
  const effectiveCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.min(count, 350);
    }
    return count;
  }, [count]);

  // Keep references to props so useEffect runs ONCE without remounting on prop changes
  const propsRef = useRef({ colors, holdTime, morphTime, shapes });
  propsRef.current = { colors, holdTime, morphTime, shapes };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const currentShapes = propsRef.current.shapes;

    // Generate shape coordinate buffers
    const buffers = currentShapes.map((name) => {
      const gen = SHAPE_GENERATORS[name.toUpperCase()] || generateSphere;
      return gen(effectiveCount);
    });

    // Particle static metadata
    const isHighlight = new Uint8Array(effectiveCount);
    const noiseSeeds = new Float32Array(effectiveCount * 3);
    for (let i = 0; i < effectiveCount; i++) {
      isHighlight[i] = Math.random() < 0.12 ? 1 : 0;
      // Gentle harmonic dispersion amplitude (max 18px, smooth waves)
      noiseSeeds[i * 3] = (Math.random() * 2 - 1) * 16;
      noiseSeeds[i * 3 + 1] = (Math.random() * 2 - 1) * 16;
      noiseSeeds[i * 3 + 2] = (Math.random() * 2 - 1) * 16;
    }

    // High DPI Canvas Scaling
    let width = 0;
    let height = 0;
    let dpr = 1;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || 400;
      height = rect.height || 380;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    // Pause when off-screen or tab hidden
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Pointer Parallax
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetParallaxX = nx * 0.45;
      targetParallaxY = -ny * 0.35;
    };

    const handlePointerLeave = () => {
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // ========================================================================
    // STATEFUL ANIMATION BUFFERS (Lives entirely in useEffect scope)
    // ========================================================================
    const currentPositions = new Float32Array(effectiveCount * 3);
    currentPositions.set(buffers[0]); // Start at first shape (SPHERE)

    let shapeIdx = 0;
    let nextIdx = (shapeIdx + 1) % buffers.length;
    let isMorphing = false;
    let phaseStart = performance.now();

    // 3D Rotation State
    let rotY = 0;
    let rotX = 0.22;
    const rotSpeedY = 0.007;

    const fov = 420;
    const cameraZ = 350;

    let animId;

    // ========================================================================
    // HIGH-PERFORMANCE 60FPS RENDER LOOP
    // ========================================================================
    const render = (now) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const { holdTime, morphTime } = propsRef.current;
      const elapsed = now - phaseStart;

      if (!isMorphing) {
        // HOLD PHASE: Show current shape
        if (elapsed >= holdTime) {
          isMorphing = true;
          phaseStart = now;
        }
      } else {
        // MORPH PHASE: Liquid interpolation between shapeIdx & nextIdx
        const progress = Math.min(elapsed / morphTime, 1);
        const ease = smoothstep(progress);
        const wave = Math.sin(progress * Math.PI); // 0 -> 1 -> 0

        const source = buffers[shapeIdx];
        const target = buffers[nextIdx];

        for (let i = 0; i < effectiveCount; i++) {
          const idx = i * 3;
          const sx = source[idx];
          const sy = source[idx + 1];
          const sz = source[idx + 2];

          const tx = target[idx];
          const ty = target[idx + 1];
          const tz = target[idx + 2];

          // Gentle harmonic wave during transition
          const jx = noiseSeeds[idx] * wave;
          const jy = noiseSeeds[idx + 1] * wave;
          const jz = noiseSeeds[idx + 2] * wave;

          currentPositions[idx] = sx + (tx - sx) * ease + jx;
          currentPositions[idx + 1] = sy + (ty - sy) * ease + jy;
          currentPositions[idx + 2] = sz + (tz - sz) * ease + jz;
        }

        if (progress >= 1) {
          // Snap exact coordinates & advance to next shape
          currentPositions.set(target);
          isMorphing = false;
          phaseStart = now;
          shapeIdx = nextIdx;
          nextIdx = (shapeIdx + 1) % buffers.length;
        }
      }

      // Parallax smoothing & continuous spin
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;
      rotY += rotSpeedY;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Soft ambient radial glow
      const { colors: currentColors } = propsRef.current;
      if (currentColors.glow) {
        const glowRad = Math.min(width, height) * 0.45;
        const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRad);
        radial.addColorStop(0, currentColors.glow);
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      }

      // 3D Rotation matrices
      const effRotX = rotX + currentParallaxY;
      const effRotY = rotY + currentParallaxX;
      const cosX = Math.cos(effRotX);
      const sinX = Math.sin(effRotX);
      const cosY = Math.cos(effRotY);
      const sinY = Math.sin(effRotY);

      // Render all 3D particles
      for (let i = 0; i < effectiveCount; i++) {
        const idx = i * 3;
        const ox = currentPositions[idx];
        const oy = currentPositions[idx + 1];
        const oz = currentPositions[idx + 2];

        // 1. Rotate Y
        const x1 = ox * cosY + oz * sinY;
        const y1 = oy;
        const z1 = -ox * sinY + oz * cosY;

        // 2. Rotate X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // 3. Perspective Projection
        const depth = z2 + cameraZ;
        if (depth <= 10) continue;

        const scale = fov / depth;
        const projX = cx + x2 * scale;
        const projY = cy + y2 * scale;

        // Depth cueing
        const normZ = Math.max(-1, Math.min(1, z2 / 160));
        const alpha = Math.max(0.2, Math.min(1, 0.65 + normZ * 0.35));
        const radius = Math.max(0.8, (1.85 + normZ * 0.9) * scale * 0.7);

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);

        if (isHighlight[i] === 1) {
          ctx.fillStyle = currentColors.highlight;
          ctx.shadowColor = currentColors.highlight;
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = currentColors.primary;
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [effectiveCount]); // Runs cleanly ONCE for the canvas lifecycle!

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
    </div>
  );
}
