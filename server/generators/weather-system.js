/**
 * Weather and Environmental Effects System
 * Rain, snow, fog, wind, lightning, day/night cycles, seasons
 */

class WeatherSystem {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.time = 0;
  }

  /**
   * Generate rain effect
   */
  generateRain(intensity = 0.5, windSpeed = 0, options = {}) {
    const dropCount = Math.floor(intensity * 200);
    const drops = [];
    
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * options.width || 128,
        y: Math.random() * (options.height || 128),
        length: 2 + Math.random() * 4,
        speed: 3 + Math.random() * 2,
        angle: windSpeed * 0.3,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    
    return {
      type: 'rain',
      intensity,
      drops,
      windSpeed,
      splashes: this.generateSplashes(intensity * 0.3, options)
    };
  }

  /**
   * Generate rain splashes
   */
  generateSplashes(intensity, options = {}) {
    const splashCount = Math.floor(intensity * 50);
    const splashes = [];
    
    for (let i = 0; i < splashCount; i++) {
      splashes.push({
        x: Math.random() * (options.width || 128),
        y: (options.height || 128) - 5,
        lifetime: Math.random() * 0.3,
        maxLifetime: 0.3,
        radius: 1 + Math.random() * 2
      });
    }
    
    return splashes;
  }

  /**
   * Generate snow effect
   */
  generateSnow(intensity = 0.5, windSpeed = 0, options = {}) {
    const flakeCount = Math.floor(intensity * 100);
    const flakes = [];
    
    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * (options.width || 128),
        y: Math.random() * (options.height || 128),
        size: 1 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
        drift: (Math.random() - 0.5) * 2 + windSpeed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        opacity: 0.6 + Math.random() * 0.4
      });
    }
    
    return {
      type: 'snow',
      intensity,
      flakes,
      windSpeed,
      accumulation: intensity > 0.7 // Snow on ground
    };
  }

  /**
   * Generate fog effect
   */
  generateFog(density = 0.5, options = {}) {
    const layers = 3;
    const fogLayers = [];
    
    for (let i = 0; i < layers; i++) {
      fogLayers.push({
        opacity: (density * 0.4) / layers,
        speed: 0.2 + i * 0.1,
        offset: Math.random() * 100,
        scale: 1 + i * 0.3,
        noiseFrequency: 0.02 + i * 0.01
      });
    }
    
    return {
      type: 'fog',
      density,
      layers: fogLayers,
      color: options.color || { r: 200, g: 200, b: 220 }
    };
  }

  /**
   * Generate wind effect
   */
  generateWind(speed = 0.5, direction = 0, gustiness = 0.3) {
    return {
      type: 'wind',
      speed,
      direction, // Angle in radians
      gustiness,
      currentGust: 0,
      gustPhase: 0,
      particles: this.generateWindParticles(speed, direction)
    };
  }

  /**
   * Generate wind particles (dust, leaves)
   */
  generateWindParticles(speed, direction, count = 30) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particleSpeed = speed * (0.5 + Math.random() * 1.5);
      
      particles.push({
        x: Math.random() * 128,
        y: Math.random() * 128,
        vx: Math.cos(direction) * particleSpeed * 10,
        vy: Math.sin(direction) * particleSpeed * 10,
        size: 1 + Math.random() * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 0.3 + Math.random() * 0.3,
        type: Math.random() > 0.7 ? 'leaf' : 'dust'
      });
    }
    
    return particles;
  }

  /**
   * Generate lightning effect
   */
  generateLightning(options = {}) {
    const startX = options.startX || Math.random() * 128;
    const startY = options.startY || 0;
    const endX = options.endX || startX + (Math.random() - 0.5) * 40;
    const endY = options.endY || 128;
    
    const segments = this.generateLightningBolt(
      { x: startX, y: startY },
      { x: endX, y: endY },
      5, // recursion depth
      0.3 // displacement
    );
    
    return {
      type: 'lightning',
      segments,
      intensity: 1.0,
      duration: 0.2,
      flashDuration: 0.1,
      branches: this.generateLightningBranches(segments, 3)
    };
  }

  /**
   * Generate lightning bolt segments
   */
  generateLightningBolt(start, end, depth, displacement) {
    if (depth === 0) {
      return [{ start, end }];
    }
    
    const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * displacement * 30;
    const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * displacement * 30;
    const mid = { x: midX, y: midY };
    
    return [
      ...this.generateLightningBolt(start, mid, depth - 1, displacement * 0.7),
      ...this.generateLightningBolt(mid, end, depth - 1, displacement * 0.7)
    ];
  }

  /**
   * Generate lightning branches
   */
  generateLightningBranches(mainSegments, branchCount) {
    const branches = [];
    
    for (let i = 0; i < branchCount; i++) {
      const segmentIndex = Math.floor(Math.random() * mainSegments.length);
      const segment = mainSegments[segmentIndex];
      const branchStart = {
        x: (segment.start.x + segment.end.x) / 2,
        y: (segment.start.y + segment.end.y) / 2
      };
      const branchEnd = {
        x: branchStart.x + (Math.random() - 0.5) * 20,
        y: branchStart.y + Math.random() * 30
      };
      
      branches.push(...this.generateLightningBolt(branchStart, branchEnd, 3, 0.2));
    }
    
    return branches;
  }

  /**
   * Generate day/night cycle lighting
   */
  getDayNightLighting(timeOfDay) {
    // timeOfDay: 0 = midnight, 0.25 = dawn, 0.5 = noon, 0.75 = dusk
    
    const phases = [
      { time: 0, ambient: { r: 0.1, g: 0.1, b: 0.2 }, sun: { r: 0, g: 0, b: 0 } }, // Midnight
      { time: 0.2, ambient: { r: 0.3, g: 0.3, b: 0.5 }, sun: { r: 0.8, g: 0.5, b: 0.3 } }, // Dawn
      { time: 0.5, ambient: { r: 0.8, g: 0.8, b: 0.9 }, sun: { r: 1, g: 0.95, b: 0.9 } }, // Noon
      { time: 0.7, ambient: { r: 0.6, g: 0.4, b: 0.3 }, sun: { r: 1, g: 0.6, b: 0.3 } }, // Dusk
      { time: 1, ambient: { r: 0.1, g: 0.1, b: 0.2 }, sun: { r: 0, g: 0, b: 0 } } // Midnight
    ];
    
    // Find surrounding phases
    let phase1, phase2, t;
    for (let i = 0; i < phases.length - 1; i++) {
      if (timeOfDay >= phases[i].time && timeOfDay <= phases[i + 1].time) {
        phase1 = phases[i];
        phase2 = phases[i + 1];
        t = (timeOfDay - phase1.time) / (phase2.time - phase1.time);
        break;
      }
    }
    
    // Interpolate
    const lerp = (a, b, t) => a + (b - a) * t;
    
    return {
      ambient: {
        r: lerp(phase1.ambient.r, phase2.ambient.r, t),
        g: lerp(phase1.ambient.g, phase2.ambient.g, t),
        b: lerp(phase1.ambient.b, phase2.ambient.b, t)
      },
      sun: {
        r: lerp(phase1.sun.r, phase2.sun.r, t),
        g: lerp(phase1.sun.g, phase2.sun.g, t),
        b: lerp(phase1.sun.b, phase2.sun.b, t)
      },
      sunAngle: (timeOfDay - 0.25) * Math.PI * 2, // Sun position
      moonVisible: timeOfDay < 0.2 || timeOfDay > 0.8,
      starsVisible: timeOfDay < 0.15 || timeOfDay > 0.85
    };
  }

  /**
   * Generate seasonal color palette
   */
  getSeasonalPalette(season, basePalette) {
    const modifiers = {
      spring: {
        hueShift: 10,
        saturationMultiplier: 1.2,
        brightnessMultiplier: 1.1
      },
      summer: {
        hueShift: 0,
        saturationMultiplier: 1.3,
        brightnessMultiplier: 1.2
      },
      autumn: {
        hueShift: -20,
        saturationMultiplier: 1.1,
        brightnessMultiplier: 0.9
      },
      winter: {
        hueShift: 0,
        saturationMultiplier: 0.6,
        brightnessMultiplier: 1.0
      }
    };
    
    const modifier = modifiers[season] || modifiers.summer;
    
    return basePalette.map(color => {
      // Convert RGB to HSV
      const r = color.r / 255;
      const g = color.g / 255;
      const b = color.b / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      let h = 0;
      if (delta !== 0) {
        if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / delta + 2) / 6;
        else h = ((r - g) / delta + 4) / 6;
      }
      
      const s = max === 0 ? 0 : delta / max;
      const v = max;
      
      // Apply modifiers
      h = (h + modifier.hueShift / 360) % 1;
      const newS = Math.min(1, s * modifier.saturationMultiplier);
      const newV = Math.min(1, v * modifier.brightnessMultiplier);
      
      // Convert back to RGB
      const c = newV * newS;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = newV - c;
      
      let newR, newG, newB;
      const hSector = Math.floor(h * 6);
      
      if (hSector === 0) { newR = c; newG = x; newB = 0; }
      else if (hSector === 1) { newR = x; newG = c; newB = 0; }
      else if (hSector === 2) { newR = 0; newG = c; newB = x; }
      else if (hSector === 3) { newR = 0; newG = x; newB = c; }
      else if (hSector === 4) { newR = x; newG = 0; newB = c; }
      else { newR = c; newG = 0; newB = x; }
      
      return {
        r: Math.round((newR + m) * 255),
        g: Math.round((newG + m) * 255),
        b: Math.round((newB + m) * 255)
      };
    });
  }

  /**
   * Update weather effects (for animation)
   */
  update(weather, deltaTime) {
    this.time += deltaTime;
    
    switch (weather.type) {
      case 'rain':
        for (const drop of weather.drops) {
          drop.y += drop.speed;
          drop.x += Math.sin(this.time * 2 + drop.y) * weather.windSpeed * 0.5;
          
          if (drop.y > 128) {
            drop.y = -drop.length;
            drop.x = Math.random() * 128;
          }
        }
        
        for (const splash of weather.splashes) {
          splash.lifetime -= deltaTime;
          if (splash.lifetime <= 0) {
            splash.lifetime = splash.maxLifetime;
            splash.x = Math.random() * 128;
          }
        }
        break;
        
      case 'snow':
        for (const flake of weather.flakes) {
          flake.y += flake.speed;
          flake.x += flake.drift + Math.sin(this.time + flake.y * 0.1) * 0.5;
          flake.rotation += flake.rotationSpeed;
          
          if (flake.y > 128) {
            flake.y = -5;
            flake.x = Math.random() * 128;
          }
        }
        break;
        
      case 'wind':
        // Update gust
        weather.gustPhase += deltaTime * 0.5;
        weather.currentGust = Math.sin(weather.gustPhase) * weather.gustiness;
        
        const effectiveSpeed = weather.speed + weather.currentGust;
        
        for (const particle of weather.particles) {
          particle.x += particle.vx * effectiveSpeed * deltaTime;
          particle.y += particle.vy * effectiveSpeed * deltaTime;
          particle.rotation += particle.rotationSpeed;
          
          // Wrap around
          if (particle.x > 128) particle.x = -5;
          if (particle.x < -5) particle.x = 128;
          if (particle.y > 128) particle.y = -5;
          if (particle.y < -5) particle.y = 128;
        }
        break;
        
      case 'lightning':
        weather.duration -= deltaTime;
        weather.intensity = Math.max(0, weather.duration / 0.2);
        break;
    }
  }

  /**
   * Render weather to canvas
   */
  render(weather, ctx) {
    switch (weather.type) {
      case 'rain':
        ctx.strokeStyle = 'rgba(150, 150, 200, 0.3)';
        ctx.lineWidth = 1;
        
        for (const drop of weather.drops) {
          ctx.beginPath();
          ctx.globalAlpha = drop.opacity;
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(
            drop.x + Math.sin(drop.angle) * drop.length,
            drop.y + Math.cos(drop.angle) * drop.length
          );
          ctx.stroke();
        }
        
        for (const splash of weather.splashes) {
          const alpha = splash.lifetime / splash.maxLifetime;
          ctx.fillStyle = `rgba(150, 150, 200, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(splash.x, splash.y, splash.radius * (1 - alpha), 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        break;
        
      case 'snow':
        for (const flake of weather.flakes) {
          ctx.globalAlpha = flake.opacity;
          ctx.fillStyle = 'white';
          ctx.save();
          ctx.translate(flake.x, flake.y);
          ctx.rotate(flake.rotation);
          
          // Snowflake shape
          if (flake.size > 2) {
            // Complex snowflake
            for (let i = 0; i < 6; i++) {
              ctx.rotate(Math.PI / 3);
              ctx.fillRect(-flake.size / 2, -0.5, flake.size, 1);
            }
          } else {
            // Simple dot
            ctx.fillRect(-flake.size / 2, -flake.size / 2, flake.size, flake.size);
          }
          
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        break;
        
      case 'fog':
        for (const layer of weather.layers) {
          ctx.fillStyle = `rgba(${weather.color.r}, ${weather.color.g}, ${weather.color.b}, ${layer.opacity})`;
          ctx.fillRect(0, 0, 128, 128);
        }
        break;
        
      case 'lightning':
        if (weather.intensity > 0) {
          // Flash
          if (weather.duration > 0.1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${weather.intensity * 0.3})`;
            ctx.fillRect(0, 0, 128, 128);
          }
          
          // Lightning bolt
          ctx.strokeStyle = `rgba(200, 200, 255, ${weather.intensity})`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(150, 150, 255, 0.8)';
          
          for (const segment of weather.segments) {
            ctx.beginPath();
            ctx.moveTo(segment.start.x, segment.start.y);
            ctx.lineTo(segment.end.x, segment.end.y);
            ctx.stroke();
          }
          
          // Branches
          ctx.lineWidth = 1;
          for (const branch of weather.branches) {
            ctx.beginPath();
            ctx.moveTo(branch.start.x, branch.start.y);
            ctx.lineTo(branch.end.x, branch.end.y);
            ctx.stroke();
          }
          
          ctx.shadowBlur = 0;
        }
        break;
    }
  }
}

module.exports = WeatherSystem;
