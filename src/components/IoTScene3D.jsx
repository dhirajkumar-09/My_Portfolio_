import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * High-Precision Helper: Converts Latitude & Longitude to 3D Cartesian coordinates
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
 * Generates an authentic high-resolution Cyber Earth map texture
 */
function createEarthCanvasTexture(isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep space ocean background
  ctx.fillStyle = isDark ? '#020617' : '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle Lat/Long Grid
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.12)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw Realistic Continent Landmasses
  ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(2, 132, 199, 0.65)';
  ctx.strokeStyle = isDark ? '#38bdf8' : '#38bdf8';
  ctx.lineWidth = 2;

  // Function to render normalized continent polygons [ [x, y], ... ] (scale: 0-1)
  const drawPolygon = (points) => {
    ctx.beginPath();
    points.forEach(([nx, ny], idx) => {
      const px = nx * canvas.width;
      const py = ny * canvas.height;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // 1. North America
  drawPolygon([
    [0.12, 0.15], [0.18, 0.12], [0.28, 0.15], [0.32, 0.25],
    [0.26, 0.38], [0.22, 0.48], [0.19, 0.44], [0.14, 0.38], [0.08, 0.28]
  ]);

  // 2. South America
  drawPolygon([
    [0.24, 0.52], [0.32, 0.55], [0.35, 0.65], [0.31, 0.82],
    [0.26, 0.88], [0.23, 0.75], [0.21, 0.60]
  ]);

  // 3. Europe
  drawPolygon([
    [0.46, 0.18], [0.54, 0.18], [0.56, 0.28], [0.50, 0.34],
    [0.45, 0.32], [0.44, 0.24]
  ]);

  // 4. Africa
  drawPolygon([
    [0.46, 0.36], [0.58, 0.36], [0.62, 0.48], [0.58, 0.70],
    [0.52, 0.78], [0.46, 0.62], [0.42, 0.48]
  ]);

  // 5. Asia & India
  drawPolygon([
    [0.56, 0.18], [0.72, 0.16], [0.84, 0.22], [0.88, 0.35],
    [0.80, 0.45], [0.74, 0.50], [0.69, 0.54], [0.68, 0.44],
    [0.62, 0.38], [0.58, 0.30]
  ]);
  // India Subcontinent Accentuation
  drawPolygon([
    [0.66, 0.40], [0.71, 0.42], [0.72, 0.52], [0.69, 0.58],
    [0.66, 0.52], [0.64, 0.44]
  ]);

  // 6. Australia
  drawPolygon([
    [0.78, 0.66], [0.88, 0.64], [0.90, 0.76], [0.82, 0.82],
    [0.76, 0.75]
  ]);

  // Cyber Dot-matrix overlay for continents
  ctx.fillStyle = isDark ? '#a5f3fc' : '#bae6fd';
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * canvas.width;
    const ry = Math.random() * canvas.height;
    // Check if pixel is within continent
    const pixel = ctx.getImageData(rx, ry, 1, 1).data;
    if (pixel[3] > 100) {
      ctx.beginPath();
      ctx.arc(rx, ry, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

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

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 360;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 6.8);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, isDark ? 2.8 : 2.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const backRimLight = new THREE.DirectionalLight(0x10b981, isDark ? 1.8 : 1.2);
    backRimLight.position.set(-5, -2, -4);
    scene.add(backRimLight);

    // Root Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Center Earth tilted to showcase India/Asia by default
    globeGroup.rotation.x = 0.28;
    globeGroup.rotation.y = -1.55;

    // 1. Earth Sphere with Custom Canvas Map
    const globeRadius = 2.2;
    const earthGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const earthTexture = createEarthCanvasTexture(isDark);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.25,
      emissive: isDark ? 0x031d2e : 0x082f49,
      emissiveIntensity: isDark ? 0.4 : 0.2
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Translucent Atmosphere Shell (Glow Halo)
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.04, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isDark ? 0.18 : 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 3. Patna, India Primary IoT Epicenter Node (25.59° N, 85.13° E)
    const patnaCoords = { lat: 25.59, lng: 85.13 };
    const patnaVec = latLngToVector3(patnaCoords.lat, patnaCoords.lng, globeRadius);

    // Patna Glowing Beacon Pin
    const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const patnaPin = new THREE.Mesh(pinGeo, pinMat);
    patnaPin.position.copy(patnaVec);
    globeGroup.add(patnaPin);

    // Patna Pulsing Ground Ring
    const ringGeo = new THREE.RingGeometry(0.1, 0.18, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const patnaRing = new THREE.Mesh(ringGeo, ringMat);
    patnaRing.position.copy(patnaVec.clone().multiplyScalar(1.01));
    patnaRing.lookAt(patnaVec.clone().multiplyScalar(2));
    globeGroup.add(patnaRing);

    // Patna Telemetry Vertical Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.85
    });
    const patnaBeam = new THREE.Mesh(beamGeo, beamMat);
    patnaBeam.position.copy(patnaVec.clone().multiplyScalar(1.12));
    patnaBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), patnaVec.clone().normalize());
    globeGroup.add(patnaBeam);

    // 4. Global Target Tech Hubs
    const targetHubs = [
      { name: 'Bangalore', lat: 12.97, lng: 77.59 },
      { name: 'Tokyo', lat: 35.67, lng: 139.65 },
      { name: 'London', lat: 51.50, lng: -0.12 },
      { name: 'San Francisco', lat: 37.77, lng: -122.41 },
      { name: 'Frankfurt', lat: 50.11, lng: 8.68 }
    ];

    // Helper: Build a 3D Quadratic Curved Arc between two Lat/Lng points
    const createNetworkArc = (fromVec, toVec, heightMultiplier = 1.35) => {
      const mid = new THREE.Vector3().addVectors(fromVec, toVec).multiplyScalar(0.5);
      const dist = fromVec.distanceTo(toVec);
      const arcAltitude = globeRadius * (1 + (dist / (globeRadius * 2)) * 0.45 * heightMultiplier);
      mid.normalize().multiplyScalar(arcAltitude);

      const curve = new THREE.QuadraticBezierCurve3(fromVec, mid, toVec);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: isDark ? 0.45 : 0.6,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      return { arcLine, curve };
    };

    const packetBeacons = [];

    targetHubs.forEach((hub) => {
      const hubVec = latLngToVector3(hub.lat, hub.lng, globeRadius);

      // Hub Marker Dot
      const hubDotGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const hubDotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const hubDot = new THREE.Mesh(hubDotGeo, hubDotMat);
      hubDot.position.copy(hubVec);
      globeGroup.add(hubDot);

      // Cyber Connection Arc from Patna to Hub
      const { arcLine, curve } = createNetworkArc(patnaVec, hubVec);
      globeGroup.add(arcLine);

      // Telemetry Packet Traveling along Arc
      const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        blending: THREE.AdditiveBlending
      });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      globeGroup.add(packet);
      packetBeacons.push({ mesh: packet, curve, progress: Math.random() });
    });

    // 5. Orbital Satellite Ring
    const orbitRingGeo = new THREE.TorusGeometry(globeRadius * 1.38, 0.012, 8, 80);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
      blending: THREE.AdditiveBlending
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3.5;
    orbitRing.rotation.y = 0.2;
    globeGroup.add(orbitRing);

    // Orbiting Satellite
    const satGeo = new THREE.BoxGeometry(0.08, 0.04, 0.04);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    globeGroup.add(satellite);

    // 6. Ambient Space Particle Field
    const spaceParticlesCount = 200;
    const spaceGeo = new THREE.BufferGeometry();
    const spacePos = new Float32Array(spaceParticlesCount * 3);
    for (let i = 0; i < spaceParticlesCount * 3; i += 3) {
      const dist = 3.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      spacePos[i] = dist * Math.sin(phi) * Math.cos(theta);
      spacePos[i + 1] = dist * Math.sin(phi) * Math.sin(theta);
      spacePos[i + 2] = dist * Math.cos(phi);
    }
    spaceGeo.setAttribute('position', new THREE.BufferAttribute(spacePos, 3));
    const spaceMat = new THREE.PointsMaterial({
      color: isDark ? 0x94a3b8 : 0x0284c7,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const spaceField = new THREE.Points(spaceGeo, spaceMat);
    scene.add(spaceField);

    // Flawless Mouse / Touch 360° Drag Controls (No Snap-back, Smooth Inertia)
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let animationFrameId;
    let clock = new THREE.Clock();

    const onPointerDown = (clientX, clientY) => {
      isDragging = true;
      prevPointerX = clientX;
      prevPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;
      prevPointerX = clientX;
      prevPointerY = clientY;

      const rotSpeed = 0.0055;
      globeGroup.rotation.y += deltaX * rotSpeed;
      globeGroup.rotation.x += deltaY * rotSpeed;

      // Clamp vertical tilt to prevent inverted disorientation
      globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x));

      velocityX = deltaX * rotSpeed;
      velocityY = deltaY * rotSpeed;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Event Listeners on container
    const handleMouseDown = (e) => onPointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => onPointerUp();

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
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

    // Animation & Render Loop
    let pulseScale = 1;
    let pulseGrowing = true;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Idle Rotation & Inertia Damping
      if (!isDragging) {
        if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
          globeGroup.rotation.y += velocityX;
          globeGroup.rotation.x += velocityY;
          globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x));
          velocityX *= 0.94;
          velocityY *= 0.94;
        } else {
          // Continuous gentle auto-spin
          globeGroup.rotation.y += 0.0025;
        }
      }

      // Patna Pulsing Ring Animation
      if (pulseGrowing) {
        pulseScale += 0.02;
        if (pulseScale > 1.8) pulseGrowing = false;
      } else {
        pulseScale -= 0.02;
        if (pulseScale < 0.9) pulseGrowing = true;
      }
      patnaRing.scale.set(pulseScale, pulseScale, 1);
      ringMat.opacity = Math.max(0.2, 1 - (pulseScale - 1));

      // Network Data Packets Progress
      packetBeacons.forEach((item) => {
        item.progress += 0.012;
        if (item.progress > 1) item.progress = 0;
        const pt = item.curve.getPoint(item.progress);
        item.mesh.position.copy(pt);
      });

      // Satellite Orbit Position
      const satRadius = globeRadius * 1.38;
      const satAngle = time * 0.7;
      satellite.position.x = Math.cos(satAngle) * satRadius;
      satellite.position.y = Math.sin(satAngle) * satRadius * Math.sin(Math.PI / 3.5);
      satellite.position.z = Math.sin(satAngle) * satRadius * Math.cos(Math.PI / 3.5);

      // Space Field gentle drift
      spaceField.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);

      // Clean asset disposal
      earthGeo.dispose();
      earthTexture.dispose();
      earthMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      pinGeo.dispose();
      pinMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      spaceGeo.dispose();
      spaceMat.dispose();

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
    <div className={`relative w-full h-[360px] sm:h-[400px] flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />
    </div>
  );
}
