import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Compass } from 'lucide-react';

export default function IoTScene3D({ className = '' }) {
  const mountRef = useRef(null);
  const { isDark } = useTheme();
  const [isInteracting, setIsInteracting] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init error:', e);
      setWebGlSupported(false);
      return;
    }

    // Dynamic Theme Palettes
    const palette = isDark
      ? {
          wireframe: 0x06b6d4, // Cyan-500
          nodes: 0x10b981,     // Emerald-500
          innerGlow: 0x38bdf8, // Sky-400
          rings: 0x0ea5e9,     // Sky-500
          particles: 0xa5f3fc  // Cyan-200
        }
      : {
          wireframe: 0x0284c7, // Sky-600
          nodes: 0x059669,     // Emerald-600
          innerGlow: 0x2563eb, // Blue-600
          rings: 0x0284c7,     // Sky-600
          particles: 0x0369a1  // Sky-700
        };

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Geodesic Icosahedron Wireframe (IoT Network Core)
    const sphereGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: palette.wireframe,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45
    });
    const wireframeSphere = new THREE.Mesh(sphereGeo, wireframeMat);
    rootGroup.add(wireframeSphere);

    // 2. Inner Glowing Core Sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: palette.innerGlow,
      transparent: true,
      opacity: isDark ? 0.15 : 0.2
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCore);

    // 3. Sensor Nodes at Vertices
    const posAttribute = sphereGeo.getAttribute('position');
    const nodesCount = posAttribute.count;
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodesCount * 3);

    for (let i = 0; i < nodesCount * 3; i++) {
      nodePositions[i] = posAttribute.array[i];
    }
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: palette.nodes,
      size: 0.1,
      transparent: true,
      opacity: isDark ? 0.9 : 1
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMat);
    rootGroup.add(nodes);

    // 4. Orbital Satellite Rings (Telemetry Orbits)
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    const createOrbitRing = (radius, tiltX, tiltZ) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.015, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: palette.rings,
        transparent: true,
        opacity: isDark ? 0.4 : 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.z = tiltZ;
      return ring;
    };

    const ring1 = createOrbitRing(2.9, Math.PI / 3, 0.2);
    const ring2 = createOrbitRing(3.4, -Math.PI / 4, -0.4);
    ringGroup.add(ring1);
    ringGroup.add(ring2);

    // 5. Orbiting Telemetry Beacons (Satellites)
    const beaconGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const beaconMat1 = new THREE.MeshBasicMaterial({ color: palette.nodes });
    const beacon1 = new THREE.Mesh(beaconGeo, beaconMat1);

    const beaconMat2 = new THREE.MeshBasicMaterial({ color: palette.innerGlow });
    const beacon2 = new THREE.Mesh(beaconGeo, beaconMat2);

    ringGroup.add(beacon1);
    ringGroup.add(beacon2);

    // 6. Floating Cloud Particles
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const dist = 3.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i] = dist * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = dist * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = dist * Math.cos(phi);
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: palette.particles,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.6 : 0.5
    });
    const dustParticles = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(dustParticles);

    // Animation & Mouse Interaction State
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let animationFrameId;
    let orbitAngle = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) {
        // Mild parallax tilt on hover
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = normX * 0.8;
        targetRotationX = normY * 0.8;
        return;
      }

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;

        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation
      if (!isDragging) {
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;
      }

      // Orbital motion
      orbitAngle += 0.02;
      const r1 = 2.9;
      beacon1.position.x = Math.cos(orbitAngle) * r1;
      beacon1.position.y = Math.sin(orbitAngle) * r1 * Math.sin(Math.PI / 3);
      beacon1.position.z = Math.sin(orbitAngle) * r1 * Math.cos(Math.PI / 3);

      const r2 = 3.4;
      beacon2.position.x = Math.sin(orbitAngle * 0.7) * r2;
      beacon2.position.y = Math.cos(orbitAngle * 0.7) * r2 * Math.cos(-Math.PI / 4);
      beacon2.position.z = Math.cos(orbitAngle * 0.7) * r2 * Math.sin(-Math.PI / 4);

      dustParticles.rotation.y -= 0.001;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);

      // Cleanup 3D assets
      sphereGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      nodeGeometry.dispose();
      nodeMat.dispose();
      beaconGeo.dispose();
      beaconMat1.dispose();
      beaconMat2.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  if (!webGlSupported) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <div className="w-44 h-44 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center animate-spin-slow">
          <Sparkles className="w-12 h-12 text-cyan-400" />
        </div>
        <p className="text-xs font-mono text-slate-400 mt-3">3D IoT Telemetry Twin</p>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`}>
      {/* 3D Canvas Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[360px] cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Floating 3D status badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-400 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span>3D IoT Node Twin</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/70 backdrop-blur-md text-[10px] font-mono text-slate-400 pointer-events-none">
        <Compass className="w-3 h-3 text-cyan-400" />
        <span>{isInteracting ? 'Rotating orbit...' : 'Drag to rotate in 3D'}</span>
      </div>
    </div>
  );
}
