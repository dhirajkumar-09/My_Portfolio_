import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * IoTScene3D
 * High-end, luxury holographic 3D centerpiece.
 * Features an illuminated quantum polyhedron, concentric orbital rings,
 * floating particle cosmos, dynamic lighting, and silky mouse parallax.
 * Pure cinematic visual — zero clunky labels or badges.
 */
export default function IoTScene3D({ className = '' }) {
  const mountRef = useRef(null);
  const { isDark } = useTheme();
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

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.2);

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

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, isDark ? 3.5 : 2.5, 50);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, isDark ? 2.5 : 2.0, 50);
    emeraldLight.position.set(-5, -4, 4);
    scene.add(emeraldLight);

    // Root Hologram Hierarchy
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // Color Palette
    const colors = isDark
      ? {
          primaryWire: 0x38bdf8,
          coreFill: 0x06b6d4,
          rings: 0x22d3ee,
          nodes: 0x34d399,
          particles: 0xa5f3fc
        }
      : {
          primaryWire: 0x0284c7,
          coreFill: 0x0369a1,
          rings: 0x0ea5e9,
          nodes: 0x059669,
          particles: 0x0284c7
        };

    // 1. Central Faceted Crystal Core (Icosahedron Inner Core)
    const innerGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: colors.coreFill,
      emissive: colors.coreFill,
      emissiveIntensity: isDark ? 0.35 : 0.2,
      wireframe: false,
      transparent: true,
      opacity: isDark ? 0.38 : 0.25,
      shininess: 90,
      flatShading: true
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    hologramGroup.add(innerCore);

    // 2. Outer Geometric Wireframe Lattice
    const outerGeo = new THREE.IcosahedronGeometry(2.3, 1);
    const outerWireMat = new THREE.MeshBasicMaterial({
      color: colors.primaryWire,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.45 : 0.55
    });
    const outerWire = new THREE.Mesh(outerGeo, outerWireMat);
    hologramGroup.add(outerWire);

    // 3. Glowing Junction Nodes at Vertices
    const outerPos = outerGeo.getAttribute('position');
    const nodesCount = outerPos.count;
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodesCount * 3);

    for (let i = 0; i < nodesCount * 3; i++) {
      nodePositions[i] = outerPos.array[i];
    }
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: colors.nodes,
      size: 0.12,
      transparent: true,
      opacity: isDark ? 0.95 : 1,
      blending: THREE.AdditiveBlending
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMat);
    hologramGroup.add(nodes);

    // 4. Concentric Orbital Telemetry Rings (Gimbal System)
    const ringGroup = new THREE.Group();
    hologramGroup.add(ringGroup);

    const createGimbalRing = (radius, tube, tiltX, tiltY) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 12, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.rings,
        transparent: true,
        opacity: isDark ? 0.4 : 0.5,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ringA = createGimbalRing(3.1, 0.018, Math.PI / 3, 0.25);
    const ringB = createGimbalRing(3.6, 0.016, -Math.PI / 4, -0.35);
    ringGroup.add(ringA);
    ringGroup.add(ringB);

    // 5. Orbiting Luminous Signal Beacons
    const beaconGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const beaconMatA = new THREE.MeshBasicMaterial({
      color: colors.nodes,
      blending: THREE.AdditiveBlending
    });
    const beaconMatB = new THREE.MeshBasicMaterial({
      color: colors.primaryWire,
      blending: THREE.AdditiveBlending
    });
    const beaconA = new THREE.Mesh(beaconGeo, beaconMatA);
    const beaconB = new THREE.Mesh(beaconGeo, beaconMatB);
    ringGroup.add(beaconA);
    ringGroup.add(beaconB);

    // 6. Floating Cosmos Particle Nebula (280 ambient particles)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.8 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }

    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const nebulaMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.65 : 0.5,
      blending: THREE.AdditiveBlending
    });
    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    hologramGroup.add(nebula);

    // Mouse Parallax & Smooth Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let animationFrameId;
    let clock = new THREE.Clock();

    const handleWindowMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        hologramGroup.rotation.y += deltaX * 0.007;
        hologramGroup.rotation.x += deltaY * 0.007;
        return;
      }

      // Parallax tracking from entire viewport
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = normX * 0.65;
      targetRotationX = -normY * 0.45;
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - dragStartX;
        const deltaY = e.touches[0].clientY - dragStartY;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        hologramGroup.rotation.y += deltaX * 0.007;
        hologramGroup.rotation.x += deltaY * 0.007;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Fluid levitation / floating oscillation
      hologramGroup.position.y = Math.sin(time * 1.3) * 0.12;

      // Smooth mouse damping
      if (!isDragging) {
        hologramGroup.rotation.y += 0.005;
        hologramGroup.rotation.x += (targetRotationX - hologramGroup.rotation.x) * 0.05;
        hologramGroup.rotation.y += (targetRotationY - hologramGroup.rotation.y) * 0.05;
      }

      // Internal crystal counter-rotation
      innerCore.rotation.x = -time * 0.3;
      innerCore.rotation.y = time * 0.4;

      // Outer rings independent spin
      ringA.rotation.z = time * 0.5;
      ringB.rotation.z = -time * 0.4;

      // Orbiting beacon coordinates
      const rA = 3.1;
      beaconA.position.x = Math.cos(time * 1.2) * rA;
      beaconA.position.y = Math.sin(time * 1.2) * rA * Math.sin(Math.PI / 3);
      beaconA.position.z = Math.sin(time * 1.2) * rA * Math.cos(Math.PI / 3);

      const rB = 3.6;
      beaconB.position.x = Math.sin(time * 0.9) * rB;
      beaconB.position.y = Math.cos(time * 0.9) * rB * Math.cos(-Math.PI / 4);
      beaconB.position.z = Math.cos(time * 0.9) * rB * Math.sin(-Math.PI / 4);

      // Nebula gentle drift
      nebula.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);

      // Clean disposal of geometries and materials
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerWireMat.dispose();
      nodeGeometry.dispose();
      nodeMat.dispose();
      beaconGeo.dispose();
      beaconMatA.dispose();
      beaconMatB.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  if (!webGlSupported) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="w-48 h-48 rounded-full border border-cyan-500/30 animate-spin-slow flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-cyan-500/10 blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[340px] sm:h-[380px] flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" />
    </div>
  );
}
