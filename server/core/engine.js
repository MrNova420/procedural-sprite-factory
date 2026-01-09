const CanvasManager = require('./canvas-manager');
const ShapeEngine = require('../generators/shape-engine');
const TextureBrain = require('../generators/texture-brain');
const DNAGenerator = require('../generators/dna-generator');
const PixelArtRenderer = require('../generators/pixel-art-renderer');
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
    this.pixelArtRenderer = new PixelArtRenderer();
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
      
      // PHASE 3: Apply style effects
      const style = dna.style || 'pixel';
      if (style === 'pixel') {
        // Apply pixel art style for crisp pixelated look
        this.pixelArtRenderer.applyPixelArtStyle(ctx, size);
      } else if (style && style !== 'pixel') {
        await this.applyStyleEffects(ctx, style);
      }
      
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
   * Apply style-specific visual effects
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} style - Style name
   */
  async applyStyleEffects(ctx, style) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch (style) {
      case 'dark-fantasy':
        // Darken colors, increase contrast, add purple tint
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          
          // Darken
          data[i] = Math.floor(data[i] * 0.7);
          data[i + 1] = Math.floor(data[i + 1] * 0.65);
          data[i + 2] = Math.floor(data[i + 2] * 0.75);
          
          // Add purple tint
          data[i + 2] = Math.min(255, data[i + 2] + 20);
          
          // Increase contrast
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const factor = 1.4;
          data[i] = Math.min(255, Math.max(0, Math.floor((data[i] - avg) * factor + avg)));
          data[i + 1] = Math.min(255, Math.max(0, Math.floor((data[i + 1] - avg) * factor + avg)));
          data[i + 2] = Math.min(255, Math.max(0, Math.floor((data[i + 2] - avg) * factor + avg)));
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Add dark vignette
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(20, 0, 40, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'cyberpunk':
        // Neon colors, cyan/magenta tint, glow effect
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          
          // Increase saturation
          const max = Math.max(data[i], data[i + 1], data[i + 2]);
          const min = Math.min(data[i], data[i + 1], data[i + 2]);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          if (saturation > 0.2) {
            data[i] = Math.min(255, Math.floor(data[i] * 1.3));
            data[i + 1] = Math.min(255, Math.floor(data[i + 1] * 1.2));
            data[i + 2] = Math.min(255, Math.floor(data[i + 2] * 1.5));
          }
          
          // Add cyan/magenta shift
          const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (luminance > 128) {
            data[i + 1] = Math.min(255, data[i + 1] + 30); // More cyan
            data[i + 2] = Math.min(255, data[i + 2] + 30);
          } else {
            data[i] = Math.min(255, data[i] + 25); // More magenta
            data[i + 2] = Math.min(255, data[i + 2] + 25);
          }
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Add grid overlay
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        break;
        
      case 'cute':
        // Pastel colors, soften, add outline
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          
          // Pastelify - lighten and desaturate
          data[i] = Math.floor(data[i] * 0.7 + 255 * 0.3);
          data[i + 1] = Math.floor(data[i + 1] * 0.7 + 255 * 0.3);
          data[i + 2] = Math.floor(data[i + 2] * 0.7 + 255 * 0.3);
          
          // Slight pink tint
          data[i] = Math.min(255, data[i] + 10);
          data[i + 2] = Math.min(255, data[i + 2] + 5);
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Add soft white outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(255, 200, 200, 0.5)';
        ctx.shadowBlur = 8;
        const tempCanvas = this.canvasManager.createCanvas(canvas.width, canvas.height);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.shadowBlur = 0;
        break;
        
      default:
        // Pixel art - quantize colors
        this.textureBrain.quantizePalette(ctx, 16);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = Engine;
