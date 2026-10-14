import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Generates an authentic high-resolution laser-etched silicon die texture
 */
function createDieTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep metallic obsidian silicon background
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#04101c');
  grad.addColorStop(0.5, '#071829');
  grad.addColorStop(1, '#030c16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Microscopic silicon circuit grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.14)';
  ctx.lineWidth = 1;
  for (let x = 16; x < 512; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 16; y < 512; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Golden perimeter guard ring
  ctx.strokeStyle = 'rgba(252, 211, 77, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 472, 472);

  // Cyan inner corner brackets
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  const corners = [
    [32, 32], [480, 32], [32, 480], [480, 480]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Laser Etched Typography
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Header
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('◈ QUANTUM SILICON ARCHITECTURE ◈', 256, 100);

  // Central Core Brand
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 18;
  ctx.fillText('DHIRAJ KUMAR', 256, 210);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#22ff99';
  ctx.fillText('CORE // XTENSA LX7', 256, 270);

  // Specifications
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('240MHz DUAL-CORE • 8MB PSRAM', 256, 330);
  ctx.fillText('IoT & FULL-STACK ENGINE', 256, 360);

  // Security & Location Badge
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillStyle = '#fcd34d';
  ctx.fillText('BCE PATNA // CLUSTER 09 // ONLINE', 256, 420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function QuantumChip3D({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Optimized High-Performance Renderer
    const scene = new THREE.Scene();

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    // Guaranteed Zero-Clipping Auto-Fit Camera Math
    const updateCameraFit = (w, h) => {
      const aspect = w / (h || 1);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      // Maximum bounding radius of the chip + pins is ~1.85
      const maxRadius = 1.9;
      const padding = 1.35; // 35% generous breathing room on all sides
      const targetExtent = maxRadius * padding;

      const vFovRad = (camera.fov * Math.PI) / 180;
      const distV = targetExtent / Math.tan(vFovRad / 2);
      const distH = targetExtent / (aspect * Math.tan(vFovRad / 2));

      camera.position.z = Math.max(distV, distH, 5.8);
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
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Cyan Key Light
    const cyanLight = new THREE.PointLight(0x06b6d4, 6, 25);
    cyanLight.position.set(5, 4, 6);
    scene.add(cyanLight);

    // Emerald Fill Light
    const emeraldLight = new THREE.PointLight(0x10b981, 5, 25);
    emeraldLight.position.set(-5, -3, 5);
    scene.add(emeraldLight);

    // Warm Gold Backlight
    const goldLight = new THREE.PointLight(0xfcd34d, 3, 20);
    goldLight.position.set(0, 5, -4);
    scene.add(goldLight);

    // 3. Central Processor 3D Group
    const chipGroup = new THREE.Group();
    // Default pleasant isometric tilt
    chipGroup.rotation.x = 0.42;
    chipGroup.rotation.y = -0.65;
    scene.add(chipGroup);

    const chipSize = 2.4;
    const chipThickness = 0.18;

    // A. Ceramic Package Substrate (Black Obsidian)
    const substrateGeo = new THREE.BoxGeometry(chipSize, chipThickness, chipSize);
    const substrateMat = new THREE.MeshPhysicalMaterial({
      color: 0x050e18,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9
    });
    const substrateMesh = new THREE.Mesh(substrateGeo, substrateMat);
    chipGroup.add(substrateMesh);

    // Glowing Substrate Edge Perimeter Line
    const edgeGeo = new THREE.EdgesGeometry(substrateGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    chipGroup.add(edgeLines);

    // B. Central Mirror Silicon Die
    const dieSize = 1.35;
    const dieThickness = 0.08;
    const dieGeo = new THREE.BoxGeometry(dieSize, dieThickness, dieSize);
    const dieTexture = createDieTexture();

    const dieMat = [
      new THREE.MeshStandardMaterial({ color: 0x061828, metalness: 0.9, roughness: 0.2 }), // Right
      new THREE.MeshStandardMaterial({ color: 0x061828, metalness: 0.9, roughness: 0.2 }), // Left
      new THREE.MeshPhysicalMaterial({
        map: dieTexture,
        metalness: 0.92,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.2
      }), // Top Face (Laser Etched)
      new THREE.MeshStandardMaterial({ color: 0x061828 }), // Bottom
      new THREE.MeshStandardMaterial({ color: 0x061828, metalness: 0.9, roughness: 0.2 }), // Front
      new THREE.MeshStandardMaterial({ color: 0x061828, metalness: 0.9, roughness: 0.2 })  // Back
    ];
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.y = (chipThickness / 2) + (dieThickness / 2);
    chipGroup.add(dieMesh);

    // C. Gold Perimeter Solder Pins (8 pins on each of 4 edges = 32 pins)
    const pinCount = 8;
    const pinWidth = 0.12;
    const pinHeight = 0.06;
    const pinLength = 0.24;
    const pinGeo = new THREE.BoxGeometry(pinWidth, pinHeight, pinLength);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.15
    });

    const pinInstanced = new THREE.InstancedMesh(pinGeo, pinMat, 32);
    const dummy = new THREE.Object3D();
    const pinSpacing = chipSize / (pinCount + 1);

    let pinIdx = 0;
    for (let i = 1; i <= pinCount; i++) {
      const offset = -chipSize / 2 + i * pinSpacing;

      // Front edge pins
      dummy.position.set(offset, 0, chipSize / 2 + pinLength / 2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      pinInstanced.setMatrixAt(pinIdx++, dummy.matrix);

      // Back edge pins
      dummy.position.set(offset, 0, -chipSize / 2 - pinLength / 2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      pinInstanced.setMatrixAt(pinIdx++, dummy.matrix);

      // Left edge pins
      dummy.position.set(-chipSize / 2 - pinLength / 2, 0, offset);
      dummy.rotation.set(0, Math.PI / 2, 0);
      dummy.updateMatrix();
      pinInstanced.setMatrixAt(pinIdx++, dummy.matrix);

      // Right edge pins
      dummy.position.set(chipSize / 2 + pinLength / 2, 0, offset);
      dummy.rotation.set(0, Math.PI / 2, 0);
      dummy.updateMatrix();
      pinInstanced.setMatrixAt(pinIdx++, dummy.matrix);
    }
    pinInstanced.instanceMatrix.needsUpdate = true;
    chipGroup.add(pinInstanced);

    // D. Etched Circuit Bus Traces (Radiating from die to pins)
    const tracePoints = [];
    for (let i = 1; i <= pinCount; i++) {
      const pinOff = -chipSize / 2 + i * pinSpacing;
      const dieOff = THREE.MathUtils.clamp(pinOff * 0.55, -dieSize / 2 + 0.1, dieSize / 2 - 0.1);
      const yLvl = chipThickness / 2 + 0.01;

      // Front traces
      tracePoints.push(new THREE.Vector3(dieOff, yLvl, dieSize / 2));
      tracePoints.push(new THREE.Vector3(pinOff, yLvl, chipSize / 2));

      // Back traces
      tracePoints.push(new THREE.Vector3(dieOff, yLvl, -dieSize / 2));
      tracePoints.push(new THREE.Vector3(pinOff, yLvl, -chipSize / 2));

      // Left traces
      tracePoints.push(new THREE.Vector3(-dieSize / 2, yLvl, dieOff));
      tracePoints.push(new THREE.Vector3(-chipSize / 2, yLvl, pinOff));

      // Right traces
      tracePoints.push(new THREE.Vector3(dieSize / 2, yLvl, dieOff));
      tracePoints.push(new THREE.Vector3(chipSize / 2, yLvl, pinOff));
    }

    const traceGeo = new THREE.BufferGeometry().setFromPoints(tracePoints);
    const traceMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.65,
      linewidth: 1.5
    });
    const traceLines = new THREE.LineSegments(traceGeo, traceMat);
    chipGroup.add(traceLines);

    // E. Live Flowing Electron Pulses (Data Packets along buses)
    const packetCount = 24;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));

    const packetMat = new THREE.PointsMaterial({
      size: 0.065,
      color: 0x22ff99,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const packetPoints = new THREE.Points(packetGeo, packetMat);
    chipGroup.add(packetPoints);

    // F. Floating Holographic Data Orbit Rings
    const ringGeo = new THREE.TorusGeometry(1.85, 0.012, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.55
    });
    const dataRing = new THREE.Mesh(ringGeo, ringMat);
    dataRing.rotation.x = Math.PI / 2;
    dataRing.position.y = 0.05;
    chipGroup.add(dataRing);

    // G. Background Ambient Starlight Dust
    const starCount = 140;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 2.4 + Math.random() * 0.7;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPositions[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.024,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 4. Smooth Mouse Parallax & 360° Drag Interaction
    let targetRotX = 0.42;
    let targetRotY = -0.65;
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
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        mouseX = normX * 0.35;
        mouseY = normY * 0.35;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile Touch Gesture Support
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
        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.01;
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

      updateCameraFit(newWidth, newHeight);

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 6. Smooth Zero-Lag 60 FPS Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let isVisible = true;

    // Zero CPU consumption when scrolled out of viewport
    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    intersectionObserver.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Continuous gentle auto-spin when not dragging
      if (!isDragging) {
        targetRotY += 0.0035;
        targetRotX = THREE.MathUtils.lerp(targetRotX, 0.42 + mouseY * 0.35, 0.04);
      }

      // Smooth damping interpolation
      chipGroup.rotation.y = THREE.MathUtils.lerp(chipGroup.rotation.y, targetRotY + mouseX * 0.25, 0.08);
      chipGroup.rotation.x = THREE.MathUtils.lerp(chipGroup.rotation.x, targetRotX, 0.08);

      // Subtle breathing pulse on die emissive intensity
      const pulse = Math.sin(elapsed * 2.4) * 0.15 + 0.3;
      dieMat[2].emissiveIntensity = pulse;

      // Rotate holographic data ring
      dataRing.rotation.z = elapsed * 0.25;

      // Animate flowing electron packets along bus lines
      const posArr = packetPositions;
      const totalPairs = tracePoints.length / 2;
      for (let i = 0; i < packetCount; i++) {
        const pairIdx = (i % totalPairs) * 2;
        const pStart = tracePoints[pairIdx];
        const pEnd = tracePoints[pairIdx + 1];

        // Linear interpolation along bus trace
        const t = (elapsed * 0.85 + (i * 0.15)) % 1;
        posArr[i * 3] = THREE.MathUtils.lerp(pStart.x, pEnd.x, t);
        posArr[i * 3 + 1] = THREE.MathUtils.lerp(pStart.y, pEnd.y, t) + 0.015;
        posArr[i * 3 + 2] = THREE.MathUtils.lerp(pStart.z, pEnd.z, t);
      }
      packetGeo.attributes.position.needsUpdate = true;

      // Subtle starfield motion
      stars.rotation.y = elapsed * 0.015;

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

      substrateGeo.dispose();
      substrateMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      dieGeo.dispose();
      dieTexture.dispose();
      dieMat.forEach((m) => m.dispose());
      pinGeo.dispose();
      pinMat.dispose();
      pinInstanced.dispose();
      traceGeo.dispose();
      traceMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-visible ${className}`}
      title="3D Quantum Silicon Processor: Drag to rotate in 3D"
    />
  );
}
