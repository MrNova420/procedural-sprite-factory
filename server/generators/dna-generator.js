const ColorUtils = require('../utils/colors');
const MathUtils = require('../utils/math');

/**
 * DNA Generator
 * Creates, mutates, and breeds sprite DNA for infinite variations
 */
class DNAGenerator {
  constructor() {
    this.speciesPresets = require('../../presets/species/basic-creatures.json');
  }

  /**
   * Generate random DNA
   * @param {string} species - Species type
   * @param {Object} options - Generation options
   * @returns {Object} - Complete DNA structure
   */
  generate(species = null, options = {}) {
    // Random species if not specified
    if (!species) {
      const availableSpecies = Object.keys(this.speciesPresets);
      species = MathUtils.randomChoice(availableSpecies);
    }

    const preset = this.speciesPresets[species];
    if (!preset) {
      throw new Error(`Unknown species: ${species}`);
    }

    const dna = {
      // Core Identity
      id: this.generateId(),
      species: species,
      variant: this.generateVariant(species),
      
      // Physical Traits
      size: options.size || MathUtils.randomRange(0.7, 1.5),
      proportions: this.generateProportions(preset.proportions),
      
      // Appearance
      colors: options.colors || this.generateColors(preset.defaultColors),
      
      // Features
      features: this.generateFeatures(preset.features),
      
      // Equipment (for applicable species)
      equipment: this.generateEquipment(species),
      
      // State
      state: {
        pose: 'idle',
        facing: 'right',
        mood: 'neutral',
        health: 100
      },
      
      // Effects
      effects: {
        aura: options.aura || this.randomAura(),
        glow: options.glow || false,
        particles: []
      },
      
      // Generation Settings
      generation: {
        seed: Math.floor(Math.random() * 1000000),
        complexity: options.complexity || 'medium',
        symmetry: preset.bodyType === 'biped' ? 'horizontal' : 'none',
        detailLevel: options.detailLevel || 5,
        stylization: options.stylization || 0.5
      },
      
      // Metadata
      meta: {
        name: this.generateName(species),
        description: `A ${this.generateVariant(species)} ${species}`,
        tags: [species, preset.bodyType],
        rarity: this.calculateRarity(),
        generation: 1,
        parents: []
      },
      
      // Style
      style: options.style || 'pixel',
      enableTextures: options.enableTextures !== false
    };

    return dna;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return require('crypto').randomBytes(8).toString('hex');
  }

  /**
   * Generate variant name
   */
  generateVariant(species) {
    const variants = {
      dragon: ['fire', 'ice', 'shadow', 'storm', 'crystal', 'forest'],
      wolf: ['timber', 'arctic', 'dire', 'shadow', 'alpha'],
      goblin: ['cave', 'mountain', 'swamp', 'desert', 'frost'],
      robot: ['combat', 'scout', 'heavy', 'stealth', 'engineer'],
      human: ['warrior', 'mage', 'ranger', 'rogue', 'paladin']
    };
    
    const list = variants[species] || ['common'];
    return MathUtils.randomChoice(list);
  }

  /**
   * Generate proportions with variation
   */
  generateProportions(baseProportions) {
    const proportions = {};
    
    for (const [part, base] of Object.entries(baseProportions)) {
      // Add ±20% variation
      proportions[part] = base * MathUtils.randomRange(0.8, 1.2);
    }
    
    return proportions;
  }

  /**
   * Generate color scheme
   */
  generateColors(defaultColors) {
    const primary = defaultColors.primary || ColorUtils.rgbToHex(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );
    
    // Generate harmonious colors
    const scheme = MathUtils.randomChoice(['analogous', 'complementary', 'triadic']);
    const palette = ColorUtils.harmonious(primary, scheme);
    
    return {
      primary: palette[0],
      secondary: palette[1] || ColorUtils.lighten(palette[0], 0.2),
      accent: palette[2] || ColorUtils.darken(palette[0], 0.2),
      eyes: defaultColors.eyes || ColorUtils.complementary(palette[0]),
      glow: ColorUtils.lighten(palette[0], 0.4)
    };
  }

  /**
   * Generate features
   */
  generateFeatures(baseFeatures) {
    const features = { ...baseFeatures };
    
    // Add random variations
    if (Math.random() > 0.7) {
      features.scars = true;
    }
    
    if (Math.random() > 0.8) {
      features.markings = MathUtils.randomChoice(['stripes', 'spots', 'tribal']);
    }
    
    return features;
  }

