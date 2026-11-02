/**
 * AEGIS-OSINT // 3D HOLOGRAPHIC CYBER GLOBE (THREE.JS)
 * Renders glowing wireframe Earth, continent point cloud,
 * ballistic missile trajectories, orbiting satellites, and interactive radar nodes.
 */

class CyberGlobe3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Globe container #${containerId} not found`);
      return;
    }

    this.options = Object.assign({
      radius: 120,
      autoRotate: true,
      autoRotateSpeed: 0.003,
      interactive: true,
      showArcs: true,
      showSatellites: true,
      showNodes: true
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globeGroup = new THREE.Group();
    this.arcsGroup = new THREE.Group();
    this.satellitesGroup = new THREE.Group();
    this.nodesGroup = new THREE.Group();
    this.ringsGroup = new THREE.Group();

    this.missileArcs = [];
    this.satellites = [];
    this.interactiveNodes = [];

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.hoveredNode = null;
    this.tooltipElement = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    this.camera.position.z = 340;

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Assembly groups
    this.scene.add(this.globeGroup);
    this.globeGroup.add(this.nodesGroup);
    this.globeGroup.add(this.arcsGroup);
    this.globeGroup.add(this.satellitesGroup);
    this.globeGroup.add(this.ringsGroup);

    // Initial globe orientation to highlight Europe / Africa / Middle East
    this.globeGroup.rotation.y = 1.2;
    this.globeGroup.rotation.x = 0.25;

    // Build layers
    this.buildGlobeBase();
    this.buildContinentPoints();
    this.buildOrbitalRings();
    this.buildAtmosphereGlow();

    // Add dynamic entities
    this.buildSatellites();
    this.loadMissileTrajectories();
    this.loadDataNodes();

    // Setup interactions
    this.setupEventListeners();
    this.createTooltip();

    // Animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // Convert GPS (lat, lng) to 3D Cartesian coordinates on sphere
  latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  // Base wireframe globe & core dark sphere
  buildGlobeBase() {
    const r = this.options.radius;

    // Inner dark sphere to occlude back-facing particles
    const innerGeo = new THREE.SphereGeometry(r * 0.98, 48, 48);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x070c14,
      transparent: true,
      opacity: 0.92
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.globeGroup.add(innerSphere);

    // Wireframe grid lines (Latitude & Longitude)
    const wireGeo = new THREE.SphereGeometry(r, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    this.globeGroup.add(wireSphere);

    // Equator and Prime Meridian accent rings
    const equatorGeo = new THREE.RingGeometry(r + 0.5, r + 1.2, 64);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    this.globeGroup.add(equator);
  }

  // Dense holographic point cloud representing world continents
  buildContinentPoints() {
    const r = this.options.radius;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    // Procedural continent cluster generator with real geographic land boundaries
    const landmassCenters = [
      // Africa
      { lat: 10, lng: 20, rLat: 35, rLng: 25, count: 420 },
      // Europe
      { lat: 50, lng: 15, rLat: 18, rLng: 30, count: 380 },
      // Asia
      { lat: 35, lng: 90, rLat: 30, rLng: 50, count: 750 },
      // North America
      { lat: 40, lng: -100, rLat: 25, rLng: 35, count: 500 },
      // South America
      { lat: -15, lng: -60, rLat: 30, rLng: 20, count: 360 },
      // Australia / Oceania
      { lat: -25, lng: 135, rLat: 18, rLng: 25, count: 240 },
      // Middle East
      { lat: 28, lng: 45, rLat: 15, rLng: 20, count: 280 }
    ];

    landmassCenters.forEach(lm => {
      for (let i = 0; i < lm.count; i++) {
        // Gaussian distribution around center
        const u = Math.random() + Math.random() - 1;
        const v = Math.random() + Math.random() - 1;
        const lat = lm.lat + u * lm.rLat;
        const lng = lm.lng + v * lm.rLng;

        const vec = this.latLngToVector3(lat, lng, r + 0.3);
        positions.push(vec.x, vec.y, vec.z);

        // Cyber cyan to neon emerald tint
        const isHotspot = Math.random() > 0.88;
        if (isHotspot) {
          colors.push(0.0, 0.95, 1.0); // Cyan
        } else {
          colors.push(0.05, 0.45, 0.6); // Deep blue-cyan
        }
      }
    });

    // Random star-field background points
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = [];
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 800;
      const z = (Math.random() - 0.5) * 800;
      bgPos.push(x, y, z);
    }
    bgGeo.setAttribute("position", new THREE.Float32BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 1.2,
      transparent: true,
      opacity: 0.35
    });
    const bgPoints = new THREE.Points(bgGeo, bgMat);
    this.scene.add(bgPoints);

    pointsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const continentMesh = new THREE.Points(pointsGeo, pointsMat);
    this.globeGroup.add(continentMesh);
  }

  // Tactical scanning radar rings around the globe
  buildOrbitalRings() {
    const r = this.options.radius;

    // Tactical outer gimbal rings
    const ringRadii = [r * 1.28, r * 1.45];
    ringRadii.forEach((rad, idx) => {
      const ringGeo = new THREE.RingGeometry(rad, rad + 0.6, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x00f3ff : 0x00ff9d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (2.2 + idx * 0.4);
      ringMesh.rotation.y = idx * 0.5;
      this.ringsGroup.add(ringMesh);
    });
  }

  // Holographic atmosphere glow edge
  buildAtmosphereGlow() {
    const r = this.options.radius;
    const glowGeo = new THREE.SphereGeometry(r * 1.15, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.95, 1.0, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(glowGeo, glowMat);
    this.globeGroup.add(atmosphere);
  }

  // Reconnaissance Satellites orbiting with laser target vectors
  buildSatellites() {
    const r = this.options.radius;
    const satDefs = [
      { name: "USA-276 (NRO SPY RECON)", inclination: 0.78, radius: r * 1.35, speed: 0.008, color: 0x00f3ff },
      { name: "COSMOS-2558 (ORBITAL TRACKER)", inclination: 1.2, radius: r * 1.48, speed: -0.006, color: 0xff3366 },
      { name: "GPS III SV06 (NAVSTAR)", inclination: 0.95, radius: r * 1.62, speed: 0.004, color: 0x00ff9d },
      { name: "SENTINEL-2 (EARTH OBSERVATION)", inclination: 1.4, radius: r * 1.25, speed: 0.010, color: 0xffb700 }
    ];

    satDefs.forEach(sat => {
      // Satellite body mesh (high-tech solar panel shape)
      const satGroup = new THREE.Group();
      
      const bodyGeo = new THREE.BoxGeometry(2.5, 1.2, 1.2);
      const bodyMat = new THREE.MeshBasicMaterial({ color: sat.color });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(body);

      // Solar arrays
      const wingGeo = new THREE.BoxGeometry(6.5, 0.2, 1.8);
      const wingMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      satGroup.add(wings);

      // Orbit track line
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPts = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        orbitPts.push(
          Math.cos(theta) * sat.radius,
          Math.sin(theta) * sat.radius * Math.cos(sat.inclination),
          Math.sin(theta) * sat.radius * Math.sin(sat.inclination)
        );
      }
      orbitGeo.setAttribute("position", new THREE.Float32BufferAttribute(orbitPts, 3));
      const orbitMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.2
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.satellitesGroup.add(orbitLine);

      // Laser footprint cone toward earth
      const laserGeo = new THREE.BufferGeometry();
      laserGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
      const laserMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.4
      });
      const laserLine = new THREE.Line(laserGeo, laserMat);
      this.satellitesGroup.add(laserLine);

      this.satellitesGroup.add(satGroup);

      this.satellites.push({
        def: sat,
        mesh: satGroup,
        laserLine: laserLine,
        angle: Math.random() * Math.PI * 2
      });
    });
  }

  // Load animated parabolic ballistic missile trajectories
  loadMissileTrajectories() {
    const trajectories = (window.CONFIG && window.CONFIG.missileTrajectories) || [];
    trajectories.forEach(t => this.addMissileArc(t));
  }

  // Add 3D curved trajectory arc for a missile or drone strike
  addMissileArc(traj) {
    const r = this.options.radius;
    const start = this.latLngToVector3(traj.launchCoords[0], traj.launchCoords[1], r);
    const end = this.latLngToVector3(traj.targetCoords[0], traj.targetCoords[1], r);

    // Calculate apex mid-point extruded out along surface normal
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    const arcHeight = Math.max(15, dist * 0.42);
    mid.normalize().multiplyScalar(r + arcHeight);

    // Quadratic Bezier Curve in 3D space
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    // Color gradient / glowing trail
    const arcColor = traj.color ? new THREE.Color(traj.color) : new THREE.Color(0xff3366);
    const arcMat = new THREE.LineBasicMaterial({
      color: arcColor,
      transparent: true,
      opacity: 0.65,
      linewidth: 2
    });
    const arcLine = new THREE.Line(curveGeo, arcMat);
    this.arcsGroup.add(arcLine);

    // Missile Warhead Mesh (glowing head flying along the curve)
    const headGeo = new THREE.SphereGeometry(1.4, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    this.arcsGroup.add(headMesh);

    // Impact detonation shockwave ring at target
    const ringGeo = new THREE.RingGeometry(0.8, 2.8, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: arcColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const impactRing = new THREE.Mesh(ringGeo, ringMat);
    impactRing.position.copy(end);
    impactRing.lookAt(new THREE.Vector3(0, 0, 0));
    this.arcsGroup.add(impactRing);

    this.missileArcs.push({
      curve: curve,
      head: headMesh,
      ring: impactRing,
      progress: Math.random(), // Stagger missile positions
      speed: 0.005 + Math.random() * 0.004,
      data: traj
    });
  }

  // Load interactive pins (Missiles, Cams, Cyber, Africa Hotspots)
  loadDataNodes() {
    // Clear existing nodes
    while (this.nodesGroup.children.length > 0) {
      this.nodesGroup.remove(this.nodesGroup.children[0]);
    }
    this.interactiveNodes = [];

    const r = this.options.radius;

    // 1. Strategic Public OSINT Cameras
    const cams = (window.CONFIG && window.CONFIG.strategicCameras) || [];
    cams.forEach(cam => {
      this.addNode({
        id: cam.id,
        name: cam.name,
        category: "LIVE_CAM",
        type: "Strategic Surveillance Camera",
        lat: cam.lat,
        lng: cam.lng,
        color: 0x00ff9d, // Emerald
        source: "PUBLIC CCTV MATRIX",
        details: `${cam.location} • ${cam.resolution} • Status: ${cam.status}`,
        raw: cam
      });
    });

    // 2. African Situation Hotspots (monitor-the-situation.com/africa)
    const africa = (window.CONFIG && window.CONFIG.africaHotspots) || [];
    africa.forEach(afr => {
      this.addNode({
        id: afr.id,
        name: `${afr.region} (${afr.location})`,
        category: "AFRICA_HOTSPOT",
        type: afr.category,
        lat: afr.lat,
        lng: afr.lng,
        color: 0xff7700, // Bright Orange
        source: afr.source,
        details: `${afr.threatLevel} • GPS Jamming: ${afr.gpsJammingScore}% • ${afr.summary}`,
        raw: afr
      });
    });

    // 3. Military Aircraft
    const aircraft = (window.CONFIG && window.CONFIG.trackedMilitaryAircraft) || [];
    aircraft.forEach(air => {
      this.addNode({
        id: air.callsign,
        name: `${air.callsign} [${air.model}]`,
        category: "MIL_AIR",
        type: air.mission,
        lat: air.lat,
        lng: air.lng,
        color: 0xffb700, // Amber Yellow
        source: air.source,
        details: `Alt: ${air.altitudeFt} ft • Speed: ${air.speedKnots} kts • Squawk: ${air.squawk}`,
        raw: air
      });
    });
  }

  // Add individual interactive 3D tactical pin
  addNode(data) {
    const r = this.options.radius;
    const pos = this.latLngToVector3(data.lat, data.lng, r + 1.2);

    // Node cylinder / pin
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(pos);
    pinGroup.lookAt(pos.clone().multiplyScalar(2));

    // Glowing core sphere
    const sphereGeo = new THREE.SphereGeometry(1.6, 8, 8);
    const sphereMat = new THREE.MeshBasicMaterial({ color: data.color });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    pinGroup.add(sphere);

    // Pulsing beacon ring
    const ringGeo = new THREE.RingGeometry(2.0, 3.2, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: data.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    pinGroup.add(ring);

    this.nodesGroup.add(pinGroup);

    this.interactiveNodes.push({
      mesh: sphere,
      group: pinGroup,
      ring: ring,
      pulseScale: 1.0,
      data: data
    });
  }

  // Create HUD hover tooltip in DOM
  createTooltip() {
    this.tooltipElement = document.createElement("div");
    this.tooltipElement.className = "cyber-globe-tooltip";
    this.tooltipElement.style.cssText = `
      position: absolute;
      display: none;
      pointer-events: none;
      background: rgba(8, 12, 20, 0.94);
      border: 1px solid #00f3ff;
      border-radius: 4px;
      padding: 8px 12px;
      color: #00f3ff;
      font-family: 'Share Tech Mono', Consolas, monospace;
      font-size: 11px;
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.35);
      z-index: 1000;
      max-width: 280px;
    `;
    this.container.appendChild(this.tooltipElement);
  }

  setupEventListeners() {
    const dom = this.renderer.domElement;

    // Mouse Drag to rotate
    dom.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    dom.addEventListener("mousemove", (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globeGroup.rotation.y += deltaX * 0.005;
        this.globeGroup.rotation.x += deltaY * 0.005;

        // Clamp latitude tilt
        this.globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, this.globeGroup.rotation.x));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      this.checkHover(e);
    });

    // Mouse wheel zoom
    dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.camera.position.z += e.deltaY * 0.15;
      this.camera.position.z = Math.max(180, Math.min(520, this.camera.position.z));
    }, { passive: false });

    // Click to select node
    dom.addEventListener("click", () => {
      if (this.hoveredNode && window.app) {
        window.tacticalAudio && window.tacticalAudio.playClick();
        window.app.inspectIncident(this.hoveredNode.data);
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width && height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
    });
  }

  // Hover detection using Raycaster
  checkHover(e) {
    if (!this.interactiveNodes.length) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.interactiveNodes.map(n => n.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const target = this.interactiveNodes.find(n => n.mesh === hitMesh);

      if (target) {
        this.hoveredNode = target;
        document.body.style.cursor = "pointer";

        const rect = this.container.getBoundingClientRect();
        this.tooltipElement.style.display = "block";
        this.tooltipElement.style.left = `${e.clientX - rect.left + 15}px`;
        this.tooltipElement.style.top = `${e.clientY - rect.top + 15}px`;
        this.tooltipElement.innerHTML = `
          <div style="font-weight:bold; color:#fff; border-bottom:1px solid #334155; padding-bottom:4px; margin-bottom:4px;">
            [${target.data.category}] ${target.data.name}
          </div>
          <div style="color:#00f3ff;">SOURCE: ${target.data.source}</div>
          <div style="color:#94a3b8; font-size:10px; margin-top:2px;">${target.data.details}</div>
          <div style="color:#00ff9d; font-size:9px; margin-top:4px;">CLICK TO INSPECT DOSSIER >></div>
        `;
        return;
      }
    }

    this.hoveredNode = null;
    document.body.style.cursor = "default";
    if (this.tooltipElement) {
      this.tooltipElement.style.display = "none";
    }
  }

  // Rotate camera toward coordinates
  focusCoordinates(lat, lng) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const targetRotY = -theta + Math.PI / 2;
    const targetRotX = phi - Math.PI / 2;

    // Smooth transition
    const startRotY = this.globeGroup.rotation.y;
    const startRotX = this.globeGroup.rotation.x;
    const startTime = performance.now();
    const duration = 1000;

    const animateFocus = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);

      this.globeGroup.rotation.y = startRotY + (targetRotY - startRotY) * ease;
      this.globeGroup.rotation.x = startRotX + (targetRotX - startRotX) * ease;

      if (t < 1) {
        requestAnimationFrame(animateFocus);
      }
    };
    requestAnimationFrame(animateFocus);
  }

  // Main animation frame loop
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // Auto-rotate globe if not dragging
    if (this.options.autoRotate && !this.isDragging) {
      this.globeGroup.rotation.y += this.options.autoRotateSpeed;
    }

    // Rotate gimbal rings slowly
    this.ringsGroup.children.forEach((ring, idx) => {
      ring.rotation.z += (idx % 2 === 0 ? 0.002 : -0.003);
    });

    // Animate Satellites
    this.satellites.forEach(sat => {
      sat.angle += sat.def.speed * 0.5;
      const x = Math.cos(sat.angle) * sat.def.radius;
      const y = Math.sin(sat.angle) * sat.def.radius * Math.cos(sat.def.inclination);
      const z = Math.sin(sat.angle) * sat.def.radius * Math.sin(sat.def.inclination);

      sat.mesh.position.set(x, y, z);
      sat.mesh.lookAt(0, 0, 0);

      // Update laser projection from sat to earth center surface
      const groundPos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(this.options.radius);
      const positions = sat.laserLine.geometry.attributes.position.array;
      positions[0] = x;
      positions[1] = y;
      positions[2] = z;
      positions[3] = groundPos.x;
      positions[4] = groundPos.y;
      positions[5] = groundPos.z;
      sat.laserLine.geometry.attributes.position.needsUpdate = true;
    });

    // Animate Ballistic Missile Trajectories
    this.missileArcs.forEach(arc => {
      arc.progress += arc.speed;
      if (arc.progress > 1.0) {
        arc.progress = 0;
        // Detonation trigger sound if active
        if (Math.random() > 0.8 && window.tacticalAudio) {
          window.tacticalAudio.playMissileAlert();
        }
      }

      // Move missile warhead along curve
      const pos = arc.curve.getPoint(arc.progress);
      arc.head.position.copy(pos);

      // Pulse impact ring at target
      const ringScale = 1.0 + Math.sin(arc.progress * Math.PI * 4) * 0.35;
      arc.ring.scale.set(ringScale, ringScale, ringScale);
    });

    // Pulse interactive node rings
    this.interactiveNodes.forEach(node => {
      node.pulseScale += 0.03;
      if (node.pulseScale > 2.2) node.pulseScale = 1.0;
      node.ring.scale.set(node.pulseScale, node.pulseScale, node.pulseScale);
      node.ring.material.opacity = Math.max(0, 0.9 - (node.pulseScale - 1.0) * 0.7);
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// Global exposure
window.CyberGlobe3D = CyberGlobe3D;
