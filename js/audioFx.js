/**
 * AEGIS-OSINT // PROCEDURAL CYBERNETIC SOUND SYNTHESIZER
 * Synthesizes tactical audio alerts, radar sweeps, and UI beeps
 * using pure browser Web Audio API (Zero external assets required).
 */

class TacticalAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    
    // Check saved audio preference
    try {
      const saved = localStorage.getItem("aegis_audio_muted");
      if (saved !== null) {
        this.muted = saved === "true";
      }
    } catch (e) {
      this.muted = false;
    }
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio not available:", e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem("aegis_audio_muted", this.muted);
    } catch (e) {}
    if (!this.muted) {
      this.playBeep(880, 0.08, "sine");
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Tactical click / blip sound for UI buttons
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Radar ping echo sound
  playRadarPing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.35);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Critical alarm / Missile alert warble
  playMissileAlert() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.linearRampToValueAtTime(920, now + 0.12);
      osc.frequency.linearRampToValueAtTime(750, now + 0.24);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Cyber boot-up sequence swell sound
  playBootSequence() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      
      // Sub-bass sweep
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(220, now + 1.2);
      subGain.gain.setValueAtTime(0.08, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.2);

      // Cyber high shimmer
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const now2 = this.ctx.currentTime;
        const highOsc = this.ctx.createOscillator();
        const highGain = this.ctx.createGain();
        highOsc.type = "triangle";
        highOsc.frequency.setValueAtTime(880, now2);
        highOsc.frequency.exponentialRampToValueAtTime(1760, now2 + 0.4);
        highGain.gain.setValueAtTime(0.04, now2);
        highGain.gain.exponentialRampToValueAtTime(0.001, now2 + 0.4);
        highOsc.connect(highGain);
        highGain.connect(this.ctx.destination);
        highOsc.start(now2);
        highOsc.stop(now2 + 0.4);
      }, 700);

    } catch (e) {}
  }

  // Arbitrary beep helper
  playBeep(freq = 880, duration = 0.1, type = "sine") {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }
}

// Global instance
window.tacticalAudio = new TacticalAudio();
