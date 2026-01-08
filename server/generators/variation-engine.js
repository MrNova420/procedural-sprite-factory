const MathUtils = require('../utils/math');
const ColorUtils = require('../utils/colors');

/**
 * Variation Engine
 * Creates variations of existing assets
 */
class VariationEngine {
  constructor() {
    this.variationTypes = ['similar', 'color', 'proportion', 'style', 'details', 'mutation'];
  }

  /**
   * Create variations of an asset
   * @param {Object} dna - Original DNA
   * @param {number} count - Number of variations
   * @param {string} type - Type of variation
   * @param {number} amount - Amount of variation (0-1)
   * @returns {Array} - Array of varied DNAs
   */
  createVariations(dna, count = 10, type = 'similar', amount = 0.5) {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      let varied;
      
      switch (type) {
        case 'similar':
          varied = this.createSimilar(dna, amount);
          break;
        case 'color':
          varied = this.varyColors(dna, amount);
          break;
        case 'proportion':
          varied = this.varyProportions(dna, amount);
          break;
        case 'style':
          varied = this.varyStyle(dna);
          break;
        case 'details':
          varied = this.varyDetails(dna, amount);
          break;
        case 'mutation':
          varied = this.createMutation(dna, amount);
          break;
        default:
          varied = this.createSimilar(dna, amount);
      }
      
      variations.push(varied);
    }
    
