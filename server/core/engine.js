const CanvasManager = require('./canvas-manager');
const ShapeEngine = require('../generators/shape-engine');
const TextureBrain = require('../generators/texture-brain');
const DNAGenerator = require('../generators/dna-generator');
const { generateId } = require('../utils/helpers');

/**
 * Main Sprite Factory Engine
 * Coordinates all generation engines and manages the pipeline
 */
class Engine {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.shapeEngine = new ShapeEngine();
    this.textureBrain = new TextureBrain();
    this.dnaGenerator = new DNAGenerator();
    this.cache = new Map(); // Store generated sprites
  }

  /**
   * Generate a sprite from DNA parameters
   * @param {Object} dna - DNA parameters defining the sprite
   * @returns {Object} - Generated sprite data
   */
  async generate(dna) {
    const startTime = Date.now();
    
    try {
      // If DNA is incomplete, generate full DNA
      if (!dna.id || !dna.meta) {
        dna = this.dnaGenerator.generate(dna.species, dna);
      }
      
      // Validate DNA
      const validation = this.dnaGenerator.validate(dna);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      const id = dna.id || generateId();
      
      // Set up canvas based on size requirements
      const size = this.calculateSize(dna.size || 1.0);
      const canvas = this.canvasManager.createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, size, size);
      
      // PHASE 1: Generate shape/silhouette
      await this.shapeEngine.generateShape(ctx, dna, size);
      
      // PHASE 2: Apply textures (Texture Brain)
      const materialType = this.getMaterialType(dna.species);
      if (dna.enableTextures !== false) {
        this.textureBrain.applyTexture(ctx, materialType, {
          baseColor: this.hexToRgb(dna.colors?.primary || '#FFFFFF'),
          seed: Math.random() * 1000
        });
        
        // Apply shading
        this.textureBrain.applyShading(ctx, {x: -1, y: -1, z: 1}, 0.3);
      }
      
      // TODO: PHASE 3: Apply style (Style Engine)
      // TODO: PHASE 4: Add VFX if specified
      
      // Export as PNG buffer
      const buffer = canvas.toBuffer('image/png');
      
      const generationTime = Date.now() - startTime;
      
      const result = {
        id,
        buffer,
        canvas,
        dna,
        metadata: {
          size: [size, size],
          generationTime: `${generationTime}ms`,
          timestamp: new Date().toISOString()
        }
      };
      
      // Cache the result
      this.cache.set(id, result);
      
      return result;
    } catch (error) {
      console.error('Generation error:', error);
      throw new Error(`Failed to generate sprite: ${error.message}`);
    }
  }

  /**
   * Calculate pixel size from DNA size parameter
   * @param {number} sizeMultiplier - Size multiplier (0.5 - 3.0)
   * @returns {number} - Pixel size
   */
  calculateSize(sizeMultiplier) {
    const baseSize = 64; // Default 64x64
    const size = Math.round(baseSize * sizeMultiplier);
    
    // Clamp to valid range (16-128)
    return Math.max(16, Math.min(128, size));
  }

  /**
   * Get material type for species
   */
  getMaterialType(species) {
    const materials = {
      dragon: 'scales',
      wolf: 'fur',
      goblin: 'skin',
      robot: 'metal',
      human: 'skin'
    };
    return materials[species] || 'skin';
  }

  /**
   * Convert hex color to RGB array
   */
  hexToRgb(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];
  }

  /**
   * Get cached sprite by ID
   * @param {string} id - Sprite ID
   * @returns {Object|null} - Cached sprite or null
   */
  getCached(id) {
    return this.cache.get(id) || null;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = Engine;
