# ⚡ AEGIS-OSINT // Digital Forensics & Threat Intelligence Command Center

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Operational%20DEFCON%202-red.svg)]()
[![Forensics](https://img.shields.io/badge/Domain-Digital%20Forensics%20%26%20OSINT-cyan.svg)]()
[![WebGL](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-00f3ff.svg)]()
[![Maps](https://img.shields.io/badge/Tactical%20Map-Leaflet%20Dark%20Matter-00ff9d.svg)]()

> **AEGIS-OSINT** is a multi-domain Open-Source Intelligence (OSINT) and Digital Forensics Command Dashboard. Built for threat intelligence analysts, digital forensics investigators, and cybersecurity researchers, it aggregates real-time kinetic conflict telemetry, cyber threats (C2 botnets, malware URLs, exploited CVEs), missile launch trajectories, military airspace reconnaissance (ISR), and strategic public CCTV surveillance into a single unified situational awareness interface.

---

## 🌟 Key Highlights & Visual Experience

* **Holographic 3D Cyber Globe (Three.js WebGL)**: An interactive 3D globe rendered with custom wireframe latitude/longitude rings, continent particle matrices, dynamic ballistic missile trajectory arcs with real-time impact shockwaves, and orbital reconnaissance satellites with laser ground footprints.
* **Cyber Security Boot Sequence**: Cinematic cyber command boot sequence with telemetry kernel logs, audio synthesis, and rotating 3D Earth visualization.
* **Multi-Domain Intelligence Aggregation**: Bridges the gap between **Physical Kinetic Warfare** (missile strikes, artillery thermal anomalies, air raid sirens) and **Digital Cyber Forensics** (APT exploits, Botnet Command & Control servers, malware staging domains).
* **Strategic Public OSINT Surveillance Matrix**: Live public camera feeds from high-tension geopolitical chokepoints (Kyiv Maidan, Bab-el-Mandeb Strait, Taipei 101, Bosphorus Strait, Port of Odesa) equipped with **Night Vision (NVG)**, **FLIR Thermal**, and **CRT Scanline** forensic filters.
* **Dedicated Africa Conflict Radar**: Specialized situational awareness layer for African geopolitical crises (Sudan civil war, Sahel drone warfare, Eastern DRC unrest, and GPS jamming indexes) inspired by *Monitor The Situation*.
* **Zero-Dependency Procedural Audio**: In-browser tactical audio synthesis (radar pings, alert klaxons, UI chirps) built using the native Web Audio API (no external sound files required).
* **SITREP Generator**: One-click generation and export of formal Digital Forensics Situation Reports in structured JSON.

---

## 📡 Collected & Aggregated API Registry

The dashboard integrates feeds inspired by leading intelligence platforms and open telemetry APIs:

| # | Intelligence Source | Category | Endpoint / Mechanism | Public Auth |
|---|---|---|---|---|
| **1** | **[Osiris AI](https://osirisai.live)** | Global OSINT & Kinetic Radar | `https://osirisai.live/api/oi` | Public Keyless |
| **2** | **[WorldWatch UK](https://worldwatch.uk)** | Geopolitical Alert Feed | `https://world-watch.news/feed/` | Public RSS/JSON |
| **3** | **[Monitor The Situation (Africa)](https://monitor-the-situation.com/africa)** | Conflict & GPS Jamming Monitor | `https://monitor-the-situation.com/api/africa-events` | Public Open |
| **4** | **[NASA FIRMS](https://firms.modaps.eosdis.nasa.gov)** | Missile & Artillery Thermal Anomalies | `https://firms.modaps.eosdis.nasa.gov/api/area/csv/...` | Open Community |
| **5** | **[CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)** | Digital Forensics / Exploited CVEs | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` | Public CISA |
| **6** | **[Abuse.ch Feodo Tracker](https://feodotracker.abuse.ch)** | Botnet Command-and-Control (C2) | `https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json` | Public Open |
| **7** | **[Abuse.ch URLhaus](https://urlhaus.abuse.ch)** | Malware Payloads & Ransomware Drops | `https://urlhaus-api.abuse.ch/v1/urls/recent/` | Public Open |
| **8** | **[ADS-B Lol / OpenSky](https://adsb.lol)** | Military Reconnaissance Flights (ISR) | `https://api.adsb.lol/v2/mil` | Crowdsourced Open |
| **9** | **[USGS Seismic Monitor](https://earthquake.usgs.gov)** | Detonations & Seismic Shockwaves | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` | Public USGS |
| **10** | **[CelesTrak](https://celestrak.org)** | Space Reconnaissance Satellites | `https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json` | Public Open |
| **11** | **Public Strategic CCTVs** | Visual Reconnaissance Feeds | Direct Open HLS / YouTube OSINT Feeds | Public Streams |

---

## 🏗️ Architecture & Project Structure

```
digital-forensics-osint-dashboard/
├── index.html              # Main HTML5 Single Page Command Center
├── css/
│   └── cyber-hud.css       # Complete Cyber-HUD design system, animations & responsive grid
├── js/
│   ├── config.js           # API registry, strategic cameras, missile telemetry models
│   ├── audioFx.js          # Web Audio API procedural cybernetic sound synthesizer
│   ├── globe3d.js          # Three.js 3D Holographic Globe, ballistic arcs & satellites
│   ├── tacticalMap.js      # Leaflet 2D Tactical Map engine with custom SVG markers
│   ├── apiManager.js       # Ingestion pipeline, CORS proxy fallbacks & normalization
│   └── app.js              # Application state, view controller, modals & SITREP exporter
├── README.md               # Complete Project Documentation & Academic Context
└── LICENSE                 # MIT License
```

---

## 🚀 Quick Start / How to Run

Because the project is engineered using modern vanilla Web standards (ES6+, WebGL, Web Audio, Leaflet), **no build step, npm install, or compilation is required**. It runs natively in any standard modern browser.

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave.

### Option 2: Local HTTP Server
Using Python (recommended for local development):
```bash
# In the project directory:
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

Using Node.js:
```bash
npx serve .
```

### Option 3: Deploy to GitHub Pages (1-Click)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AEGIS-OSINT Command Center"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Navigate to your repository's **Settings** &gt; **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your dashboard will be live on GitHub Pages with an instant HTTPS URL!

---

## 🔬 Relevance to Digital Forensics & OSINT

This project fulfills core requirements for academic and operational digital forensics courses:

1. **Indicator of Compromise (IoC) Tracking**: Ingests and correlates dynamic network indicators (malicious IP addresses, ports, autonomous system numbers, and malware families from Abuse.ch) with live CVE vulnerability intelligence from CISA.
2. **Kinetic-to-Digital Correlation**: Demonstrates how physical kinetic events (such as missile strikes detected by NASA FIRMS thermal telemetry and Ukrainian air sirens) correlate with electronic warfare (GPS jamming detected via *Monitor The Situation* / GPSJam) and synchronized cyberattacks.
3. **Open-Source Intelligence (OSINT) Verification**: Utilizes publicly accessible, unauthenticated reconnaissance channels—including public surveillance cameras, ADS-B military transponders, and satellite ephemeris—to corroborate reports from independent monitoring sources (*Osiris AI*, *WorldWatch*).
4. **Data Normalization & Resiliency**: Employs a decoupled ingestion engine that unifies heterogeneous formats (GeoJSON, CSV, JSON REST, RSS) into a standardized incident schema while maintaining graceful offline simulation when network boundaries or CORS limitations occur.

---

## ⚖️ Legal & Ethical Notice

All data sources aggregated by this project are strictly from **publicly accessible, unclassified, and open-source intelligence (OSINT)** repositories, public government advisories (CISA, USGS, NASA), and community transponder networks. No private networks, unauthorized systems, or classified databases are accessed.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
