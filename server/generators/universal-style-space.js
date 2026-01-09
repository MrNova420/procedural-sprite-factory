/**
 * Universal Style Space
 * Navigate through infinite possible art styles mathematically
 * Not presets - every parameter can be continuously adjusted
 */

class UniversalStyleSpace {
  /**
   * Generate style from mathematical coordinates in style space
   */
  static generateStyle(coordinates) {
    return {
      // Core aesthetic dimensions
      aesthetic: this.mapAesthetic(coordinates.aesthetic || 0.5),
      
      // Line treatment
      lines: this.mapLines(coordinates.line || 0.5),
      
      // Color treatment  
      color: this.mapColor(coordinates.color || 0.5),
      
      // Shading approach
      shading: this.mapShading(coordinates.shading || 0.5),
      
      // Detail density
      detail: this.mapDetail(coordinates.detail || 0.5),
      
      // Texture treatment
      texture: this.mapTexture(coordinates.texture || 0.5),
      
      // Effects
      effects: this.mapEffects(coordinates.effects || 0.5),
      
      // Finish
      finish: this.mapFinish(coordinates.finish || 0.5)
    };
  }

  /**
   * Map aesthetic coordinate to properties
   * 0.0 = dark/gritty, 0.5 = balanced, 1.0 = bright/cute
   */
  static mapAesthetic(value) {
    return {
      mood: value,
      saturation: 0.3 + value * 0.6,
      brightness: 0.3 + value * 0.5,
      contrast: 0.8 - value * 0.4,
      sharpness: 1.0 - value * 0.3
    };
  }

  /**
   * Map line coordinate to properties
   * 0.0 = no outlines, 0.5 = normal, 1.0 = heavy outlines
   */
  static mapLines(value) {
    return {
      thickness: value * 3,
      presence: value,
      style: value < 0.3 ? 'none' : value < 0.7 ? 'normal' : 'heavy',
      sharpness: value > 0.5 ? 1.0 : 0.5
    };
  }

  /**
   * Map color coordinate to treatment
   * 0.0 = monochrome, 0.5 = natural, 1.0 = hyper saturated
   */
  static mapColor(value) {
    if (value < 0.1) {
      return {
        paletteSize: 2,
        saturation: 0,
        hueDrift: 0,
        method: 'monochrome'
      };
    } else if (value < 0.3) {
      return {
        paletteSize: 4 + Math.floor(value * 10),
        saturation: value,
        hueDrift: 0.05,
        method: 'limited'
      };
    } else if (value < 0.7) {
      return {
        paletteSize: 8 + Math.floor(value * 20),
        saturation: 0.5 + value * 0.3,
        hueDrift: 0.1,
        method: 'natural'
      };
    } else {
      return {
        paletteSize: 16 + Math.floor(value * 16),
        saturation: 0.9 + value * 0.1,
        hueDrift: 0.2 + value * 0.3,
        method: 'vibrant'
      };
    }
  }

  /**
   * Map shading coordinate
   * 0.0 = flat, 0.5 = cel shaded, 1.0 = smooth gradient
   */
  static mapShading(value) {
    return {
      steps: value < 0.2 ? 1 : value < 0.5 ? 2 + Math.floor(value * 6) : 10,
      softness: value,
      contrast: 1.0 - value * 0.4,
      method: value < 0.2 ? 'flat' : value < 0.5 ? 'cel' : value < 0.8 ? 'stepped' : 'gradient'
    };
  }

  /**
   * Map detail coordinate
   * 0.0 = minimalist, 0.5 = normal, 1.0 = ultra detailed
   */
  static mapDetail(value) {
    return {
      level: value,
      noise: value * 0.3,
      ornaments: Math.floor(value * 10),
      microdetails: value > 0.7
    };
  }

  /**
   * Map texture coordinate
   * 0.0 = smooth, 0.5 = textured, 1.0 = rough
   */
  static mapTexture(value) {
    return {
      grain: value * 0.5,
      bumps: value * 0.4,
      scratches: value > 0.6 ? value * 0.3 : 0,
      noise: value * 0.2
    };
  }

  /**
   * Map effects coordinate
   * 0.0 = clean, 0.5 = subtle, 1.0 = maximum
   */
  static mapEffects(value) {
    return {
      glow: value > 0.3 ? (value - 0.3) * 1.4 : 0,
      bloom: value > 0.5 ? (value - 0.5) * 2 : 0,
      particles: value > 0.6,
      trails: value > 0.7,
      distortion: value > 0.8 ? (value - 0.8) * 5 : 0
    };
  }