    return variations;
  }

  /**
   * Create similar variation (subtle changes)
   */
  createSimilar(dna, amount) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    // Vary size slightly
    varied.size *= 1 + (Math.random() - 0.5) * amount * 0.2;
    varied.size = MathUtils.clamp(varied.size, 0.5, 3.0);
    
    // Vary colors slightly
    if (varied.colors && varied.colors.primary) {
      varied.colors.primary = this.shiftColorSlightly(varied.colors.primary, amount * 0.1);
    }
    
    // Vary proportions slightly if they exist
    if (varied.proportions) {
      for (const key in varied.proportions) {
        varied.proportions[key] *= 1 + (Math.random() - 0.5) * amount * 0.1;
      }
    }
    
    return varied;
  }

  /**
   * Vary colors significantly
   */
  varyColors(dna, amount) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    if (varied.colors) {
      // Shift hue by larger amount
      if (varied.colors.primary) {
        varied.colors.primary = this.shiftColorSlightly(varied.colors.primary, amount * 0.5);
      }
      if (varied.colors.secondary) {
        varied.colors.secondary = this.shiftColorSlightly(varied.colors.secondary, amount * 0.5);
      }
      
      // Randomize accent colors
      if (Math.random() < amount) {
        varied.colors.accent = ColorUtils.rgbToHex(
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
        );
      }
    }
    
    return varied;
  }

  /**
   * Vary proportions
   */
  varyProportions(dna, amount) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    if (varied.proportions) {
      for (const key in varied.proportions) {
        // Larger proportion changes
        varied.proportions[key] *= 1 + (Math.random() - 0.5) * amount * 0.5;
        varied.proportions[key] = MathUtils.clamp(varied.proportions[key], 0.5, 2.0);
      }
    }
    
    // Vary overall size too
    varied.size *= 1 + (Math.random() - 0.5) * amount * 0.3;
    varied.size = MathUtils.clamp(varied.size, 0.5, 3.0);
    
    return varied;
  }

  /**
   * Change art style
   */
  varyStyle(dna) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    const styles = [
      'pixel', 'dark-fantasy', 'cyberpunk', 'cute', 'anime',
      'steampunk', 'minimalist', 'hand-drawn', 'retro', 'neon'
    ];
    
    // Pick random different style
    const currentStyle = varied.style || 'pixel';
    const otherStyles = styles.filter(s => s !== currentStyle);
    varied.style = MathUtils.randomChoice(otherStyles);
    
    return varied;
  }

  /**
   * Vary details and features
   */
  varyDetails(dna, amount) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    if (varied.features) {
      // Randomly toggle features
      for (const key in varied.features) {
        if (Math.random() < amount * 0.3) {
          if (typeof varied.features[key] === 'boolean') {
            varied.features[key] = !varied.features[key];
          }
        }
      }
      
      // Add random new features
      if (Math.random() < amount) {
        const newFeatures = ['scars', 'markings', 'glow', 'aura', 'ornaments'];
        const feature = MathUtils.randomChoice(newFeatures);
        varied.features[feature] = true;
      }
    }
    
    return varied;
  }

  /**
   * Create wild mutation
   */
  createMutation(dna, amount) {
    const varied = JSON.parse(JSON.stringify(dna));
    
    // Mutate everything based on amount
    if (Math.random() < amount) {
      varied.size *= MathUtils.randomRange(0.5, 1.5);
      varied.size = MathUtils.clamp(varied.size, 0.5, 3.0);
    }
    
    if (Math.random() < amount && varied.colors) {
      varied.colors.primary = ColorUtils.rgbToHex(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      );
    }
    
    if (Math.random() < amount && varied.proportions) {
      for (const key in varied.proportions) {
        varied.proportions[key] *= MathUtils.randomRange(0.7, 1.4);
      }
    }
    
    if (Math.random() < amount) {
      const styles = ['pixel', 'dark-fantasy', 'cyberpunk', 'cute', 'anime'];
      varied.style = MathUtils.randomChoice(styles);
    }
    
    return varied;
  }

  /**
   * Shift color slightly
   */
  shiftColorSlightly(hex, amount) {
    try {
      const [r, g, b] = ColorUtils.hexToRgb(hex);
      const [h, s, l] = ColorUtils.rgbToHsl(r, g, b);
      
      // Shift hue
      const newH = (h + (Math.random() - 0.5) * amount * 360) % 360;
      
      const [nr, ng, nb] = ColorUtils.hslToRgb(newH, s, l);
      return ColorUtils.rgbToHex(nr, ng, nb);
    } catch (error) {
      return hex;
    }
  }

  /**
   * Create style variations
   * Generate same asset in multiple styles
   */
  createStyleVariations(dna, styles) {
    const variations = [];
    
    for (const style of styles) {
      const varied = JSON.parse(JSON.stringify(dna));
      varied.style = style;
      variations.push(varied);
    }
    
    return variations;
  }

  /**
   * Create color variations
   * Generate same asset in multiple color schemes
   */
  createColorSchemes(dna, count = 5) {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      const varied = JSON.parse(JSON.stringify(dna));
      
      // Generate harmonious color scheme
      const baseHue = Math.random() * 360;
      const [r, g, b] = ColorUtils.hslToRgb(baseHue, 70, 50);
      varied.colors.primary = ColorUtils.rgbToHex(r, g, b);
      
      const scheme = MathUtils.randomChoice(['analogous', 'complementary', 'triadic']);
      const palette = ColorUtils.harmonious(varied.colors.primary, scheme);
      varied.colors.secondary = palette[1];
      varied.colors.accent = palette[2];
      
      variations.push(varied);
    }
    
    return variations;
  }

  /**
   * Generate seed-based variation
   * Same seed produces same result
   */
  createSeededVariation(dna, seed) {
    // Use seed to initialize random for reproducibility
    const seedRandom = this.seededRandom(seed);
    
    const varied = JSON.parse(JSON.stringify(dna));
    
    // Apply deterministic changes based on seed
    varied.size *= 1 + (seedRandom() - 0.5) * 0.2;
    varied.size = MathUtils.clamp(varied.size, 0.5, 3.0);
    
    if (varied.colors && varied.colors.primary) {
      const [r, g, b] = ColorUtils.hexToRgb(varied.colors.primary);
      const [h, s, l] = ColorUtils.rgbToHsl(r, g, b);
      const newH = (h + (seedRandom() - 0.5) * 60) % 360;
      const [nr, ng, nb] = ColorUtils.hslToRgb(newH, s, l);
      varied.colors.primary = ColorUtils.rgbToHex(nr, ng, nb);
    }
    
    return varied;
  }

  /**
   * Seeded random number generator
   */
  seededRandom(seed) {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
}

module.exports = VariationEngine;