  /**
   * Generate equipment
   */
  generateEquipment(species) {
    if (species === 'robot') {
      return {
        weapons: [MathUtils.randomChoice(['laser', 'plasma', 'railgun'])],
        armor: MathUtils.randomChoice(['light', 'medium', 'heavy']),
        modules: []
      };
    }
    
    if (['human', 'goblin'].includes(species)) {
      return {
        weapon: MathUtils.randomChoice(['sword', 'axe', 'bow', 'staff']),
        armor: MathUtils.randomChoice(['none', 'light', 'medium', 'heavy']),
        accessories: []
      };
    }
    
    return {};
  }

  /**
   * Random aura effect
   */
  randomAura() {
    if (Math.random() > 0.7) {
      return {
        type: MathUtils.randomChoice(['fire', 'ice', 'shadow', 'holy', 'electric', 'none']),
        intensity: Math.random()
      };
    }
    return { type: 'none', intensity: 0 };
  }

  /**
   * Calculate rarity
   */
  calculateRarity() {
    const roll = Math.random();
    if (roll > 0.95) return 'legendary';
    if (roll > 0.85) return 'epic';
    if (roll > 0.65) return 'rare';
    if (roll > 0.35) return 'uncommon';
    return 'common';
  }

  /**
   * Generate name
   */
  generateName(species) {
    const prefixes = ['Shadow', 'Storm', 'Iron', 'Swift', 'Dark', 'Bright', 'Ancient', 'Young'];
    const suffixes = ['claw', 'fang', 'heart', 'eye', 'wing', 'scale', 'blade', 'spirit'];
    
    const prefix = MathUtils.randomChoice(prefixes);
    const suffix = MathUtils.randomChoice(suffixes);
    
    return `${prefix}${suffix}`;
  }

  /**
   * Mutate DNA
   * @param {Object} dna - Original DNA
   * @param {number} mutationRate - Mutation rate (0-1)
   * @returns {Object} - Mutated DNA
   */
  mutate(dna, mutationRate = 0.3) {
    const mutated = JSON.parse(JSON.stringify(dna)); // Deep clone
    
    mutated.id = this.generateId();
    mutated.meta.generation = (dna.meta.generation || 1) + 1;
    mutated.meta.parents = [dna.id];
    
    // Mutate size
    if (Math.random() < mutationRate) {
      mutated.size *= MathUtils.randomRange(0.9, 1.1);
      mutated.size = MathUtils.clamp(mutated.size, 0.5, 3.0);
    }
    
    // Mutate proportions
    if (Math.random() < mutationRate) {
      for (const part in mutated.proportions) {
        mutated.proportions[part] *= MathUtils.randomRange(0.95, 1.05);
      }
    }
    
    // Mutate colors
    if (Math.random() < mutationRate) {
      const shiftAmount = 0.1;
      mutated.colors.primary = this.shiftColor(mutated.colors.primary, shiftAmount);
      mutated.colors.secondary = this.shiftColor(mutated.colors.secondary, shiftAmount);
    }
    
    // Mutate features
    if (Math.random() < mutationRate * 0.5) {
      mutated.features.scars = !mutated.features.scars;
    }
    
    // Mutate variant
    if (Math.random() < mutationRate * 0.3) {
      mutated.variant = this.generateVariant(mutated.species);
    }
    
    return mutated;
  }

