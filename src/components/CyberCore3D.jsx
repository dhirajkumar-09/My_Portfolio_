import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Radio, Rotate3d, Zap } from 'lucide-react';

export default function CyberCore3D({ className = '' }) {
  const mountRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 6, 20);
    cyanLight.position.set(4, 3, 4);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 6, 20);
    emeraldLight.position.set(-4, -3, 3);
    scene.add(emeraldLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 15);
    purpleLight.position.set(0, 4, -3);
    scene.add(purpleLight);

    // 3. Central Interactive 3D Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. Inner Glowing Polyhedron Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x071e2c,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    // B. Outer Wireframe Cage (Holographic Cyber Lattice)
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.35, 1);
    const wireframeEdges = new THREE.EdgesGeometry(wireframeGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x22ff99,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5
    });
    const wireframeMesh = new THREE.LineSegments(wireframeEdges, wireframeMaterial);
    coreGroup.add(wireframeMesh);

    // C. Gyroscope Orbital Tech Rings
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    // Ring 1 (Cyan Orbit)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.022, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Satellite nodes along Ring 1
    const sat1Geo = new THREE.SphereGeometry(0.09, 16, 16);
    const sat1Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5
    });
    const sat1 = new THREE.Mesh(sat1Geo, sat1Mat);
    sat1.position.set(2.1, 0, 0);
    ring1.add(sat1);

    // Ring 2 (Emerald Orbit)
    const ring2Geo = new THREE.TorusGeometry(2.45, 0.02, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    ringGroup.add(ring2);

    const sat2 = new THREE.Mesh(sat1Geo, new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x10b981,
      emissiveIntensity: 1.5
    }));
    sat2.position.set(0, 2.45, 0);
    ring2.add(sat2);

    // Ring 3 (Outer Sky-Blue Orbit)
    const ring3Geo = new THREE.TorusGeometry(2.75, 0.015, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.y = Math.PI / 4;
    ringGroup.add(ring3);

    // D. Surrounding Particle Starfield (Nebula Dust)
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x06b6d4); // Cyan
    const c2 = new THREE.Color(0x10b981); // Emerald
    const c3 = new THREE.Color(0x38bdf8); // Sky blue

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical shell
      const radius = 2.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() < 0.4 ? c1 : Math.random() < 0.7 ? c2 : c3;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Smooth Mouse Interaction & Drag State
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    let dragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      dragging = true;
      setIsDragging(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (dragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        mouseX = normX * 0.4;
        mouseY = normY * 0.4;
      }
    };

    const onMouseUp = () => {
      dragging = false;
      setIsDragging(false);
    };

    // Touch Support for Mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        dragging = true;
        setIsDragging(true);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (dragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.012;
        targetRotationX += deltaY * 0.012;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      dragging = false;
      setIsDragging(false);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 5. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 400;
      const newHeight = container.clientHeight || 450;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 6. Animation Loop (60 FPS Butter Smooth)
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle auto-rotation
      if (!dragging) {
        targetRotationY += 0.004;
        targetRotationX = THREE.MathUtils.lerp(targetRotationX, mouseY * 0.6, 0.04);
      }

      // Smooth Lerp Damping
      coreGroup.rotation.y = THREE.MathUtils.lerp(coreGroup.rotation.y, targetRotationY + mouseX * 0.4, 0.08);
      coreGroup.rotation.x = THREE.MathUtils.lerp(coreGroup.rotation.x, targetRotationX, 0.08);

      // Inner Core Pulse & Counter-Rotation
      coreMesh.rotation.y -= 0.006;
      coreMesh.rotation.x += 0.003;

      wireframeMesh.rotation.y += 0.008;
      wireframeMesh.rotation.z -= 0.004;

      // Pulse emissive glow
      const pulse = Math.sin(elapsedTime * 2.5) * 0.2 + 0.5;
      coreMaterial.emissiveIntensity = pulse;

      // Orbiting Rings Motion
      ring1.rotation.z += 0.012;
      ring2.rotation.x += 0.009;
      ring3.rotation.y -= 0.007;

      // Floating Particle Drifts
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      // Dispose Three.js objects
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeEdges.dispose();
      wireframeMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      sat1Geo.dispose();
      sat1Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      
      {/* Dynamic Background Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* Floating 3D Tech Badges */}
      
      {/* Top Left Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-lg pointer-events-none"
      >
        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>ESP32-S3 Core</span>
      </motion.div>

      {/* Top Right Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-lg pointer-events-none"
      >
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>MQTT • Telemetry</span>
      </motion.div>

      {/* Bottom Left Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-sky-500/30 text-[11px] font-mono text-sky-300 shadow-lg pointer-events-none"
      >
        <Zap className="w-3.5 h-3.5 text-sky-400" />
        <span>React 19 &amp; IoT</span>
      </motion.div>

      {/* Bottom Right Interactive Drag Hint */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-slate-400 shadow-lg pointer-events-none"
      >
        <Rotate3d className={`w-3.5 h-3.5 ${isDragging ? 'text-cyan-400 animate-spin' : 'text-slate-400'}`} />
        <span>{isDragging ? 'Rotating...' : 'Drag 3D'}</span>
      </motion.div>

      {/* Three.js Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-0"
        title="Click and drag to rotate 3D Cyber Core"
      />

    </div>
  );
}