  /**
   * Map finish coordinate
   * 0.0 = matte, 0.5 = normal, 1.0 = glossy/metallic
   */
  static mapFinish(value) {
    return {
      reflectivity: value,
      specular: value * 0.8,
      metallic: value > 0.7 ? (value - 0.7) * 3.33 : 0,
      glossiness: value
    };
  }

  /**
   * Named style presets as coordinates in style space
   * These are just convenient starting points - any coordinate works
   */
  static getPreset(name) {
    const presets = {
      // Pixel art styles
      'snes': { aesthetic: 0.5, line: 0.3, color: 0.4, shading: 0.3, detail: 0.4, texture: 0.2, effects: 0, finish: 0.3 },
      'gba': { aesthetic: 0.6, line: 0.2, color: 0.5, shading: 0.4, detail: 0.5, texture: 0.1, effects: 0, finish: 0.2 },
      'nes': { aesthetic: 0.4, line: 0.5, color: 0.2, shading: 0.2, detail: 0.3, texture: 0.1, effects: 0, finish: 0.1 },
      
      // Modern pixel styles
      'modern-pixel': { aesthetic: 0.7, line: 0.1, color: 0.7, shading: 0.6, detail: 0.7, texture: 0.3, effects: 0.3, finish: 0.4 },
      'hd-pixel': { aesthetic: 0.6, line: 0.2, color: 0.8, shading: 0.8, detail: 0.9, texture: 0.5, effects: 0.4, finish: 0.6 },
      
      // Mood-based styles
      'cozy': { aesthetic: 0.9, line: 0.3, color: 0.8, shading: 0.4, detail: 0.5, texture: 0.2, effects: 0.2, finish: 0.3 },
      'dark-fantasy': { aesthetic: 0.2, line: 0.7, color: 0.3, shading: 0.7, detail: 0.8, texture: 0.7, effects: 0.5, finish: 0.4 },
      'cyberpunk': { aesthetic: 0.4, line: 0.1, color: 0.9, shading: 0.3, detail: 0.9, texture: 0.4, effects: 0.9, finish: 0.8 },
      'post-apocalyptic': { aesthetic: 0.3, line: 0.6, color: 0.2, shading: 0.6, detail: 0.7, texture: 0.9, effects: 0.3, finish: 0.2 },
      
      // Clean styles
      'minimalist': { aesthetic: 0.7, line: 0.5, color: 0.6, shading: 0.1, detail: 0.1, texture: 0, effects: 0, finish: 0.2 },
      'flat': { aesthetic: 0.8, line: 0.6, color: 0.7, shading: 0, detail: 0.2, texture: 0, effects: 0, finish: 0.1 },
      'clean': { aesthetic: 0.7, line: 0.4, color: 0.6, shading: 0.3, detail: 0.3, texture: 0.1, effects: 0.1, finish: 0.3 },
      
      // Detailed styles
      'intricate': { aesthetic: 0.5, line: 0.6, color: 0.5, shading: 0.7, detail: 0.9, texture: 0.6, effects: 0.3, finish: 0.5 },
      'ornate': { aesthetic: 0.6, line: 0.7, color: 0.6, shading: 0.6, detail: 1.0, texture: 0.5, effects: 0.4, finish: 0.7 },
      
      // Special styles
      'glowing': { aesthetic: 0.6, line: 0.1, color: 0.9, shading: 0.5, detail: 0.6, texture: 0.2, effects: 0.9, finish: 0.8 },
      'ethereal': { aesthetic: 0.8, line: 0, color: 0.7, shading: 0.9, detail: 0.4, texture: 0.1, effects: 0.8, finish: 0.9 },
      'sketch': { aesthetic: 0.5, line: 0.8, color: 0.3, shading: 0.4, detail: 0.6, texture: 0.5, effects: 0, finish: 0.1 },
      'painterly': { aesthetic: 0.6, line: 0.2, color: 0.7, shading: 0.8, detail: 0.7, texture: 0.7, effects: 0.2, finish: 0.4 },
      
      // Game-specific inspirations
      'stardew': { aesthetic: 0.8, line: 0.4, color: 0.7, shading: 0.4, detail: 0.6, texture: 0.3, effects: 0.1, finish: 0.3 },
      'terraria': { aesthetic: 0.6, line: 0.3, color: 0.6, shading: 0.5, detail: 0.7, texture: 0.4, effects: 0.3, finish: 0.4 },
      'pokemon': { aesthetic: 0.85, line: 0.5, color: 0.8, shading: 0.3, detail: 0.5, texture: 0.2, effects: 0.2, finish: 0.3 },
      'zelda': { aesthetic: 0.7, line: 0.4, color: 0.7, shading: 0.5, detail: 0.6, texture: 0.3, effects: 0.2, finish: 0.4 }
    };
    
    return presets[name] || presets['modern-pixel'];
  }