  /**
   * Breed two DNA strands
   * @param {Object} parent1 - First parent DNA
   * @param {Object} parent2 - Second parent DNA
   * @returns {Object} - Child DNA
   */
  breed(parent1, parent2) {
    // Must be same species
    if (parent1.species !== parent2.species) {
      throw new Error('Cannot breed different species');
    }
    
    const child = {
      id: this.generateId(),
      species: parent1.species,
      variant: Math.random() > 0.5 ? parent1.variant : parent2.variant,
      
      // Average or random choice of physical traits
      size: (parent1.size + parent2.size) / 2 + MathUtils.randomRange(-0.1, 0.1),
      
      proportions: this.inheritProportions(parent1.proportions, parent2.proportions),
      
      // Blend colors
      colors: this.blendColors(parent1.colors, parent2.colors),
      
      // Inherit features
      features: this.inheritFeatures(parent1.features, parent2.features),
      
      // Random equipment
      equipment: Math.random() > 0.5 ? parent1.equipment : parent2.equipment,
      
      state: {
        pose: 'idle',
        facing: 'right',
        mood: 'neutral',
        health: 100
      },
      
      effects: {
        aura: Math.random() > 0.5 ? parent1.effects.aura : parent2.effects.aura,
        glow: parent1.effects.glow || parent2.effects.glow,
        particles: []
      },
      
      generation: {
        seed: Math.floor(Math.random() * 1000000),
        complexity: Math.random() > 0.5 ? parent1.generation.complexity : parent2.generation.complexity,
        symmetry: parent1.generation.symmetry,
        detailLevel: Math.round((parent1.generation.detailLevel + parent2.generation.detailLevel) / 2),
        stylization: (parent1.generation.stylization + parent2.generation.stylization) / 2
      },
      
      meta: {
        name: this.generateName(parent1.species),
        description: `Offspring of ${parent1.meta.name} and ${parent2.meta.name}`,
        tags: [...new Set([...parent1.meta.tags, ...parent2.meta.tags])],
        rarity: this.calculateRarity(),
        generation: Math.max(parent1.meta.generation || 1, parent2.meta.generation || 1) + 1,
        parents: [parent1.id, parent2.id]
      },
      
      style: Math.random() > 0.5 ? parent1.style : parent2.style,
      enableTextures: parent1.enableTextures && parent2.enableTextures
    };
    
    return child;
  }

  /**
   * Inherit proportions from parents
   */
  inheritProportions(prop1, prop2) {
    const result = {};
    
    for (const part in prop1) {
      if (prop2[part] !== undefined) {
        // Blend with slight mutation
        result[part] = (prop1[part] + prop2[part]) / 2 * MathUtils.randomRange(0.95, 1.05);
      } else {
        result[part] = prop1[part];
      }
    }
    
    return result;
  }

  /**
   * Blend colors from parents
   */
  blendColors(colors1, colors2) {
    return {
      primary: ColorUtils.blend(colors1.primary, colors2.primary, 0.5 + Math.random() * 0.2 - 0.1),
      secondary: ColorUtils.blend(colors1.secondary, colors2.secondary, 0.5 + Math.random() * 0.2 - 0.1),
      accent: ColorUtils.blend(colors1.accent || colors1.primary, colors2.accent || colors2.primary, 0.5),
      eyes: Math.random() > 0.5 ? colors1.eyes : colors2.eyes,
      glow: ColorUtils.blend(colors1.glow || colors1.primary, colors2.glow || colors2.primary, 0.5)
    };
  }

  /**
   * Inherit features from parents
   */
  inheritFeatures(feat1, feat2) {
    const result = {};
    
    // Merge features
    const allKeys = new Set([...Object.keys(feat1), ...Object.keys(feat2)]);
    
    for (const key of allKeys) {
      if (typeof feat1[key] === 'boolean' && typeof feat2[key] === 'boolean') {
        // Random inheritance for boolean features
        result[key] = Math.random() > 0.5 ? feat1[key] : feat2[key];
      } else {
        // Take from parent with the feature
        result[key] = feat1[key] !== undefined ? feat1[key] : feat2[key];
      }
    }
    
    return result;
  }

  /**
   * Shift color by hue rotation
   */
  shiftColor(hex, amount) {
    const [r, g, b] = ColorUtils.hexToRgb(hex);
    const [h, s, l] = ColorUtils.rgbToHsl(r, g, b);
    
    const newH = (h + amount * 360) % 360;
    const [nr, ng, nb] = ColorUtils.hslToRgb(newH, s, l);
    
    return ColorUtils.rgbToHex(nr, ng, nb);
  }

  /**
   * Serialize DNA to compressed string
   */
  serialize(dna) {
    return Buffer.from(JSON.stringify(dna)).toString('base64');
  }

  /**
   * Deserialize DNA from string
   */
  deserialize(dnaString) {
    try {
      return JSON.parse(Buffer.from(dnaString, 'base64').toString());
    } catch (error) {
      throw new Error('Invalid DNA string');
    }
  }

  /**
   * Validate DNA structure
   */
  validate(dna) {
    const required = ['species', 'size', 'colors', 'proportions'];
    
    for (const field of required) {
      if (!dna[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }
    
    if (dna.size < 0.5 || dna.size > 3.0) {
      return { valid: false, error: 'Size must be between 0.5 and 3.0' };
    }
    
    return { valid: true };
  }
}

module.exports = DNAGenerator;
