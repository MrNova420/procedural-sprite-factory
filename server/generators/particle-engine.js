/**
 * Particle Engine
 * Generates particle effects for combat, magic, environment, and status effects
 */

class ParticleEngine {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
  }

  /**
   * Generate particle effect
   */
  generateEffect(effectType, options = {}) {
    const preset = this.getEffectPreset(effectType);
    
    return {
      ...preset,
      ...options,
      particles: this.generateParticles(preset, options)
    };
  }

  /**
   * Generate particles based on preset
   */
  generateParticles(preset, options = {}) {
    const particleCount = options.particleCount || preset.particleCount || 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: (Math.random() - 0.5) * (preset.spawnRadius || 10),
        y: (Math.random() - 0.5) * (preset.spawnRadius || 10),
        vx: (Math.random() - 0.5) * (preset.velocityRange || 100),
        vy: (Math.random() - 0.5) * (preset.velocityRange || 100),
        life: Math.random() * (preset.lifetime || 2.0),
        maxLife: preset.lifetime || 2.0,
        size: preset.particleSize || 2,
        color: this.interpolateColor(
          preset.colorStart || '#FFFFFF',
          preset.colorEnd || '#000000',
          Math.random()
        ),
        opacity: 1.0,
        rotation: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * (preset.angularVelocity || 0)
      });
    }
    
    return particles;
  }

  /**
   * Get effect preset by type
   */
  getEffectPreset(effectType) {
    const presets = {
      // Combat effects
      'slash': {
        particleCount: 20,
        lifetime: 0.3,
        particleSize: 3,
        velocityRange: 150,
        colorStart: '#FFFFFF',
        colorEnd: '#888888',
        shape: 'line',
        gravity: 0
      },
      'impact': {
        particleCount: 30,
        lifetime: 0.5,
        particleSize: 2,
        velocityRange: 200,
        colorStart: '#FFFF00',
        colorEnd: '#FF8800',
        spawnRadius: 5,
        gravity: 100
      },
      'blood': {
        particleCount: 25,
        lifetime: 1.0,
        particleSize: 2,
        velocityRange: 120,
        colorStart: '#FF0000',
        colorEnd: '#880000',
        gravity: 200
      },
      'sparks': {
        particleCount: 40,
        lifetime: 0.8,
        particleSize: 1,
        velocityRange: 180,
        colorStart: '#FFFF88',
        colorEnd: '#FF8800',
        gravity: 50,
        angularVelocity: 10
      },
      
      // Magic effects
      'fireball': {
        particleCount: 60,
        lifetime: 1.5,
        particleSize: 4,
        velocityRange: 80,
        colorStart: '#FFFF00',
        colorEnd: '#FF0000',
        spawnRadius: 20,
        glow: true
      },
      'ice-shard': {
        particleCount: 30,
        lifetime: 1.0,
        particleSize: 3,
        velocityRange: 150,
        colorStart: '#AAFFFF',
        colorEnd: '#0088FF',
        shape: 'crystal'
      },
      'lightning': {
        particleCount: 25,
        lifetime: 0.3,
        particleSize: 2,
        velocityRange: 300,
        colorStart: '#FFFFFF',
        colorEnd: '#8888FF',
        glow: true,
        flash: true
      },
      'arcane': {
        particleCount: 50,
        lifetime: 2.0,
        particleSize: 3,
        velocityRange: 60,
        colorStart: '#FF00FF',
        colorEnd: '#8800FF',
        spiral: true,
        glow: true
      },
      'holy': {
        particleCount: 40,
        lifetime: 1.5,
        particleSize: 3,
        velocityRange: 70,
        colorStart: '#FFFFFF',
        colorEnd: '#FFFF88',
        glow: true,
        rising: true
      },
      'dark': {
        particleCount: 45,
        lifetime: 2.0,
        particleSize: 4,
        velocityRange: 50,
        colorStart: '#8800FF',
        colorEnd: '#000000',
        glow: true,
        swirl: true
      },
      
      // Environmental effects
      'rain': {
        particleCount: 100,
        lifetime: 2.0,
        particleSize: 1,
        velocityRange: 20,
        colorStart: '#88CCFF',
        colorEnd: '#4488CC',
        gravity: 300,
        shape: 'line',
        direction: 'down'
      },
      'snow': {
        particleCount: 80,
        lifetime: 3.0,
        particleSize: 2,
        velocityRange: 30,
        colorStart: '#FFFFFF',
        colorEnd: '#CCCCCC',
        gravity: 50,
        drift: true
      },
      'wind': {
        particleCount: 60,
        lifetime: 2.0,
        particleSize: 1,
        velocityRange: 150,
        colorStart: '#FFFFFF',
        colorEnd: '#CCCCCC',
        direction: 'horizontal',
        opacity: 0.3
      },
      'leaves': {
        particleCount: 40,
        lifetime: 3.0,
        particleSize: 3,
        velocityRange: 50,
        colorStart: '#88FF44',
        colorEnd: '#FF8800',
        gravity: 80,
        rotation: true,
        drift: true
      },
      'dust': {
        particleCount: 50,
        lifetime: 2.5,
        particleSize: 1,
        velocityRange: 40,
        colorStart: '#CCAA88',
        colorEnd: '#886644',
        gravity: 20,
        drift: true,
        opacity: 0.5
      },
      
      // Status effects
      'poison': {
        particleCount: 35,
        lifetime: 2.0,
        particleSize: 2,
        velocityRange: 40,
        colorStart: '#88FF00',
        colorEnd: '#00FF88',
        rising: true,
        glow: true
      },
      'burn': {
        particleCount: 40,
        lifetime: 1.5,
        particleSize: 3,
        velocityRange: 60,
        colorStart: '#FFFF00',
        colorEnd: '#FF0000',
        rising: true,
        glow: true
      },
      'freeze': {
        particleCount: 30,
        lifetime: 2.0,
        particleSize: 2,
        velocityRange: 30,
        colorStart: '#AAFFFF',
        colorEnd: '#0088FF',
        shape: 'crystal',
        glow: true
      },
      'stun': {
        particleCount: 20,
        lifetime: 1.0,
        particleSize: 3,
        velocityRange: 80,
        colorStart: '#FFFF00',
        colorEnd: '#FFFFFF',
        orbit: true,
        shape: 'star'
      },
      'heal': {
        particleCount: 45,
        lifetime: 2.0,
        particleSize: 2,
        velocityRange: 50,
        colorStart: '#00FF88',
        colorEnd: '#88FF00',
        rising: true,
        glow: true,
        sparkle: true
      },
      
      // Special effects
      'explosion': {
        particleCount: 80,
        lifetime: 1.2,
        particleSize: 4,
        velocityRange: 250,
        colorStart: '#FFFF00',
        colorEnd: '#FF0000',
        spawnRadius: 0,
        shockwave: true,
        glow: true
      },
      'smoke': {
        particleCount: 50,
        lifetime: 3.0,
        particleSize: 6,
        velocityRange: 40,
        colorStart: '#666666',
        colorEnd: '#222222',
        rising: true,
        expand: true,
        opacity: 0.6
      },
      'portal': {
        particleCount: 60,
        lifetime: 2.5,
        particleSize: 2,
        velocityRange: 100,
        colorStart: '#FF00FF',
        colorEnd: '#0088FF',
        spiral: true,
        glow: true,
        vortex: true
      }
    };
    
    return presets[effectType] || presets['sparks'];
  }

  /**
   * Generate trail effect
   */
  generateTrail(options = {}) {
    const {
      length = 10,
      color = '#FFFFFF',
      fadeRate = 0.1,
      width = 2
    } = options;
    
    return {
      type: 'trail',
      length,
      color,
      fadeRate,
      width,
      points: []
    };
  }

  /**
   * Generate aura effect
   */
  generateAura(options = {}) {
    const {
      radius = 30,
      color = '#FFFF88',
      pulseSpeed = 2.0,
      intensity = 0.5
    } = options;
    
    return {
      type: 'aura',
      radius,
      color,
      pulseSpeed,
      intensity,
      particles: this.generateParticles({
        particleCount: 30,
        lifetime: 99999,
        particleSize: 2,
        velocityRange: 20,
        colorStart: color,
        colorEnd: color,
        orbit: true
      }, options)
    };
  }

  /**
   * Interpolate between two colors
   */
  interpolateColor(color1, color2, t) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    
    return this.rgbToHex(r, g, b);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

module.exports = ParticleEngine;
