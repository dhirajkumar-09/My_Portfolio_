import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Converts Latitude & Longitude to 3D Cartesian coordinates on a sphere
 */
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Generates an elevated 3D quadratic bezier curve between two lat/lng coordinates
 */
function createCurvedArc(p1, p2, altitude = 0.45) {
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const distance = p1.distanceTo(p2);
  const normal = mid.clone().normalize();
  const midLength = mid.length();
  
  // Elevation scales with distance
  const peakHeight = midLength + distance * altitude;
  const controlPoint = normal.multiplyScalar(peakHeight);

  const curve = new THREE.QuadraticBezierCurve3(p1, controlPoint, p2);
  return curve;
}

export default function CyberGlobe3D({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    // Responsive auto-fit: guarantees the globe and arcs NEVER get clipped from top, bottom, or sides
    const updateCameraFit = (w, h) => {
      const aspect = w / (h || 1);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      // Maximum radius (globe radius 1.55 + max arc altitude 0.45 = ~2.0)
      const maxRadius = 2.05;
      const padding = 1.25; // 25% safety margin
      const targetExtent = maxRadius * padding;

      const vFovRad = (camera.fov * Math.PI) / 180;
      const distV = targetExtent / Math.tan(vFovRad / 2);
      const distH = targetExtent / (aspect * Math.tan(vFovRad / 2));

      camera.position.z = Math.max(distV, distH, 5.6);
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
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const pointCyan = new THREE.PointLight(0x06b6d4, 5, 20);
    pointCyan.position.set(5, 4, 6);
    scene.add(pointCyan);

    const pointEmerald = new THREE.PointLight(0x10b981, 4, 20);
    pointEmerald.position.set(-5, -3, 4);
    scene.add(pointEmerald);

    // 3. Globe Container Group (Rotates together)
    const globeGroup = new THREE.Group();
    // Default pleasant tilt for realistic planetary viewing
    globeGroup.rotation.x = 0.28;
    globeGroup.rotation.y = -1.2;
    scene.add(globeGroup);

    const globeRadius = 1.55;

    // A. Deep Oceanic Core Sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x030b14,
      emissive: 0x041824,
      emissiveIntensity: 0.4,
      roughness: 0.35,
      metalness: 0.85
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // B. Atmospheric Neon Rim Glow (Soft back-faced outer sphere)
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.05, 36, 36);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // C. Cyber Dot Matrix for Continents & Global Landmass
    // Generates realistic continent distribution using mathematical land density
    const totalDots = 1400;
    const dotPositions = new Float32Array(totalDots * 3);
    const dotColors = new Float32Array(totalDots * 3);

    const cyanCol = new THREE.Color(0x06b6d4);
    const emeraldCol = new THREE.Color(0x22ff99);
    const skyCol = new THREE.Color(0x7dd3fc);

    let dotIdx = 0;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < totalDots * 2.2 && dotIdx < totalDots; i++) {
      const y = 1 - (i / (totalDots * 2.2 - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * ((2 * Math.PI) / goldenRatio);

      // Convert to lat/long to test rough continent mask
      const lat = Math.asin(y) * (180 / Math.PI);
      const lng = ((phi % (2 * Math.PI)) * (180 / Math.PI)) - 180;

      // Simple procedural land probability filter (Americas, Eurasia, Africa, Australia)
      let isLand = false;
      
      // Eurasia & India
      if (lat >= 5 && lat <= 70 && lng >= 30 && lng <= 145) isLand = true;
      // India subcontinental focus
      if (lat >= 8 && lat <= 35 && lng >= 68 && lng <= 92) isLand = true;
      // North America
      if (lat >= 15 && lat <= 72 && lng >= -165 && lng <= -50) isLand = true;
      // South America
      if (lat >= -55 && lat <= 12 && lng >= -82 && lng <= -34) isLand = true;
      // Africa
      if (lat >= -35 && lat <= 36 && lng >= -18 && lng <= 52) isLand = true;
      // Australia
      if (lat >= -44 && lat <= -10 && lng >= 112 && lng <= 154) isLand = true;

      // Include sparse oceanic cyber nodes for high-tech aesthetic
      if (!isLand && Math.random() < 0.16) isLand = true;

      if (isLand) {
        const p = latLngToVector3(lat, lng, globeRadius * 1.008);
        dotPositions[dotIdx * 3] = p.x;
        dotPositions[dotIdx * 3 + 1] = p.y;
        dotPositions[dotIdx * 3 + 2] = p.z;

        // India region gets brighter emerald glow
        const isIndia = (lat >= 8 && lat <= 32 && lng >= 70 && lng <= 90);
        const col = isIndia ? emeraldCol : (Math.random() < 0.65 ? cyanCol : skyCol);

        dotColors[dotIdx * 3] = col.r;
        dotColors[dotIdx * 3 + 1] = col.g;
        dotColors[dotIdx * 3 + 2] = col.b;
        dotIdx++;
      }
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions.slice(0, dotIdx * 3), 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors.slice(0, dotIdx * 3), 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const dotPoints = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotPoints);

    // D. Global Software Hubs & Animated Data Arcs (GitHub Octoverse Style)
    const hubs = [
      { name: 'Patna (Dhiraj)', lat: 25.6, lng: 85.1, isOrigin: true },
      { name: 'Bengaluru', lat: 12.97, lng: 77.59 },
      { name: 'San Francisco', lat: 37.77, lng: -122.41 },
      { name: 'Tokyo', lat: 35.67, lng: 139.65 },
      { name: 'London', lat: 51.5, lng: -0.12 },
      { name: 'Frankfurt', lat: 50.11, lng: 8.68 },
      { name: 'Singapore', lat: 1.35, lng: 103.81 }
    ];

    const hubPoints = hubs.map((h) => ({
      ...h,
      pos: latLngToVector3(h.lat, h.lng, globeRadius * 1.01)
    }));

    // Render Hub Beacons
    const beaconGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const beaconOriginMat = new THREE.MeshBasicMaterial({ color: 0x22ff99 });
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    hubPoints.forEach((h) => {
      const mesh = new THREE.Mesh(beaconGeo, h.isOrigin ? beaconOriginMat : beaconMat);
      mesh.position.copy(h.pos);
      globeGroup.add(mesh);

      // Pulsing beacon ring for origin (Patna)
      if (h.isOrigin) {
        const ringGeo = new THREE.RingGeometry(0.05, 0.08, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x22ff99,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(h.pos);
        ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(ringMesh);
      }
    });

    // Create Curved Arcs from Patna to Global Hubs
    const patnaHub = hubPoints[0];
    const destinationHubs = hubPoints.slice(1);
    const arcCurves = [];
    const packetSprites = [];

    // Particle sprite for data packet
    const packetCanvas = document.createElement('canvas');
    packetCanvas.width = 64;
    packetCanvas.height = 64;
    const pCtx = packetCanvas.getContext('2d');
    const radGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    radGrad.addColorStop(0, '#ffffff');
    radGrad.addColorStop(0.3, '#22ff99');
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = radGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const packetTex = new THREE.CanvasTexture(packetCanvas);
    const packetMat = new THREE.SpriteMaterial({
      map: packetTex,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    destinationHubs.forEach((dest, idx) => {
      const curve = createCurvedArc(patnaHub.pos, dest.pos, 0.35);
      arcCurves.push(curve);

      // Render smooth arc line
      const points = curve.getPoints(45);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x06b6d4 : 0x22ff99,
        transparent: true,
        opacity: 0.55,
        linewidth: 1.5
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Create animated packet along the curve
      const sprite = new THREE.Sprite(packetMat);
      sprite.scale.set(0.12, 0.12, 1);
      globeGroup.add(sprite);
      packetSprites.push({ sprite, curve, speed: 0.22 + idx * 0.05, offset: idx * 0.2 });
    });

    // E. Background Distant Starfield (160 particles, well within safe bounds)
    const starCount = 160;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 2.4 + Math.random() * 0.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.024,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 4. Smooth Mouse Move & 360° Drag Interaction
    let targetRotX = 0.28;
    let targetRotY = -1.2;
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
        mouseX = normX * 0.3;
        mouseY = normY * 0.3;
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

    // 5. Responsive Resize
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

    // 6. Smooth 60 FPS Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let isVisible = true;

    // Zero CPU consumption when scrolled away
    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    intersectionObserver.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Continuous planetary auto-spin when not dragging
      if (!isDragging) {
        targetRotY += 0.003;
        targetRotX = THREE.MathUtils.lerp(targetRotX, 0.28 + mouseY * 0.35, 0.04);
      }

      // Smooth damping interpolation
      globeGroup.rotation.y = THREE.MathUtils.lerp(globeGroup.rotation.y, targetRotY + mouseX * 0.2, 0.08);
      globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetRotX, 0.08);

      // Animate Data Packets along Arcs
      packetSprites.forEach((item) => {
        const t = (elapsed * item.speed + item.offset) % 1;
        const pos = item.curve.getPoint(t);
        item.sprite.position.copy(pos);
      });

      // Background stars gentle sway
      stars.rotation.y = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Complete Cleanup
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

      sphereGeo.dispose();
      sphereMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      beaconGeo.dispose();
      beaconOriginMat.dispose();
      beaconMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      packetTex.dispose();
      packetMat.dispose();
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
      title="3D Cyber Globe: Drag to rotate world"
    />
  );
}
