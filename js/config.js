/**
 * AEGIS-OSINT // DIGITAL FORENSICS & THREAT INTELLIGENCE COMMAND CENTER
 * Master Configuration & API Sources Registry
 * 
 * Aggregates intelligence feeds inspired by:
 * - Osiris AI (osirisai.live)
 * - WorldWatch UK (worldwatch.uk)
 * - Monitor The Situation (monitor-the-situation.com/africa)
 * - NASA FIRMS (Kinetic strikes / missile thermal signatures)
 * - CISA KEV (Cyber forensics / exploited CVEs)
 * - Abuse.ch Feodo & URLhaus (Botnet C2 & malware delivery)
 * - ADS-B Lol (Military ISR reconnaissance flights)
 * - USGS Realtime Seismic (detonation / explosion shockwaves)
 * - CelesTrak (Orbital reconnaissance satellites)
 * - Strategic Public OSINT Surveillance Cameras
 */

const CONFIG = {
  system: {
    name: "AEGIS-OSINT COMMAND CENTER",
    version: "v4.8.2-ENTERPRISE",
    classification: "TOP SECRET // FORENSIC RECON // OSINT-AI",
    defcon: 2,
    bootDurationMs: 4000,
    refreshIntervalMs: 25000,
  },

  // Collected API Endpoints Registry with live URLs, documentation & metadata
  apis: [
    {
      id: "osiris-intel",
      name: "Osiris AI OSINT Aggregator",
      website: "https://osirisai.live",
      category: "Global Intelligence & Kinetic Conflict",
      description: "Aggregates multi-domain open-source intelligence, tactical conflict feeds, and reconnaissance data without mandatory API keys.",
      endpoint: "https://api.allorigins.win/raw?url=https://osirisai.live/api/oi",
      directUrl: "https://osirisai.live",
      type: "CONFLICT_RADAR",
      status: "ONLINE",
      latency: 42,
      refreshRate: "30s",
      auth: "PUBLIC_KEYLESS"
    },
    {
      id: "worldwatch-uk",
      name: "WorldWatch UK Intelligence",
      website: "https://worldwatch.uk",
      category: "Geopolitical Alert Feed",
      description: "Grassroots geopolitical monitoring, conflict reporting, maritime chokepoints, and high-risk flashpoints.",
      endpoint: "https://world-watch.news/feed/",
      directUrl: "https://worldwatch.uk",
      type: "GEOPOLITICAL",
      status: "ONLINE",
      latency: 48,
      refreshRate: "60s",
      auth: "PUBLIC_RSS_JSON"
    },
    {
      id: "monitor-africa",
      name: "Monitor The Situation (Africa & Global)",
      website: "https://monitor-the-situation.com/africa",
      category: "Conflict & GPS Jamming Monitor",
      description: "Specialized conflict tracking across the African continent (Sudan, Sahel, Horn of Africa), GPS jamming anomalies, and civil unrest.",
      endpoint: "https://monitor-the-situation.com/api/africa-events",
      directUrl: "https://monitor-the-situation.com/africa",
      type: "AFRICA_CONFLICT",
      status: "ONLINE",
      latency: 55,
      refreshRate: "45s",
      auth: "PUBLIC_OPEN"
    },
    {
      id: "nasa-firms",
      name: "NASA FIRMS (Kinetic Strike / Fire Thermal Anomaly)",
      website: "https://firms.modaps.eosdis.nasa.gov",
      category: "Missile & Artillery Thermal Detection",
      description: "VIIRS and MODIS satellite sensors capturing high-temperature thermal anomalies indicative of missile impacts, drone strikes, and heavy artillery shelling.",
      endpoint: "https://firms.modaps.eosdis.nasa.gov/api/area/csv/open_key/VIIRS_SNPP_NRT/world/1",
      directUrl: "https://firms.modaps.eosdis.nasa.gov",
      type: "MISSILE_KINETIC",
      status: "ONLINE",
      latency: 68,
      refreshRate: "120s",
      auth: "OPEN_COMMUNITY"
    },
    {
      id: "cisa-kev",
      name: "CISA Known Exploited Vulnerabilities (KEV)",
      website: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      category: "Digital Forensics & Vulnerability Intel",
      description: "US Cybersecurity and Infrastructure Security Agency official catalog of vulnerabilities exploited in the wild by state-sponsored APTs and cyber criminals.",
      endpoint: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
      directUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      type: "CYBER_FORENSICS",
      status: "ONLINE",
      latency: 32,
      refreshRate: "180s",
      auth: "PUBLIC_CISA"
    },
    {
      id: "abusech-feodo",
      name: "Abuse.ch Feodo Tracker (Botnet C2 Servers)",
      website: "https://feodotracker.abuse.ch",
      category: "Cyber Forensics & Malware Command-and-Control",
      description: "Real-time blocklist and tracking of active Command and Control (C2) servers associated with banking trojans and malware botnets (Emotet, Qakbot, Dridex).",
      endpoint: "https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json",
      directUrl: "https://feodotracker.abuse.ch",
      type: "BOTNET_C2",
      status: "ONLINE",
      latency: 39,
      refreshRate: "60s",
      auth: "PUBLIC_OPEN"
    },
    {
      id: "abusech-urlhaus",
      name: "Abuse.ch URLhaus (Malware Payload Radar)",
      website: "https://urlhaus.abuse.ch",
      category: "Cyber Forensics / Payload Distribution",
      description: "Live database of URLs used for malware distribution, phishing drops, and ransomware payload delivery.",
      endpoint: "https://urlhaus-api.abuse.ch/v1/urls/recent/",
      directUrl: "https://urlhaus.abuse.ch",
      type: "MALWARE_PAYLOAD",
      status: "ONLINE",
      latency: 41,
      refreshRate: "60s",
      auth: "PUBLIC_OPEN"
    },
    {
      id: "adsb-military",
      name: "ADS-B Military & Reconnaissance Aviation",
      website: "https://adsb.lol",
      category: "Aviation ISR & Electronic Warfare Tracking",
      description: "Live transponder feed filtering military reconnaissance aircraft (RQ-4 Global Hawk, RC-135 Rivet Joint, E-3 Sentry AWACS, P-8 Poseidon).",
      endpoint: "https://api.adsb.lol/v2/mil",
      directUrl: "https://adsb.lol",
      type: "MIL_AVIATION",
      status: "ONLINE",
      latency: 47,
      refreshRate: "15s",
      auth: "PUBLIC_CROWDSOURCED"
    },
    {
      id: "usgs-seismic",
      name: "USGS Real-Time Seismic & Detonation Monitor",
      website: "https://earthquake.usgs.gov",
      category: "Seismic & Kinetic Detonation Telemetry",
      description: "Live global seismic activity measuring acoustic and tectonic shocks, used in digital forensics to identify unannounced blasts, weapons testing, or geological hazards.",
      endpoint: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      directUrl: "https://earthquake.usgs.gov",
      type: "SEISMIC_SHOCK",
      status: "ONLINE",
      latency: 28,
      refreshRate: "45s",
      auth: "PUBLIC_OPEN"
    },
    {
      id: "celestrak-satellites",
      name: "CelesTrak Orbital Telemetry & Recon Satellites",
      website: "https://celestrak.org",
      category: "Space Situational Awareness",
      description: "Real-time Two-Line Element (TLE) and ephemeris tracking for military reconnaissance satellites, GPS constellations, and Starlink communications.",
      endpoint: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json",
      directUrl: "https://celestrak.org",
      type: "SATELLITE",
      status: "ONLINE",
      latency: 52,
      refreshRate: "300s",
      auth: "PUBLIC_OPEN"
    },
    {
      id: "public-cams",
      name: "Strategic Public OSINT Surveillance Webcams",
      website: "https://www.windy.com/-Webcams / https://earthcam.com",
      category: "Visual Reconnaissance & Border Cameras",
      description: "Aggregated open public video feeds capturing strategic straits, conflict zone urban centers, and critical transportation hubs.",
      endpoint: "INTERNAL_OSINT_STREAMS",
      directUrl: "https://webcams.windy.com",
      type: "LIVE_CAMERAS",
      status: "ONLINE",
      latency: 22,
      refreshRate: "REALTIME",
      auth: "PUBLIC_OPEN"
    }
  ],

  // Strategic Live Public Surveillance Cameras around the world
  strategicCameras: [
    {
      id: "cam-kyiv",
      name: "Kyiv Independence Square (Maidan)",
      location: "Kyiv, Ukraine",
      lat: 50.4501,
      lng: 30.5234,
      category: "Conflict Zone Urban Center",
      status: "LIVE",
      resolution: "1080p // 30 FPS",
      fps: 30,
      bandwidth: "4.2 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCcwfXkSjRovbW6i5Yg_QoXA", // Fallback video stream
      embedType: "youtube",
      embedId: "live_kyiv_skyline",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Monitors central air-raid sirens, sky illumination from anti-air defenses, and downtown traffic."
    },
    {
      id: "cam-taipei",
      name: "Taipei 101 & Taiwan Strait Airspace",
      location: "Taipei, Taiwan",
      lat: 25.0330,
      lng: 121.5654,
      category: "Strategic Chokepoint Airspace",
      status: "LIVE",
      resolution: "4K UHD // 60 FPS",
      fps: 60,
      bandwidth: "8.5 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=taipei_city",
      embedType: "youtube",
      embedId: "taipei_101_live",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Monitors Taipei sky corridor and cross-strait weather/radar."
    },
    {
      id: "cam-bosphorus",
      name: "Bosphorus Strait Maritime Corridor",
      location: "Istanbul, Turkey",
      lat: 41.0255,
      lng: 29.0040,
      category: "Maritime Chokepoint (Black Sea Access)",
      status: "LIVE",
      resolution: "1080p // 25 FPS",
      fps: 25,
      bandwidth: "3.8 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=bosphorus_marine",
      embedType: "youtube",
      embedId: "bosphorus_strait_live",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Enforces Montreux Convention tracking of naval and merchant cargo vessels."
    },
    {
      id: "cam-redsea",
      name: "Bab-el-Mandeb Strait & Djibouti Coast",
      location: "Bab-el-Mandeb, Yemen/Djibouti",
      lat: 12.5833,
      lng: 43.3333,
      category: "High-Threat Maritime Chokepoint",
      status: "HIGH ALERT",
      resolution: "1080p // 30 FPS",
      fps: 30,
      bandwidth: "4.5 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=red_sea_monitoring",
      embedType: "youtube",
      embedId: "red_sea_chokepoint",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Surveillance of international shipping lane subject to anti-ship ballistic missile and drone swarm attacks."
    },
    {
      id: "cam-seoul",
      name: "Seoul Han River & DMZ Border Perimeter",
      location: "Seoul / DMZ, South Korea",
      lat: 37.5665,
      lng: 126.9780,
      category: "Border Defense & Urban Hub",
      status: "LIVE",
      resolution: "1080p // 60 FPS",
      fps: 60,
      bandwidth: "6.1 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=seoul_live",
      embedType: "youtube",
      embedId: "seoul_skyline_cam",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Monitors northern approach corridors and regional infrastructure security."
    },
    {
      id: "cam-odesa",
      name: "Port of Odesa Black Sea Terminal",
      location: "Odesa, Ukraine",
      lat: 46.4825,
      lng: 30.7233,
      category: "Naval & Grain Corridor Hub",
      status: "ALERT",
      resolution: "720p // 24 FPS",
      fps: 24,
      bandwidth: "2.5 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=odesa_port",
      embedType: "youtube",
      embedId: "odesa_port_monitor",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Critical infrastructure radar monitoring sea drone activity and maritime mining."
    },
    {
      id: "cam-suez",
      name: "Suez Canal North Port Said Entry",
      location: "Port Said, Egypt",
      lat: 31.2653,
      lng: 32.3019,
      category: "Global Trade Chokepoint",
      status: "LIVE",
      resolution: "1080p // 30 FPS",
      fps: 30,
      bandwidth: "4.0 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=suez_canal",
      embedType: "youtube",
      embedId: "suez_transit_cam",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "Tracks container traffic entering from Mediterranean toward the Red Sea."
    },
    {
      id: "cam-london",
      name: "London Westminster & Thames Corridor",
      location: "London, United Kingdom",
      lat: 51.5007,
      lng: -0.1246,
      category: "Government Command Center",
      status: "LIVE",
      resolution: "4K // 60 FPS",
      fps: 60,
      bandwidth: "9.2 Mbps",
      streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=earthcam_london",
      embedType: "youtube",
      embedId: "london_westminster_live",
      nightVisionSupported: true,
      thermalSupported: true,
      notes: "UK security perimeter monitoring Thames maritime police and Whitehall area."
    }
  ],

  // Real-world simulated ballistic / missile trajectory vectors for 3D globe animation
  missileTrajectories: [
    {
      id: "msl-01",
      name: "Anti-Ship Ballistic Missile (ASBM) Inbound",
      launchSite: "Hodeidah Region, Yemen",
      launchCoords: [14.7978, 42.9545],
      targetSite: "Bab-el-Mandeb Shipping Corridor",
      targetCoords: [12.6000, 43.3000],
      velocityMach: 5.2,
      apogeeKm: 85,
      type: "ASBM / Hyper-Kinetic",
      status: "INTERCEPTED",
      color: "#ff3366",
      source: "OSIRIS / RED SEA RADAR"
    },
    {
      id: "msl-02",
      name: "Kh-101 Air-Launched Cruise Missile Salvo",
      launchSite: "Olenya Air Base, Murmansk",
      launchCoords: [68.1528, 33.4561],
      targetSite: "Central Energy Grid, Dnipro",
      targetCoords: [48.4647, 35.0462],
      velocityMach: 0.78,
      apogeeKm: 6.5,
      type: "Subsonic Cruise Missile",
      status: "AIR DEFENSE ACTIVE",
      color: "#ff0055",
      source: "ALERTS.IN.UA / FIRMS"
    },
    {
      id: "msl-03",
      name: "Heavy Rocket Artillery Barrage",
      launchSite: "Southern Lebanon Border",
      launchCoords: [33.2000, 35.3000],
      targetSite: "Upper Galilee IDF Facility",
      targetCoords: [33.0000, 35.5000],
      velocityMach: 2.8,
      apogeeKm: 22,
      type: "Unguided Ballistic Rocket",
      status: "IRON DOME ENGAGED",
      color: "#ff8800",
      source: "WORLDWATCH / REDALERT"
    },
    {
      id: "msl-04",
      name: "Shahed-136 Kamikaze Drone Swarm",
      launchSite: "Primorsko-Akhtarsk, Krasnodar",
      launchCoords: [46.0467, 38.1747],
      targetSite: "Odesa Port Infrastructure",
      targetCoords: [46.4825, 30.7233],
      velocityMach: 0.22,
      apogeeKm: 1.2,
      type: "One-Way Attack UAV (OWA)",
      status: "MOBILE FLAK TRACKING",
      color: "#ffaa00",
      source: "OSIRIS / TELEGRAM OSINT"
    },
    {
      id: "msl-05",
      name: "Sudan SAF Heavy Artillery Strike",
      launchSite: "Omdurman Military Base, Sudan",
      launchCoords: [15.6500, 32.4800],
      targetSite: "Khartoum Industrial Enclave",
      targetCoords: [15.5007, 32.5599],
      velocityMach: 1.9,
      apogeeKm: 8.0,
      type: "Howitzer Kinetic Fire",
      status: "IMPACT CONFIRMED",
      color: "#ff4444",
      source: "MONITOR-THE-SITUATION (AFRICA)"
    }
  ],

  // African Flashpoints & Situation Hotspots (dedicated to monitor-the-situation.com/africa)
  africaHotspots: [
    {
      id: "afr-01",
      region: "Sudan Civil War",
      location: "Khartoum & El Fasher",
      lat: 15.5007,
      lng: 32.5599,
      threatLevel: "CRITICAL (DEFCON 1)",
      category: "Urban Conflict / Artillery",
      summary: "Clashes between Sudanese Armed Forces (SAF) and Rapid Support Forces (RSF). Heavy artillery and drone attacks on civilian corridors.",
      source: "monitor-the-situation.com/africa",
      gpsJammingScore: 84
    },
    {
      id: "afr-02",
      region: "Eastern DRC Conflict",
      location: "Goma, North Kivu",
      lat: -1.6741,
      lng: 29.2285,
      threatLevel: "HIGH (DEFCON 2)",
      category: "Armed Insurgency / M23 Offensive",
      summary: "M23 rebel advance toward Goma outskirts. Regional SAM missile batteries deployed. Mineral supply chokepoint impacted.",
      source: "monitor-the-situation.com/africa",
      gpsJammingScore: 62
    },
    {
      id: "afr-03",
      region: "Sahel Tri-Border Crisis",
      location: "Tillabéri, Niger/Burkina/Mali",
      lat: 14.2081,
      lng: 1.4542,
      threatLevel: "CRITICAL (DEFCON 1)",
      category: "Insurgency / Drone Warfare",
      summary: "Joint task force drone operations against militant convoys. Military government border closure in effect.",
      source: "monitor-the-situation.com/africa",
      gpsJammingScore: 71
    },
    {
      id: "afr-04",
      region: "Somalia & Horn of Africa",
      location: "Mogadishu & Gulf of Aden",
      lat: 2.0469,
      lng: 45.3182,
      threatLevel: "HIGH (DEFCON 2)",
      category: "Maritime Piracy & Insurgency",
      summary: "Al-Shabaab mortar attacks on perimeter bases; resurgence of Somali pirate boarding attempts in outer shipping lanes.",
      source: "monitor-the-situation.com/africa",
      gpsJammingScore: 58
    },
    {
      id: "afr-05",
      region: "Ethiopia Amhara / Oromia Tensions",
      location: "Bahir Dar, Amhara",
      lat: 11.5936,
      lng: 37.3908,
      threatLevel: "ELEVATED (DEFCON 3)",
      category: "Civil Unrest & Communications Blackout",
      summary: "Intermittent internet cutoffs and security checkpoints reported following regional militia mobilizations.",
      source: "monitor-the-situation.com/africa",
      gpsJammingScore: 49
    }
  ],

  // Tracked Military Reconnaissance Aircraft (ADS-B Open Transponders)
  trackedMilitaryAircraft: [
    {
      callsign: "FORTE10",
      model: "Northrop Grumman RQ-4B Global Hawk",
      squawk: "7650",
      altitudeFt: 53200,
      speedKnots: 340,
      country: "United States (USAF)",
      mission: "High-Altitude Signals & Radar Reconnaissance",
      lat: 43.1500,
      lng: 31.5000,
      source: "adsb.lol / OpenSky"
    },
    {
      callsign: "JAKE21",
      model: "Boeing RC-135V Rivet Joint",
      squawk: "4312",
      altitudeFt: 31000,
      speedKnots: 460,
      country: "United States (USAF)",
      mission: "Electronic Intelligence (ELINT) over Baltic Sea",
      lat: 56.2500,
      lng: 19.8000,
      source: "adsb.lol / OpenSky"
    },
    {
      callsign: "HOMER71",
      model: "Boeing RC-135W Rivet Joint",
      squawk: "5201",
      altitudeFt: 34500,
      speedKnots: 475,
      country: "Royal Air Force (RAF)",
      mission: "Signals Interception over Black Sea Romanian Border",
      lat: 44.8000,
      lng: 29.1000,
      source: "adsb.lol / OpenSky"
    },
    {
      callsign: "REDEYE6",
      model: "Boeing E-3A Sentry (AWACS)",
      squawk: "2411",
      altitudeFt: 29000,
      speedKnots: 410,
      country: "NATO Airborne Early Warning",
      mission: "Airspace Battle Management & Radar Sweep",
      lat: 51.1000,
      lng: 23.4000,
      source: "adsb.lol / OpenSky"
    },
    {
      callsign: "POSEIDON04",
      model: "Boeing P-8A Poseidon",
      squawk: "6722",
      altitudeFt: 22000,
      speedKnots: 380,
      country: "United States (US Navy)",
      mission: "Anti-Submarine & Surface Vessel Tracking",
      lat: 34.5000,
      lng: 25.8000,
      source: "adsb.lol / OpenSky"
    }
  ]
};

// Export configuration globally
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
