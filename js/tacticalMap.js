/**
 * AEGIS-OSINT // 2D TACTICAL MAP CONTROLLER (LEAFLET)
 * High-contrast military command center map with custom SVG pins,
 * radar sweep cones, ballistic trajectory polylines, and conflict polygons.
 */

class TacticalMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markerLayers = {
      missiles: L.layerGroup(),
      cams: L.layerGroup(),
      cyber: L.layerGroup(),
      africa: L.layerGroup(),
      aircraft: L.layerGroup(),
      radarRings: L.layerGroup()
    };
    this.init();
  }

  init() {
    const el = document.getElementById(this.containerId);
    if (!el) return;

    // Initialize Leaflet map with dark options
    this.map = L.map(this.containerId, {
      center: [25.0, 30.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Matter tile layer (CartoDB) with fallback
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Custom zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Add all layers
    Object.values(this.markerLayers).forEach(layer => layer.addTo(this.map));

    // Populate tactical data
    this.renderAllData();
  }

  // Create custom pulsing SVG tactical marker
  createTacticalIcon(category, color, label) {
    let iconSvg = '';
    if (category === 'MISSILE') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="m12 2 4 7-2 1v8l-2 4-2-4v-8l-2-1 4-7z"/><circle cx="12" cy="12" r="9" stroke="${color}" stroke-dasharray="2 2"/></svg>`;
    } else if (category === 'CAM') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
    } else if (category === 'CYBER') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>`;
    } else if (category === 'AFRICA') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><circle cx="12" cy="12" r="3" fill="${color}"/></svg>`;
    } else {
      // Aircraft / General
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2L9 9l-7 1 5 4-2 7 7-4 7 4-2-7 5-4-7-1-3-7z"/></svg>`;
    }

    return L.divIcon({
      className: 'tactical-map-icon',
      html: `
        <div class="map-pulse-container" style="border-color:${color};">
          <div class="map-pulse-ring" style="border-color:${color};"></div>
          <div class="map-icon-svg">${iconSvg}</div>
          ${label ? `<span class="map-icon-label" style="color:${color};">${label}</span>` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  // Render all active layers from CONFIG and dynamic feeds
  renderAllData() {
    this.renderCameras();
    this.renderMissiles();
    this.renderAfricaHotspots();
    this.renderMilitaryAircraft();
  }

  // Strategic Surveillance Cameras
  renderCameras() {
    this.markerLayers.cams.clearLayers();
    const cams = (window.CONFIG && window.CONFIG.strategicCameras) || [];

    cams.forEach(cam => {
      const icon = this.createTacticalIcon('CAM', '#00ff9d', cam.id.replace('cam-', '').toUpperCase());
      const marker = L.marker([cam.lat, cam.lng], { icon: icon });

      marker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header" style="color:#00ff9d;">[LIVE CAM] ${cam.name}</div>
          <div class="map-popup-sub">${cam.location} • ${cam.resolution}</div>
          <div class="map-popup-body">${cam.notes}</div>
          <div class="map-popup-status"><span class="pulse-dot-green"></span> ${cam.status} • ${cam.bandwidth}</div>
          <button class="map-popup-btn" onclick="window.app.openCameraModal('${cam.id}')">STREAM SURVEILLANCE FEED >></button>
        </div>
      `);

      this.markerLayers.cams.addLayer(marker);
    });
  }

  // Ballistic Missiles & Trajectories
  renderMissiles() {
    this.markerLayers.missiles.clearLayers();
    this.markerLayers.radarRings.clearLayers();
    const trajectories = (window.CONFIG && window.CONFIG.missileTrajectories) || [];

    trajectories.forEach(t => {
      // Launch marker
      const startIcon = this.createTacticalIcon('MISSILE', t.color || '#ff3366', 'LAUNCH');
      const startMarker = L.marker(t.launchCoords, { icon: startIcon });
      startMarker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header" style="color:${t.color || '#ff3366'};">[MISSILE LAUNCH] ${t.name}</div>
          <div class="map-popup-sub">ORIGIN: ${t.launchSite}</div>
          <div class="map-popup-body">Type: ${t.type} • Velocity: Mach ${t.velocityMach} • Apogee: ${t.apogeeKm} km</div>
          <div class="map-popup-status" style="color:#ff3366;">STATUS: ${t.status}</div>
        </div>
      `);
      this.markerLayers.missiles.addLayer(startMarker);

      // Target impact marker
      const endIcon = this.createTacticalIcon('MISSILE', '#ff0000', 'IMPACT');
      const endMarker = L.marker(t.targetCoords, { icon: endIcon });
      endMarker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header" style="color:#ff0000;">[IMPACT TARGET] ${t.targetSite}</div>
          <div class="map-popup-sub">DEFENSE ENGAGEMENT: ${t.status}</div>
          <div class="map-popup-body">Tracking Source: ${t.source}</div>
        </div>
      `);
      this.markerLayers.missiles.addLayer(endMarker);

      // Trajectory Curved Flight Line
      const latlngs = [t.launchCoords, t.targetCoords];
      const polyline = L.polyline(latlngs, {
        color: t.color || '#ff3366',
        weight: 2.5,
        opacity: 0.85,
        dashArray: '6, 6',
        className: 'animated-missile-line'
      });
      this.markerLayers.missiles.addLayer(polyline);

      // Interception / Air Defense range ring around target
      const rangeCircle = L.circle(t.targetCoords, {
        radius: 65000, // 65 km interception dome
        color: '#ff3366',
        fillColor: '#ff3366',
        fillOpacity: 0.08,
        weight: 1,
        dashArray: '4, 4'
      });
      this.markerLayers.radarRings.addLayer(rangeCircle);
    });
  }

  // Africa Flashpoints (monitor-the-situation.com/africa)
  renderAfricaHotspots() {
    this.markerLayers.africa.clearLayers();
    const hotspots = (window.CONFIG && window.CONFIG.africaHotspots) || [];

    hotspots.forEach(afr => {
      const icon = this.createTacticalIcon('AFRICA', '#ff7700', afr.threatLevel.split(' ')[0]);
      const marker = L.marker([afr.lat, afr.lng], { icon: icon });

      marker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header" style="color:#ff7700;">[AFRICA INTEL] ${afr.region}</div>
          <div class="map-popup-sub">${afr.location} • ${afr.threatLevel}</div>
          <div class="map-popup-body">${afr.summary}</div>
          <div class="map-popup-status" style="color:#ffaa00;">GPS Jamming Index: ${afr.gpsJammingScore}% (High Anomalies)</div>
          <div style="font-size:9px; color:#64748b; margin-top:4px;">SOURCE: ${afr.source}</div>
        </div>
      `);
      this.markerLayers.africa.addLayer(marker);

      // Tactical conflict hazard zone ring
      const hazardCircle = L.circle([afr.lat, afr.lng], {
        radius: 120000,
        color: '#ff7700',
        fillColor: '#ff7700',
        fillOpacity: 0.07,
        weight: 1,
        dashArray: '3, 6'
      });
      this.markerLayers.africa.addLayer(hazardCircle);
    });
  }

  // Military ISR Aircraft
  renderMilitaryAircraft() {
    this.markerLayers.aircraft.clearLayers();
    const aircraft = (window.CONFIG && window.CONFIG.trackedMilitaryAircraft) || [];

    aircraft.forEach(air => {
      const icon = this.createTacticalIcon('AIRCRAFT', '#ffb700', air.callsign);
      const marker = L.marker([air.lat, air.lng], { icon: icon });

      marker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header" style="color:#ffb700;">[MIL-AIR ISR] ${air.callsign}</div>
          <div class="map-popup-sub">${air.model} • ${air.country}</div>
          <div class="map-popup-body">Mission: ${air.mission}</div>
          <div class="map-popup-status">FL: ${air.altitudeFt} ft | SPD: ${air.speedKnots} kts | SQ: ${air.squawk}</div>
          <div style="font-size:9px; color:#64748b; margin-top:4px;">SOURCE: ${air.source}</div>
        </div>
      `);
      this.markerLayers.aircraft.addLayer(marker);
    });
  }

  // Add real-time dynamic Cyber Forensics incident marker (CISA / Feodo / URLhaus)
  addCyberIncident(incident) {
    if (!incident.location || !incident.location.lat) return;
    const icon = this.createTacticalIcon('CYBER', '#00f3ff', 'C2/IOC');
    const marker = L.marker([incident.location.lat, incident.location.lng], { icon: icon });

    marker.bindPopup(`
      <div class="map-popup-card">
        <div class="map-popup-header" style="color:#00f3ff;">[CYBER THREAT] ${incident.title}</div>
        <div class="map-popup-sub">Type: ${incident.type} • Severity: ${incident.severity}</div>
        <div class="map-popup-body">${incident.details || ''}</div>
        <div class="map-popup-status" style="color:#00f3ff; font-family:monospace;">IOC: ${incident.ioc || 'N/A'}</div>
        <button class="map-popup-btn" onclick="window.app.inspectIncident(${JSON.stringify(incident).replace(/"/g, '&quot;')})">INSPECT FORENSIC DOSSIER >></button>
      </div>
    `);

    this.markerLayers.cyber.addLayer(marker);
  }

  // Smoothly pan and zoom to coordinates
  flyTo(lat, lng, zoom = 6) {
    if (!this.map) return;
    this.map.flyTo([lat, lng], zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }

  // Filter layer visibility
  setFilter(category) {
    if (category === 'ALL') {
      Object.values(this.markerLayers).forEach(l => {
        if (!this.map.hasLayer(l)) this.map.addLayer(l);
      });
    } else if (category === 'MISSILE') {
      this.map.addLayer(this.markerLayers.missiles);
      this.map.addLayer(this.markerLayers.radarRings);
      this.map.removeLayer(this.markerLayers.cams);
      this.map.removeLayer(this.markerLayers.cyber);
      this.map.removeLayer(this.markerLayers.africa);
      this.map.removeLayer(this.markerLayers.aircraft);
    } else if (category === 'CAMS') {
      this.map.addLayer(this.markerLayers.cams);
      this.map.removeLayer(this.markerLayers.missiles);
      this.map.removeLayer(this.markerLayers.radarRings);
      this.map.removeLayer(this.markerLayers.cyber);
      this.map.removeLayer(this.markerLayers.africa);
      this.map.removeLayer(this.markerLayers.aircraft);
    } else if (category === 'CYBER') {
      this.map.addLayer(this.markerLayers.cyber);
      this.map.removeLayer(this.markerLayers.missiles);
      this.map.removeLayer(this.markerLayers.cams);
      this.map.removeLayer(this.markerLayers.radarRings);
      this.map.removeLayer(this.markerLayers.africa);
      this.map.removeLayer(this.markerLayers.aircraft);
    } else if (category === 'AFRICA') {
      this.map.addLayer(this.markerLayers.africa);
      this.map.removeLayer(this.markerLayers.missiles);
      this.map.removeLayer(this.markerLayers.cams);
      this.map.removeLayer(this.markerLayers.radarRings);
      this.map.removeLayer(this.markerLayers.cyber);
      this.map.removeLayer(this.markerLayers.aircraft);
      this.flyTo(10.0, 25.0, 4);
    }
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}

// Global exposure
window.TacticalMap = TacticalMap;
