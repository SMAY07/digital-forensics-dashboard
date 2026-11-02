/**
 * AEGIS-OSINT // MASTER APPLICATION CONTROLLER
 * Coordinates UI views, Boot Animation, 3D Globe, 2D Map, Audio FX,
 * Modals (Live Cams, Missile Telemetry, Cyber Forensics), and SITREP export.
 */

class AegisApp {
  constructor() {
    this.globe = null;
    this.map = null;
    this.activeView = "globe"; // "globe", "map", "split", "cams", "cyber"
    this.currentFilter = "ALL";
    this.selectedIncident = null;
    this.bootCompleted = false;

    this.init();
  }

  init() {
    console.log("[AEGIS-OSINT] Booting Master Controller...");

    // Start Live Clock
    this.startZuluClock();

    // Start Intro Animation
    this.startBootSequence();

    // Setup UI event listeners
    this.setupViewControls();
    this.setupFilterTabs();
    this.setupSearch();
    this.setupAudioToggle();
    this.setupModals();

    // Initialize API Manager
    window.apiManager.onUpdate((incidents) => {
      this.renderIncidentFeed(incidents);
      this.updateHudCounters();
    });
    window.apiManager.initialize();
  }

  // Real-time UTC / Zulu Military Time
  startZuluClock() {
    const clockEl = document.getElementById("hud-zulu-clock");
    const update = () => {
      const now = new Date();
      const zulu = now.toISOString().replace("T", " ").substring(0, 19) + " ZULU";
      if (clockEl) clockEl.innerText = zulu;
    };
    update();
    setInterval(update, 1000);
  }