  /**
   * Interpolate between two style coordinates
   */
  static interpolate(styleA, styleB, t) {
    const result = {};
    
    for (const key in styleA) {
      if (typeof styleA[key] === 'number') {
        result[key] = styleA[key] + (styleB[key] - styleA[key]) * t;
      }
    }
    
    return result;
  }

  /**
   * Randomize style in style space
   */
  static randomize(seed) {
    const rng = this.createSeededRandom(seed);
    
    return {
      aesthetic: rng.next(),
      line: rng.next(),
      color: rng.next(),
      shading: rng.next(),
      detail: rng.next(),
      texture: rng.next(),
      effects: rng.next(),
      finish: rng.next()
    };
  }

  /**
   * Mutate style coordinates
   */
  static mutate(coordinates, amount = 0.1, seed) {
    const rng = this.createSeededRandom(seed);
    const result = {};
    
    for (const key in coordinates) {
      const mutation = (rng.next() - 0.5) * amount * 2;
      result[key] = Math.max(0, Math.min(1, coordinates[key] + mutation));
    }
    
    return result;
  }

  static createSeededRandom(seed) {
    return {
      value: seed || Math.floor(Math.random() * 1000000),
      next: function() {
        this.value = (this.value * 9301 + 49297) % 233280;
        return this.value / 233280;
      }
    };
  }

  /**
   * Get recommended coordinates for specific use cases
   */
  static getRecommended(useCase) {
    const recommendations = {
      'character': { aesthetic: 0.6, line: 0.5, color: 0.6, shading: 0.5, detail: 0.6, texture: 0.4, effects: 0.2, finish: 0.4 },
      'creature': { aesthetic: 0.4, line: 0.6, color: 0.5, shading: 0.6, detail: 0.7, texture: 0.6, effects: 0.3, finish: 0.5 },
      'weapon': { aesthetic: 0.5, line: 0.5, color: 0.5, shading: 0.6, detail: 0.7, texture: 0.5, effects: 0.4, finish: 0.7 },
      'building': { aesthetic: 0.5, line: 0.6, color: 0.4, shading: 0.5, detail: 0.6, texture: 0.7, effects: 0.1, finish: 0.3 },
      'environment': { aesthetic: 0.6, line: 0.4, color: 0.6, shading: 0.5, detail: 0.6, texture: 0.6, effects: 0.2, finish: 0.3 },
      'ui': { aesthetic: 0.7, line: 0.7, color: 0.6, shading: 0.3, detail: 0.4, texture: 0.2, effects: 0.1, finish: 0.5 },
      'effect': { aesthetic: 0.5, line: 0.1, color: 0.8, shading: 0.7, detail: 0.5, texture: 0.3, effects: 0.9, finish: 0.7 }
    };
    
    return recommendations[useCase] || recommendations['character'];
  }

  /**
   * Convert style coordinates to human-readable description
   */
  static describe(coordinates) {
    const aesthetic = coordinates.aesthetic < 0.3 ? 'dark and gritty' : 
                     coordinates.aesthetic < 0.7 ? 'balanced' : 'bright and cheerful';
    
    const detail = coordinates.detail < 0.3 ? 'minimalist' :
                   coordinates.detail < 0.7 ? 'moderate detail' : 'highly detailed';
    
    const color = coordinates.color < 0.3 ? 'limited palette' :
                  coordinates.color < 0.7 ? 'natural colors' : 'vibrant and saturated';
    
    const shading = coordinates.shading < 0.3 ? 'flat shading' :
                    coordinates.shading < 0.7 ? 'cel shaded' : 'smooth gradients';
    
    return `${aesthetic} style with ${detail}, ${color}, and ${shading}`;
  }
}

module.exports = UniversalStyleSpace;
