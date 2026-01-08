const CanvasManager = require('./canvas-manager');
const ShapeEngine = require('../generators/shape-engine');
const { generateId } = require('../utils/helpers');

/**
 * Main Sprite Factory Engine
 * Coordinates all generation engines and manages the pipeline
 */
class Engine {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.shapeEngine = new ShapeEngine();
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
      // Generate unique ID
      const id = generateId();
      
      // Set up canvas based on size requirements
      const size = this.calculateSize(dna.size || 1.0);
      const canvas = this.canvasManager.createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, size, size);
      
      // PHASE 1: Generate shape/silhouette
      await this.shapeEngine.generateShape(ctx, dna, size);
      
      // TODO: PHASE 2: Apply textures (Texture Brain)
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