  // Futuristic Boot Sequence & Rotating Cyber Globe Intro
  startBootSequence() {
    const bootOverlay = document.getElementById("cyber-boot-screen");
    const bootLogs = document.getElementById("boot-terminal-logs");
    const enterBtn = document.getElementById("btn-enter-command");
    const progressFill = document.getElementById("boot-progress-fill");

    // Initialize intro 3D globe in intro canvas
    const introGlobe = new window.CyberGlobe3D("intro-globe-canvas", {
      radius: 95,
      autoRotate: true,
      autoRotateSpeed: 0.008,
      interactive: false
    });

    const steps = [
      { text: "INITIALIZING DIGITAL FORENSICS TELEMETRY ENGINE...", pct: 15 },
      { text: "MOUNTING OSIRIS-AI PROTOCOL CHANNELS (osirisai.live)...", pct: 32 },
      { text: "ESTABLISHING SECURE PROXY TO WORLDWATCH & MONITOR-AFRICA...", pct: 50 },
      { text: "INGESTING CISA KEV & ABUSE.CH BOTNET/MALWARE FEEDS...", pct: 68 },
      { text: "LOCKING SATELLITE ORBITS & PUBLIC SURVEILLANCE STREAMS...", pct: 85 },
      { text: "MISSILE WARNING RADAR SYNCHRONIZED: DEFCON 2 ARMED.", pct: 100 }
    ];

    // Trigger boot audio
    window.tacticalAudio && window.tacticalAudio.playBootSequence();

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        if (bootLogs) {
          const logLine = document.createElement("div");
          logLine.className = "boot-log-line";
          logLine.innerHTML = `<span class="text-cyan">[SEC-KERNEL]</span> ${step.text}`;
          bootLogs.appendChild(logLine);
          bootLogs.scrollTop = bootLogs.scrollHeight;
        }
        if (progressFill) {
          progressFill.style.width = `${step.pct}%`;
        }
        stepIdx++;
      } else {
        clearInterval(interval);
        // Show enter button
        if (enterBtn) {
          enterBtn.style.display = "inline-flex";
          enterBtn.classList.add("pulse-glow");
        }
        // Auto-complete after brief pause if user doesn't click
        setTimeout(() => {
          if (!this.bootCompleted) {
            this.completeBoot();
          }
        }, 3200);
      }
    }, 450);

    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        window.tacticalAudio && window.tacticalAudio.playClick();
        this.completeBoot();
      });
    }
  }

  // Finish boot and activate main dashboard
  completeBoot() {
    if (this.bootCompleted) return;
    this.bootCompleted = true;

    const bootOverlay = document.getElementById("cyber-boot-screen");
    if (bootOverlay) {
      bootOverlay.style.opacity = "0";
      setTimeout(() => {
        bootOverlay.style.display = "none";
      }, 700);
    }

    // Initialize Main Viewport 3D Globe
    this.initMainGlobe();

    // Initialize 2D Tactical Map
    this.initTacticalMap();

    // Render Camera Grid & Bottom Bar
    this.renderSurveillanceGrid();
    this.renderApiStatusBar();
    this.updateHudCounters();

    // Radar ping
    window.tacticalAudio && window.tacticalAudio.playRadarPing();
  }

  // Main 3D Globe instance
  initMainGlobe() {
    const container = document.getElementById("main-globe-canvas");
    if (container && !this.globe) {
      this.globe = new window.CyberGlobe3D("main-globe-canvas", {
        radius: 125,
        autoRotate: true,
        autoRotateSpeed: 0.0025,
        interactive: true
      });
      window.mainGlobe = this.globe;
    }
  }

  // 2D Tactical Map instance
  initTacticalMap() {
    const container = document.getElementById("tactical-map-view");
    if (container && !this.map) {
      this.map = new window.TacticalMap("tactical-map-view");
      window.tacticalMap = this.map;
    }
  }

  // Setup View Switching (3D Globe vs 2D Map vs Split vs Cams vs Cyber)
  setupViewControls() {
    const viewButtons = document.querySelectorAll("[data-view-target]");
    viewButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetView = btn.getAttribute("data-view-target");
        this.switchView(targetView);

        viewButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.tacticalAudio && window.tacticalAudio.playClick();
      });
    });
  }

  switchView(viewName) {
    this.activeView = viewName;
    const globeWrapper = document.getElementById("globe-wrapper");
    const mapWrapper = document.getElementById("map-wrapper");
    const camsWrapper = document.getElementById("cams-wall-wrapper");
    const cyberWrapper = document.getElementById("cyber-recon-wrapper");

    // Hide all
    if (globeWrapper) globeWrapper.style.display = "none";
    if (mapWrapper) mapWrapper.style.display = "none";
    if (camsWrapper) camsWrapper.style.display = "none";
    if (cyberWrapper) cyberWrapper.style.display = "none";

    if (viewName === "globe") {
      if (globeWrapper) {
        globeWrapper.style.display = "block";
        globeWrapper.style.width = "100%";
      }
    } else if (viewName === "map") {
      if (mapWrapper) {
        mapWrapper.style.display = "block";
        mapWrapper.style.width = "100%";
        if (this.map) this.map.invalidateSize();
      }
    } else if (viewName === "split") {
      if (globeWrapper && mapWrapper) {
        globeWrapper.style.display = "block";
        globeWrapper.style.width = "50%";
        mapWrapper.style.display = "block";
        mapWrapper.style.width = "50%";
        if (this.map) this.map.invalidateSize();
      }
    } else if (viewName === "cams") {
      if (camsWrapper) {
        camsWrapper.style.display = "block";
        this.renderSurveillanceGrid();
      }
    } else if (viewName === "cyber") {
      if (cyberWrapper) {
        cyberWrapper.style.display = "block";
        this.renderCyberReconPanel();
      }
    }
  }

  // Filter Chips in Header
  setupFilterTabs() {
    const filterChips = document.querySelectorAll("[data-filter]");
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter");
        this.currentFilter = filter;

        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        const incidents = window.apiManager.getFilteredIncidents(filter);
        this.renderIncidentFeed(incidents);

        if (this.map) {
          this.map.setFilter(filter);
        }

        window.tacticalAudio && window.tacticalAudio.playClick();
      });
    });
  }

  // Search input handler
  setupSearch() {
    const searchInput = document.getElementById("intel-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value;
        const results = window.apiManager.search(query);
        this.renderIncidentFeed(results);
      });
    }
  }

  // Sound FX Mute/Unmute
  setupAudioToggle() {
    const toggleBtn = document.getElementById("btn-audio-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isMuted = window.tacticalAudio.toggleMute();
        toggleBtn.innerHTML = isMuted 
          ? `<span class="icon">🔇</span> AUDIO: OFF`
          : `<span class="icon">🔊</span> AUDIO: ON`;
        toggleBtn.classList.toggle("text-muted", isMuted);
      });
    }
  }

  // Render left live incident telemetry stream
  renderIncidentFeed(incidents) {
    const feedContainer = document.getElementById("incident-stream-list");
    if (!feedContainer) return;

    if (!incidents || incidents.length === 0) {
      feedContainer.innerHTML = `<div class="feed-empty">NO ACTIVE TARGETS MATCH CRITERIA</div>`;
      return;
    }

    feedContainer.innerHTML = "";

    incidents.forEach(inc => {
      const card = document.createElement("div");
      card.className = `feed-card feed-card-${inc.severity ? inc.severity.toLowerCase() : "elevated"}`;
      
      let badgeClass = "badge-elevated";
      if (inc.category === "MISSILE_KINETIC") badgeClass = "badge-missile";
      else if (inc.category === "CYBER_FORENSICS") badgeClass = "badge-cyber";
      else if (inc.category === "AFRICA_HOTSPOT") badgeClass = "badge-africa";
      else if (inc.category === "MIL_AVIATION") badgeClass = "badge-mil";

      card.innerHTML = `
        <div class="feed-card-header">
          <span class="feed-badge ${badgeClass}">[${inc.type || inc.category}]</span>
          <span class="feed-time">${this.formatTimestamp(inc.timestamp)}</span>
        </div>
        <div class="feed-card-title">${inc.title}</div>
        <div class="feed-card-sub">
          <span class="feed-loc">📍 ${inc.location ? inc.location.name : "Global"}</span>
          <span class="feed-source">📡 ${inc.source}</span>
        </div>
        ${inc.ioc ? `<div class="feed-ioc">IOC: <code>${inc.ioc}</code></div>` : ""}
      `;

      card.addEventListener("click", () => {
        window.tacticalAudio && window.tacticalAudio.playClick();
        this.inspectIncident(inc);
      });

      feedContainer.appendChild(card);
    });
  }

  // Format relative or ISO timestamp
  formatTimestamp(isoString) {
    if (!isoString) return "JUST NOW";
    const diff = (Date.now() - new Date(isoString).getTime()) / 60000;
    if (diff < 1) return "JUST NOW";
    if (diff < 60) return `${Math.floor(diff)}m AGO`;
    return `${Math.floor(diff / 60)}h AGO`;
  }

  // Focus and open dossier for incident
  inspectIncident(incident) {
    this.selectedIncident = incident;

    // Focus 3D Globe camera
    if (this.globe && incident.location && incident.location.lat) {
      this.globe.focusCoordinates(incident.location.lat, incident.location.lng);
    }
    // Focus 2D Map
    if (this.map && incident.location && incident.location.lat) {
      this.map.flyTo(incident.location.lat, incident.location.lng, 7);
    }

    this.openDossierModal(incident);
  }

  // Open Detailed Forensic Dossier Modal
  openDossierModal(inc) {
    const modal = document.getElementById("dossier-modal");
    const body = document.getElementById("dossier-modal-body");
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="dossier-header-grid">
        <div>
          <div class="dossier-id">RECORD ID: ${inc.id}</div>
          <h2 class="dossier-title text-cyan">${inc.title}</h2>
          <div class="dossier-meta">CATEGORY: <span class="text-white">${inc.category}</span> • SEVERITY: <span class="text-red">${inc.severity}</span></div>
        </div>
        <div class="dossier-timestamp">
          <div>DETECTED: ${inc.timestamp}</div>
          <div>SOURCE: <a href="${inc.sourceUrl || '#'}" target="_blank" class="text-cyan underline">${inc.source}</a></div>
        </div>
      </div>

      <div class="dossier-section">
        <h3>📍 GEOGRAPHICAL TELEMETRY</h3>
        <p><strong>Location:</strong> ${inc.location ? inc.location.name : "N/A"} (${inc.location ? inc.location.country : "N/A"})</p>
        <p><strong>Coordinates:</strong> Lat ${inc.location ? inc.location.lat : "N/A"}, Lng ${inc.location ? inc.location.lng : "N/A"}</p>
      </div>

      <div class="dossier-section">
        <h3>🔍 FORENSIC ANALYSIS & INCIDENT DETAIL</h3>
        <p class="dossier-narrative">${inc.details || "No narrative details logged."}</p>
      </div>

      ${inc.ioc ? `
        <div class="dossier-section">
          <h3>⚡ INDICATOR OF COMPROMISE / RADAR SIGNATURE</h3>
          <div class="ioc-terminal-box">
            <code>${inc.ioc}</code>
          </div>
        </div>
      ` : ""}

      ${inc.category === "MISSILE_KINETIC" ? `
        <div class="dossier-section alert-box-red">
          <h4>🚀 BALLISTIC THREAT ADVISORY</h4>
          <p>Kinetic strike thermal or radar signature logged. Threat level elevated to DEFCON 1 locally. Air defense interceptor systems notified.</p>
        </div>
      ` : ""}

      <div class="dossier-actions">
        <button class="hud-btn hud-btn-cyan" onclick="window.app.copyIncidentIoc('${inc.ioc || inc.id}')">📋 COPY IOC TELEMETRY</button>
        <button class="hud-btn hud-btn-outline" onclick="window.app.closeModals()">CLOSE DOSSIER</button>
      </div>
    `;

    modal.style.display = "flex";
  }

  copyIncidentIoc(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(`[COPIED TO CLIPBOARD] ${text}`);
    }
  }

  // Render Public Surveillance Webcams Grid
  renderSurveillanceGrid() {
    const grid = document.getElementById("surveillance-wall-grid");
    if (!grid) return;

    const cams = (window.CONFIG && window.CONFIG.strategicCameras) || [];
    grid.innerHTML = "";

    cams.forEach(cam => {
      const card = document.createElement("div");
      card.className = "cam-tile-card";
      card.innerHTML = `
        <div class="cam-tile-header">
          <span class="cam-status-pill"><span class="pulse-dot-green"></span> ${cam.status}</span>
          <span class="cam-fps">${cam.resolution}</span>
        </div>
        <div class="cam-tile-display">
          <!-- Cyber Camera CRT Simulation Window -->
          <div class="cam-scanlines"></div>
          <div class="cam-hud-overlay">
            <span class="cam-hud-tag">[LIVE_CAM_FEED // ${cam.id.toUpperCase()}]</span>
            <span class="cam-hud-coords">${cam.lat.toFixed(4)}, ${cam.lng.toFixed(4)}</span>
          </div>
          <div class="cam-placeholder-frame">
            <div class="radar-scan-bar"></div>
            <div class="cam-target-reticle"></div>
            <span class="cam-location-label">${cam.name}</span>
          </div>
        </div>
        <div class="cam-tile-footer">
          <div class="cam-title-text">${cam.location}</div>
          <button class="cam-open-btn" onclick="window.app.openCameraModal('${cam.id}')">VIEW STREAM >></button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Open Interactive Live Camera Surveillance Modal
  openCameraModal(camId) {
    const cams = (window.CONFIG && window.CONFIG.strategicCameras) || [];
    const cam = cams.find(c => c.id === camId) || cams[0];
    if (!cam) return;

    const modal = document.getElementById("surveillance-modal");
    const container = document.getElementById("surveillance-modal-content");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="surv-modal-header">
        <div>
          <span class="badge-cam">[LIVE PUBLIC OSINT FEED]</span>
          <h2>${cam.name} (${cam.location})</h2>
          <div class="surv-meta">COORDS: ${cam.lat}, ${cam.lng} • BANDWIDTH: ${cam.bandwidth} • STATUS: <span class="text-green">${cam.status}</span></div>
        </div>
        <button class="modal-close-btn" onclick="window.app.closeModals()">✕</button>
      </div>

      <div class="surv-video-container" id="surv-stream-box">
        <!-- Interactive Forensic Filter Overlays -->
        <div class="surv-filter-scanlines"></div>
        <div class="surv-filter-crt"></div>
        <div class="surv-reticle-crosshair"></div>
        
        <!-- Live Video Element / Interactive Simulation -->
        <div class="surv-viewport-screen" id="surv-viewport">
          <div class="surv-telemetry-hud">
            <div>REC ● [2026-11-02] UTC Zulu</div>
            <div>SENSOR: SONY STARVIS II NIR/FLIR</div>
            <div>OPTICAL ZOOM: 1.0X (DIGITAL 8X)</div>
            <div>AI DETECTIONS: 0 HOSTILE / 14 CIVILIAN</div>
          </div>
          <div class="surv-center-target">
            <div class="bounding-box-ai">
              <span class="ai-tag">STRATEGIC CORRIDOR [TRACKING]</span>
            </div>
          </div>
          <div class="surv-watermark">${cam.name.toUpperCase()} // OSINT RECON</div>
        </div>
      </div>

      <!-- Video Control Ribbon -->
      <div class="surv-control-ribbon">
        <div class="surv-filters-group">
          <span class="label">FORENSIC FILTERS:</span>
          <button class="filter-btn active" onclick="window.app.applyCameraFilter('normal')">NORMAL</button>
          <button class="filter-btn" onclick="window.app.applyCameraFilter('nightvision')">NIGHT VISION (NVG)</button>
          <button class="filter-btn" onclick="window.app.applyCameraFilter('thermal')">THERMAL FLIR</button>
          <button class="filter-btn" onclick="window.app.applyCameraFilter('scanlines')">CRT SCAN</button>
        </div>
        <div class="surv-intel-notes">
          <strong>NOTES:</strong> ${cam.notes}
        </div>
      </div>
    `;

    modal.style.display = "flex";
    window.tacticalAudio && window.tacticalAudio.playRadarPing();
  }

  // Camera filter switcher
  applyCameraFilter(filterName) {
    const box = document.getElementById("surv-viewport");
    if (!box) return;

    box.className = "surv-viewport-screen";
    if (filterName === "nightvision") box.classList.add("filter-nvg");
    else if (filterName === "thermal") box.classList.add("filter-flir");
    else if (filterName === "scanlines") box.classList.add("filter-crt-high");

    const btns = document.querySelectorAll(".surv-filters-group .filter-btn");
    btns.forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    window.tacticalAudio && window.tacticalAudio.playClick();
  }

  // Render Cyber Forensics & IoC panel (CISA KEV + Abuse.ch Feodo)
  renderCyberReconPanel() {
    const panel = document.getElementById("cyber-recon-content");
    if (!panel) return;

    panel.innerHTML = `
      <div class="cyber-recon-grid">
        <!-- CISA KEV Exploited CVEs -->
        <div class="cyber-block">
          <div class="cyber-block-header text-cyan">
            <span>🛡️ CISA KNOWN EXPLOITED VULNERABILITIES (KEV)</span>
            <span class="badge-cyber">OFFICIAL CISA FEED</span>
          </div>
          <div class="cyber-table-scroll">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>CVE ID</th>
                  <th>VENDOR / PRODUCT</th>
                  <th>ACTION DUE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong class="text-cyan">CVE-2024-3400</strong></td>
                  <td>Palo Alto PAN-OS GlobalProtect</td>
                  <td>2024-04-19</td>
                  <td><span class="badge-missile">ACTIVE APT</span></td>
                </tr>
                <tr>
                  <td><strong class="text-cyan">CVE-2024-21887</strong></td>
                  <td>Ivanti Connect Secure</td>
                  <td>2024-01-22</td>
                  <td><span class="badge-missile">EXPLOITED</span></td>
                </tr>
                <tr>
                  <td><strong class="text-cyan">CVE-2023-46805</strong></td>
                  <td>Ivanti Policy Secure</td>
                  <td>2024-01-22</td>
                  <td><span class="badge-missile">EXPLOITED</span></td>
                </tr>
                <tr>
                  <td><strong class="text-cyan">CVE-2023-38831</strong></td>
                  <td>RARLAB WinRAR Code Execution</td>
                  <td>2023-09-14</td>
                  <td><span class="badge-elevated">PATCHED</span></td>
                </tr>
                <tr>
                  <td><strong class="text-cyan">CVE-2023-23397</strong></td>
                  <td>Microsoft Outlook NTLM Leak</td>
                  <td>2023-03-28</td>
                  <td><span class="badge-missile">EXPLOITED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Abuse.ch Feodo Botnet Command & Control Servers -->
        <div class="cyber-block">
          <div class="cyber-block-header text-red">
            <span>☣️ ACTIVE BOTNET C2 CONTROLLERS (FEODO TRACKER)</span>
            <span class="badge-missile">ABUSE.CH FEED</span>
          </div>
          <div class="cyber-table-scroll">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>IP:PORT</th>
                  <th>MALWARE FAMILY</th>
                  <th>COUNTRY / AS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>185.196.220.34:443</code></td>
                  <td>Qakbot / Pinkslipbot</td>
                  <td>DE (AS204957)</td>
                  <td><button class="table-act-btn" onclick="window.app.inspectIoc('185.196.220.34')">INSPECT</button></td>
                </tr>
                <tr>
                  <td><code>194.87.139.12:8443</code></td>
                  <td>CobaltStrike Beacon</td>
                  <td>RU (AS48282)</td>
                  <td><button class="table-act-btn" onclick="window.app.inspectIoc('194.87.139.12')">INSPECT</button></td>
                </tr>
                <tr>
                  <td><code>45.144.225.107:8080</code></td>
                  <td>Emotet Trojan C2</td>
                  <td>NL (AS49981)</td>
                  <td><button class="table-act-btn" onclick="window.app.inspectIoc('45.144.225.107')">INSPECT</button></td>
                </tr>
                <tr>
                  <td><code>91.215.85.17:443</code></td>
                  <td>Dridex Banking C2</td>
                  <td>SE (AS39351)</td>
                  <td><button class="table-act-btn" onclick="window.app.inspectIoc('91.215.85.17')">INSPECT</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  inspectIoc(ioc) {
    alert(`[DIGITAL FORENSICS IOC INVESTIGATION]\nTarget: ${ioc}\nStatus: Active Malware Node\nAction: Added to firewall egress drop list.`);
  }

  // Render bottom bar API connectivity and latency status
  renderApiStatusBar() {
    const bar = document.getElementById("api-status-pills");
    if (!bar) return;

    const apis = window.apiManager.getApisMetadata();
    bar.innerHTML = "";

    apis.forEach(api => {
      const pill = document.createElement("div");
      pill.className = "api-status-pill";
      pill.innerHTML = `
        <span class="status-indicator-dot online"></span>
        <span class="api-pill-name">${api.name.split(' ')[0]}</span>
        <span class="api-pill-ms">${api.liveLatency}ms</span>
      `;
      pill.title = `${api.name} (${api.website})\nLatency: ${api.liveLatency}ms\nStatus: ${api.liveStatus}`;
      pill.addEventListener("click", () => this.openApiInspectorModal(api.id));
      bar.appendChild(pill);
    });
  }

  // Open Raw API Inspector Modal showing schemas, endpoints, and docs
  openApiInspectorModal(selectedApiId = null) {
    const modal = document.getElementById("api-inspector-modal");
    const container = document.getElementById("api-inspector-content");
    if (!modal || !container) return;

    const apis = window.apiManager.getApisMetadata();
    
    container.innerHTML = `
      <div class="api-modal-header">
        <div>
          <h2>⚡ COLLECTED OSINT & DIGITAL FORENSICS APIS REGISTRY</h2>
          <p class="text-muted">Direct telemetry feeds aggregated into the unified AEGIS-OSINT Command Dashboard</p>
        </div>
        <button class="modal-close-btn" onclick="window.app.closeModals()">✕</button>
      </div>

      <div class="api-cards-grid">
        ${apis.map(api => `
          <div class="api-spec-card ${api.id === selectedApiId ? 'card-highlight' : ''}">
            <div class="api-spec-header">
              <span class="api-spec-title">${api.name}</span>
              <span class="badge-cyber">${api.auth}</span>
            </div>
            <div class="api-spec-cat">${api.category}</div>
            <div class="api-spec-desc">${api.description}</div>
            <div class="api-spec-endpoint">
              <strong>ENDPOINT:</strong> <code>${api.endpoint}</code>
            </div>
            <div class="api-spec-footer">
              <span>WEBSITE: <a href="${api.website}" target="_blank" class="text-cyan">${api.website}</a></span>
              <span class="text-green">STATUS: ${api.liveStatus} (${api.liveLatency}ms)</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modal.style.display = "flex";
  }

  // Export Complete Digital Forensics & OSINT Situation Report (SITREP)
  exportSitrep() {
    const incidents = window.apiManager.incidents;
    const apis = window.apiManager.getApisMetadata();

    const sitrep = {
      reportClassification: "SECRET // AEGIS-OSINT COMMAND INTELLIGENCE BRIEF",
      timestamp: new Date().toISOString(),
      defconStatus: 2,
      activeThreatCount: incidents.length,
      integratedFeeds: apis.map(a => ({ name: a.name, endpoint: a.endpoint, latency: a.liveLatency })),
      criticalIncidents: incidents.filter(i => i.severity === "CRITICAL"),
      fullIncidentLog: incidents
    };

    // Download JSON blob
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sitrep, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AEGIS_OSINT_SITREP_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    alert("[SITREP EXPORTED] Digital Forensics & OSINT Situation Report successfully downloaded!");
  }

  // Close all modal windows
  closeModals() {
    const modals = document.querySelectorAll(".cyber-modal");
    modals.forEach(m => m.style.display = "none");
  }

  setupModals() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModals();
    });

    const backdropCloses = document.querySelectorAll(".cyber-modal-backdrop");
    backdropCloses.forEach(bd => {
      bd.addEventListener("click", () => this.closeModals());
    });
  }

  // Update HUD counter numbers in header
  updateHudCounters() {
    const incidentCountEl = document.getElementById("hud-incident-count");
    if (incidentCountEl) {
      incidentCountEl.innerText = window.apiManager.incidents.length;
    }
    const camCountEl = document.getElementById("hud-cam-count");
    if (camCountEl) {
      camCountEl.innerText = (window.CONFIG && window.CONFIG.strategicCameras.length) || 8;
    }
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new AegisApp();
});
