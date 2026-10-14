import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates a glowing circular/text sprite for software symbols (< />, { }, =>, 01)
 */
function createTextSprite(text, color = '#06b6d4') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Background subtle glow circle
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
  grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();

  // Glass pill border
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.stroke();

  // Render text
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillText(text, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.75, 0.75, 1);
  return sprite;
}

export default function DevCore3D({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Optimized Renderer
    const scene = new THREE.Scene();

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    // Clamp DPR to 1.5 to guarantee silky smooth 60 FPS without GPU lag
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointCyan = new THREE.PointLight(0x06b6d4, 5, 20);
    pointCyan.position.set(4, 3, 5);
    scene.add(pointCyan);

    const pointEmerald = new THREE.PointLight(0x10b981, 5, 20);
    pointEmerald.position.set(-4, -3, 4);
    scene.add(pointEmerald);

    // 3. Central Software Engine Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. Geometric Polyhedron (Software Engine Core)
    const innerGeo = new THREE.DodecahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x05131f,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Neon Wireframe Cage
    const outerGeo = new THREE.DodecahedronGeometry(1.36, 0);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x22ff99,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5
    });
    const outerWireframe = new THREE.LineSegments(outerEdges, outerMat);
    coreGroup.add(outerWireframe);

    // B. Concentric Orbital Rings (Compilers / Event Loops)
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    // Orbit Ring 1 (Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.15, 0.018, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Orbit Ring 2 (Emerald)
    const ring2Geo = new THREE.TorusGeometry(2.55, 0.016, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 5;
    ringGroup.add(ring2);

    // Orbit Ring 3 (Sky Blue Equator)
    const ring3Geo = new THREE.TorusGeometry(2.9, 0.014, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.65
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.y = Math.PI / 4;
    ringGroup.add(ring3);

    // C. Software Developer Floating Glyphs (< />, { }, =>, 01)
    const sprite1 = createTextSprite('</>', '#06b6d4');
    sprite1.position.set(2.15, 0, 0);
    ring1.add(sprite1);

    const sprite2 = createTextSprite('{ }', '#10b981');
    sprite2.position.set(0, 2.55, 0);
    ring2.add(sprite2);

    const sprite3 = createTextSprite('=>', '#38bdf8');
    sprite3.position.set(-2.9, 0, 0);
    ring3.add(sprite3);

    const sprite4 = createTextSprite('01', '#a855f7');
    sprite4.position.set(0, -2.15, 0);
    ring1.add(sprite4);

    // D. Lightweight Data Stream Starfield (Only 250 particles for zero lag)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x06b6d4);
    const cEmerald = new THREE.Color(0x10b981);
    const cSky = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = Math.random() < 0.45 ? cCyan : Math.random() < 0.75 ? cEmerald : cSky;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Smooth Mouse Interaction & Drag State
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        mouseX = normX * 0.45;
        mouseY = normY * 0.45;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile Touch Support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouse.x;
        const deltaY = e.touches[0].clientY - prevMouse.y;
        targetRotY += deltaX * 0.012;
        targetRotX += deltaY * 0.012;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
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
      const newWidth = container.clientWidth || 450;
      const newHeight = container.clientHeight || 480;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 6. Smooth Zero-Lag Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let isVisible = true;

    // Pause when scrolled offscreen to guarantee 0% CPU consumption
    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    intersectionObserver.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth auto-spin when not dragging
      if (!isDragging) {
        targetRotY += 0.0035;
        targetRotX = THREE.MathUtils.lerp(targetRotX, mouseY * 0.5, 0.04);
      }

      // Smooth Lerp Damping
      coreGroup.rotation.y = THREE.MathUtils.lerp(coreGroup.rotation.y, targetRotY + mouseX * 0.35, 0.07);
      coreGroup.rotation.x = THREE.MathUtils.lerp(coreGroup.rotation.x, targetRotX, 0.07);

      // Core rotation & gentle breathing pulse
      innerCore.rotation.y -= 0.005;
      innerCore.rotation.x += 0.003;

      outerWireframe.rotation.y += 0.007;
      outerWireframe.rotation.z -= 0.003;

      const pulse = Math.sin(elapsed * 2.2) * 0.2 + 0.45;
      innerMat.emissiveIntensity = pulse;

      // Orbiting Rings
      ring1.rotation.z += 0.01;
      ring2.rotation.x += 0.008;
      ring3.rotation.y -= 0.006;

      // Subtle particle cloud drift
      particles.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Complete Memory & GPU Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerEdges.dispose();
      outerMat.dispose();

      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();

      sprite1.material.map.dispose();
      sprite1.material.dispose();
      sprite2.material.map.dispose();
      sprite2.material.dispose();
      sprite3.material.map.dispose();
      sprite3.material.dispose();
      sprite4.material.map.dispose();
      sprite4.material.dispose();

      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Software Architecture Core"
    />
  );
}
