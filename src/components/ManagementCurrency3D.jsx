import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Creates high-resolution procedural Guilloché currency wave patterns and executive markings
 */
function createCurrencyFaceTexture(isBack = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep obsidian-gold radial gradient background
  const bgGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
  bgGrad.addColorStop(0, '#1c1505');
  bgGrad.addColorStop(0.4, '#120e03');
  bgGrad.addColorStop(0.85, '#0a0802');
  bgGrad.addColorStop(1, '#050401');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-etched concentric security circles
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
  ctx.lineWidth = 1.5;
  for (let r = 80; r < 480; r += 24) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Sovereign Currency Guilloché waves (geometric rosette curves)
  ctx.save();
  ctx.translate(512, 512);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)';
  ctx.lineWidth = 1;
  const petals = 24;
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.ellipse(0, 180, 70, 260, Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Secondary Emerald Growth Wave
  ctx.save();
  ctx.translate(512, 512);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 16; i++) {
    ctx.rotate((Math.PI * 2) / 16);
    ctx.beginPath();
    ctx.ellipse(0, 120, 45, 170, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Polished Gold Outer Guard Rings
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(512, 512, 475, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(252, 211, 77, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(512, 512, 460, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.stroke();

  // Perimeter Tick Marks (60 ticks like an executive watch / luxury bullion)
  ctx.save();
  ctx.translate(512, 512);
  for (let i = 0; i < 60; i++) {
    ctx.rotate((Math.PI * 2) / 60);
    ctx.strokeStyle = i % 5 === 0 ? '#fbbf24' : 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = i % 5 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 460);
    ctx.lineTo(0, i % 5 === 0 ? 440 : 448);
    ctx.stroke();
  }
  ctx.restore();

  // Typography & Crest
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (!isBack) {
    // ------------------------------------------------
    // FRONT FACE: EXECUTIVE MANAGEMENT & CURRENCY CORE
    // ------------------------------------------------
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('✦ DHIRAJ KUMAR ✦', 512, 120);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('EXECUTIVE MANAGEMENT & BUSINESS ASSETS', 512, 155);

    // Multi-Currency Symbol Ring
    const symbols = ['₹', '$', '€', '¥', '₿', '£'];
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.fillStyle = '#fde68a';
    symbols.forEach((sym, idx) => {
      const angle = -Math.PI / 2 + (idx * Math.PI * 2) / symbols.length;
      const x = 512 + Math.cos(angle) * 315;
      const y = 512 + Math.sin(angle) * 315;
      ctx.fillText(sym, x, y);
    });

    // Central Monogram Shield
    ctx.save();
    ctx.translate(512, 512);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 24;

    // Diamond Crest
    ctx.beginPath();
    ctx.moveTo(0, -130);
    ctx.lineTo(130, 0);
    ctx.lineTo(0, 130);
    ctx.lineTo(-130, 0);
    ctx.closePath();
    ctx.stroke();

    // Inner Emerald Hexagon
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const px = Math.cos(a) * 85;
      const py = Math.sin(a) * 85;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore();

    // Center Big Currency Crest
    ctx.font = '900 76px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 30;
    ctx.fillText('DK', 512, 495);
    ctx.shadowBlur = 0;

    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('FINTECH & STRATEGY', 512, 555);

    // Bottom Quantitative Telemetry
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CAPITAL EFFICIENCY 99.8% • ALPHA +34.8%', 512, 860);

    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('STRATEGY • OPERATIONS • FINANCE • LEADERSHIP', 512, 895);

  } else {
    // ------------------------------------------------
    // BACK FACE: GLOBAL BUSINESS MATRIX & OPERATIONS
    // ------------------------------------------------
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('GLOBAL ASSET MATRIX', 512, 130);

    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('DECISION ARCHITECTURE & QUANTITATIVE SYSTEMS', 512, 165);

    // Business Tree / Flowchart Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    const nodes = [
      { label: 'STRATEGY', x: 512, y: 310 },
      { label: 'FINANCE', x: 330, y: 460 },
      { label: 'OPERATIONS', x: 694, y: 460 },
      { label: 'GROWTH', x: 390, y: 640 },
      { label: 'SCALE', x: 634, y: 640 },
      { label: 'CORE ROI', x: 512, y: 512 }
    ];

    // Connect lines
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.moveTo(512, 512);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    });

    // Draw node boxes
    nodes.forEach((n) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(n.x - 70, n.y - 20, 140, 40);
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect(n.x - 70, n.y - 20, 140, 40);

      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(n.label, n.x, n.y);
    });

    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fcd34d';
    ctx.fillText('BCE PATNA // MANAGEMENT INNOVATION CLUSTER', 512, 885);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates floating 3D Currency Token Badges ($, ₹, €, ₿, ¥)
 */
function createCurrencyTokenTexture(symbol, bgGradColor, borderCol) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#060b13';
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, bgGradColor);
  grad.addColorStop(1, '#05070c');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 116, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 116, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 96px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = borderCol;
  ctx.shadowBlur = 18;
  ctx.fillText(symbol, 128, 132);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ManagementCurrency3D({ className = '' }) {
  const containerRef = useRef(null);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    // Guaranteed Zero-Clipping Auto-Fit Camera Math
    const updateCameraFit = (w, h) => {
      const aspect = w / (h || 1);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      // Maximum bounding radius of the asset + orbital rings is ~2.7
      const maxRadius = 2.75;
      const padding = 1.35; // 35% generous breathing room
      const targetExtent = maxRadius * padding;

      const vFovRad = (camera.fov * Math.PI) / 180;
      const distV = targetExtent / Math.tan(vFovRad / 2);
      const distH = targetExtent / (aspect * Math.tan(vFovRad / 2));

      camera.position.z = Math.max(distV, distH, 6.2);
    };

    updateCameraFit(width, height);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. High-Tech Executive Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Warm Gold Key Light (Wealth & Currency)
    const goldKeyLight = new THREE.PointLight(0xfbbf24, 7, 30);
    goldKeyLight.position.set(6, 5, 7);
    scene.add(goldKeyLight);

    // Emerald Growth Fill Light (ROI & Analytics)
    const emeraldFillLight = new THREE.PointLight(0x10b981, 6, 30);
    emeraldFillLight.position.set(-6, -4, 6);
    scene.add(emeraldFillLight);

    // Cyan Technology Rim Light (Fintech Engine)
    const cyanRimLight = new THREE.PointLight(0x06b6d4, 4, 25);
    cyanRimLight.position.set(0, 6, -5);
    scene.add(cyanRimLight);

    // 3. Central Currency & Management Group
    const assetGroup = new THREE.Group();
    // Default executive presentation angle
    assetGroup.rotation.x = 0.32;
    assetGroup.rotation.y = -0.45;
    scene.add(assetGroup);

    // A. 3D Beveled Currency Bullion Coin
    const coinRadius = 1.55;
    const coinThickness = 0.22;
    const coinGeo = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 64);
    
    const frontTex = createCurrencyFaceTexture(false);
    const backTex = createCurrencyFaceTexture(true);

    // Cylinder materials: [side, top (front face), bottom (back face)]
    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x92400e, // Rich burnished gold edge
      metalness: 0.95,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0
    });

    const frontFaceMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTex,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0
    });

    const backFaceMaterial = new THREE.MeshPhysicalMaterial({
      map: backTex,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0
    });

    const coinMesh = new THREE.Mesh(coinGeo, [
      edgeMaterial,
      frontFaceMaterial,
      backFaceMaterial
    ]);
    // Rotate cylinder so faces align with Z-axis
    coinMesh.rotation.x = Math.PI / 2;
    assetGroup.add(coinMesh);

    // B. Beveled Gold Outer Torus Rim
    const outerRimGeo = new THREE.TorusGeometry(coinRadius + 0.02, 0.045, 16, 64);
    const outerRimMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      reflectivity: 1.0
    });
    const outerRimMesh = new THREE.Mesh(outerRimGeo, outerRimMat);
    assetGroup.add(outerRimMesh);

    // C. Serrated Knurling Ridges (Edge Grip for luxury coin)
    const knurlCount = 48;
    const knurlGroup = new THREE.Group();
    const knurlGeo = new THREE.BoxGeometry(0.04, 0.04, coinThickness * 0.9);
    const knurlMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      metalness: 0.95,
      roughness: 0.2
    });
    for (let i = 0; i < knurlCount; i++) {
      const angle = (i * Math.PI * 2) / knurlCount;
      const kMesh = new THREE.Mesh(knurlGeo, knurlMat);
      kMesh.position.x = Math.cos(angle) * (coinRadius + 0.015);
      kMesh.position.y = Math.sin(angle) * (coinRadius + 0.015);
      kMesh.rotation.z = angle;
      knurlGroup.add(kMesh);
    }
    assetGroup.add(knurlGroup);

    // D. Orbiting Ring 1: Capital Velocity Ring (Gold / Amber)
    const ring1Radius = 2.15;
    const ring1Geo = new THREE.TorusGeometry(ring1Radius, 0.016, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.85
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    assetGroup.add(ring1Mesh);

    // Traveling photons along Ring 1
    const photonCount = 3;
    const photons = [];
    const photonGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < photonCount; i++) {
      const pMesh = new THREE.Mesh(photonGeo, photonMat);
      assetGroup.add(pMesh);
      photons.push(pMesh);
    }

    // E. Orbiting Ring 2: Strategic Market Horizon (Emerald, Opposing Tilt)
    const ring2Radius = 2.5;
    const ring2Geo = new THREE.TorusGeometry(ring2Radius, 0.018, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.75
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 3.2;
    ring2Mesh.rotation.y = Math.PI / 5;
    assetGroup.add(ring2Mesh);

    // 4 Satellite Market Strategic Node spheres on Ring 2
    const marketNodes = [];
    const marketNodeGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const marketNodeColors = [0x10b981, 0x06b6d4, 0xf59e0b, 0xa855f7];
    for (let i = 0; i < 4; i++) {
      const mnMat = new THREE.MeshStandardMaterial({
        color: marketNodeColors[i],
        emissive: marketNodeColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const mnMesh = new THREE.Mesh(marketNodeGeo, mnMat);
      ring2Mesh.add(mnMesh);
      marketNodes.push(mnMesh);
    }

    // F. Floating 3D Currency Badges ($, ₹, €, ₿, ¥)
    const tokenConfigs = [
      { sym: '₹', color: 'rgba(16, 185, 129, 0.4)', border: '#10b981', dist: 2.7, speed: 0.9, phase: 0 },
      { sym: '$', color: 'rgba(245, 158, 11, 0.4)', border: '#f59e0b', dist: 2.8, speed: 0.7, phase: 1.3 },
      { sym: '€', color: 'rgba(6, 182, 212, 0.4)', border: '#06b6d4', dist: 2.6, speed: -0.85, phase: 2.7 },
      { sym: '₿', color: 'rgba(251, 191, 36, 0.4)', border: '#fbbf24', dist: 2.9, speed: 0.65, phase: 4.1 },
      { sym: '¥', color: 'rgba(168, 85, 247, 0.4)', border: '#a855f7', dist: 2.75, speed: -0.75, phase: 5.2 }
    ];

    const tokens = [];
    const tokenPlaneGeo = new THREE.CircleGeometry(0.24, 32);

    tokenConfigs.forEach((cfg) => {
      const tex = createCurrencyTokenTexture(cfg.sym, cfg.color, cfg.border);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(tokenPlaneGeo, mat);
      scene.add(mesh); // attached to scene to orbit around freely
      tokens.push({ mesh, cfg });
    });

    // G. Ambient Financial Data Star Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 8;
      dustPos[i + 1] = (Math.random() - 0.5) * 8;
      dustPos[i + 2] = (Math.random() - 0.5) * 5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xfde68a,
      transparent: true,
      opacity: 0.55
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 4. Mouse Tracking & Fluid Parallax
    let targetRotationX = 0.32;
    let targetRotationY = -0.45;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = -0.45 + x * 0.75;
      targetRotationX = 0.32 - y * 0.55;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 5. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 450;
      const newH = container.clientHeight || 480;
      renderer.setSize(newW, newH);
      updateCameraFit(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 6. 60 FPS Animation Loop
    let animationFrameId;
    let clock = { getElapsedTime: () => performance.now() * 0.001 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Fluid damped coin rotation
      assetGroup.rotation.y += (targetRotationY - assetGroup.rotation.y) * 0.045;
      assetGroup.rotation.x += (targetRotationX - assetGroup.rotation.x) * 0.045;

      // Gentle continuous executive float & oscillation
      assetGroup.position.y = Math.sin(t * 1.5) * 0.08;
      assetGroup.rotation.z = Math.sin(t * 0.8) * 0.04;

      // Ring 1 Photons
      photons.forEach((p, idx) => {
        const pAngle = t * 1.8 + (idx * Math.PI * 2) / photonCount;
        p.position.x = Math.cos(pAngle) * ring1Radius;
        p.position.y = Math.sin(pAngle) * ring1Radius;
        p.position.z = 0;
      });

      // Ring 2 Rotation & Satellites
      ring2Mesh.rotation.z = t * 0.35;
      marketNodes.forEach((mn, idx) => {
        const a = (idx * Math.PI * 2) / 4;
        mn.position.x = Math.cos(a) * ring2Radius;
        mn.position.y = Math.sin(a) * ring2Radius;
        mn.position.z = 0;
      });

      // Floating Currency Badges Orbit
      tokens.forEach(({ mesh, cfg }) => {
        const angle = t * cfg.speed * 0.4 + cfg.phase;
        const radius = cfg.dist;
        mesh.position.x = assetGroup.position.x + Math.cos(angle) * radius;
        mesh.position.y = assetGroup.position.y + Math.sin(angle * 1.3) * 0.65 + Math.sin(t * 2 + cfg.phase) * 0.12;
        mesh.position.z = assetGroup.position.z + Math.sin(angle) * (radius * 0.55);

        // Always face camera
        mesh.quaternion.copy(camera.quaternion);
      });

      // Subtle slow star dust drift
      dustParticles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & Complete Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries
      coinGeo.dispose();
      outerRimGeo.dispose();
      knurlGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      photonGeo.dispose();
      marketNodeGeo.dispose();
      tokenPlaneGeo.dispose();
      dustGeo.dispose();

      // Dispose Materials & Textures
      edgeMaterial.dispose();
      frontFaceMaterial.dispose();
      backFaceMaterial.dispose();
      outerRimMat.dispose();
      knurlMat.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
      photonMat.dispose();
      dustMat.dispose();
      frontTex.dispose();
      backTex.dispose();

      tokens.forEach(({ mesh }) => {
        if (mesh.material.map) mesh.material.map.dispose();
        mesh.material.dispose();
      });

      renderer.dispose();
    };
  }, []);

  // Telemetry cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mounting Point */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible"
        style={{ touchAction: 'none' }}
      />

      {/* Floating Glassmorphic Telemetry HUD Badges */}
      
      {/* Top Left: Market Alpha & Growth */}
      <div className="absolute -top-3 left-2 sm:left-4 z-20 pointer-events-none">
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/85 dark:bg-slate-950/85 border border-amber-500/30 backdrop-blur-md shadow-xl flex items-center gap-2.5 transform transition-all duration-300 hover:scale-105">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Market Alpha</div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>+34.8%</span>
              <span className="text-[10px] text-emerald-400">▲ EXPONENTIAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right: Executive FinTech & Capital */}
      <div className="absolute top-2 right-2 sm:right-4 z-20 pointer-events-none">
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/85 dark:bg-slate-950/85 border border-emerald-500/30 backdrop-blur-md shadow-xl flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Asset Velocity</div>
            <div className="text-xs font-bold text-emerald-400">99.8% OPTIMAL</div>
          </div>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs">
            ₹ / $
          </div>
        </div>
      </div>

      {/* Bottom Left: Strategic Management Pillars Pill */}
      <div className="absolute -bottom-2 left-2 sm:left-4 z-20 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 dark:bg-slate-950/85 border border-slate-700/60 backdrop-blur-md shadow-xl flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-300">
            {activeMetric === 0 && '✦ STRATEGIC MANAGEMENT'}
            {activeMetric === 1 && '✦ CAPITAL EFFICIENCY & ROI'}
            {activeMetric === 2 && '✦ GLOBAL CURRENCY MATRIX'}
          </span>
        </div>
      </div>

      {/* Bottom Right: Interactive Prompt */}
      <div className="absolute -bottom-2 right-2 sm:right-4 z-20 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-[10px] font-mono font-medium text-amber-300 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>3D DRAG / TILT</span>
        </div>
      </div>
    </div>
  );
}
