const { createNoise2D, createNoise3D } = require('simplex-noise');
const seedrandom = require('seedrandom');
const MathUtils = require('../utils/math');

/**
 * Texture Brain
 * Generates procedural textures using noise and patterns
 */
class TextureBrain {
  constructor() {
    this.materialPresets = require('../../presets/materials/textures.json');
  }

  /**
   * Apply texture to canvas region
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} materialType - Material type (skin, metal, cloth, etc.)
   * @param {Object} options - Texture options
   */
  applyTexture(ctx, materialType, options = {}) {
    const material = this.materialPresets[materialType];
    if (!material) {
      console.warn(`Material ${materialType} not found, using default`);
      return;
    }

    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const seed = options.seed || 0;
    
    // Create noise instances with seed for reproducibility
    const rng = seedrandom(seed.toString());
    const noise2D = createNoise2D(rng);
    const noise3D = createNoise3D(rng);
    
    // Apply noise-based texture
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        
        // Skip transparent pixels
        if (data[index + 3] === 0) continue;
        
        // Get noise value based on material type
        let noise = this.getNoiseForMaterial(
          x, y, 
          material.noiseType, 
          material.noiseScale,
          seed,
          noise2D,
          noise3D
        );
        
        // Apply noise strength
        noise = noise * material.noiseStrength;
        
        // Modulate existing color with noise
        data[index] = MathUtils.clamp(data[index] + noise * 255, 0, 255);
        data[index + 1] = MathUtils.clamp(data[index + 1] + noise * 255, 0, 255);
        data[index + 2] = MathUtils.clamp(data[index + 2] + noise * 255, 0, 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Get noise value for material
   */
  getNoiseForMaterial(x, y, noiseType, scale, seed = 0, noise2D, noise3D) {
    const sx = x * scale + seed;
    const sy = y * scale + seed;

    switch (noiseType) {
      case 'perlin':
        return noise2D(sx, sy);
      
      case 'fractal':
        return this.fractalNoise(sx, sy, noise2D, 4);
      
      case 'voronoi':
        return this.voronoiNoise(sx, sy);
      
      default:
        return noise2D(sx, sy);
    }
  }

  /**
   * Fractal noise (multiple octaves)
   */
  fractalNoise(x, y, noise2D, octaves = 4, persistence = 0.5) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }

  /**
   * Voronoi noise (cell-based)
   */
  voronoiNoise(x, y, scale = 10) {
    const cellX = Math.floor(x / scale);
    const cellY = Math.floor(y / scale);
    
    let minDist = Infinity;
    
    // Check surrounding cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const neighborX = cellX + dx;
        const neighborY = cellY + dy;
        
        // Generate point in cell
        const pointX = (neighborX + this.hash2D(neighborX, neighborY)) * scale;
        const pointY = (neighborY + this.hash2D(neighborY, neighborX)) * scale;
        
        const dist = Math.sqrt(
          Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2)
        );
        
        minDist = Math.min(minDist, dist);
      }
    }
    
    // Normalize to 0-1
    return MathUtils.clamp(minDist / scale, 0, 1);
  }

  /**
   * Hash function for 2D coordinates
   */
  hash2D(x, y) {
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return h - Math.floor(h);
  }

  /**
   * Apply shading based on lighting
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} lightDirection - Light direction {x, y, z}
   * @param {number} intensity - Light intensity (0-1)
   */
  applyShading(ctx, lightDirection = {x: -1, y: -1, z: 1}, intensity = 0.5) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Normalize light direction
    const length = Math.sqrt(
      lightDirection.x ** 2 + 
      lightDirection.y ** 2 + 
      lightDirection.z ** 2
    );
    const light = {
      x: lightDirection.x / length,
      y: lightDirection.y / length,
      z: lightDirection.z / length
    };

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        
        // Skip transparent pixels
        if (data[index + 3] === 0) continue;
        
        // Calculate surface normal (simplified)
        const normal = this.calculateNormal(data, x, y, canvas.width, canvas.height);
        
        // Calculate lighting
        const dotProduct = normal.x * light.x + normal.y * light.y + normal.z * light.z;
        const shadingFactor = Math.max(0, dotProduct) * intensity;
        
        // Apply shading
        data[index] = MathUtils.clamp(data[index] * (1 - intensity + shadingFactor), 0, 255);
        data[index + 1] = MathUtils.clamp(data[index + 1] * (1 - intensity + shadingFactor), 0, 255);
        data[index + 2] = MathUtils.clamp(data[index + 2] * (1 - intensity + shadingFactor), 0, 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Calculate surface normal at pixel
   */
  calculateNormal(data, x, y, width, height) {
    // Sample neighboring pixels for gradient
    const getAlpha = (px, py) => {
      if (px < 0 || px >= width || py < 0 || py >= height) return 0;
      return data[(py * width + px) * 4 + 3];
    };

    const dx = getAlpha(x + 1, y) - getAlpha(x - 1, y);
    const dy = getAlpha(x, y + 1) - getAlpha(x, y - 1);
    
    // Normalize
    const length = Math.sqrt(dx ** 2 + dy ** 2 + 1);
    
    return {
      x: -dx / length,
      y: -dy / length,
      z: 1 / length
    };
  }

  /**
   * Apply color palette quantization
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} colorCount - Number of colors in palette
   */
  quantizePalette(ctx, colorCount = 16) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Skip transparent pixels
      if (data[i + 3] === 0) continue;
      
      // Quantize each channel
      const levels = colorCount / 3; // Rough approximation
      data[i] = Math.round(data[i] / 255 * levels) * (255 / levels);
      data[i + 1] = Math.round(data[i + 1] / 255 * levels) * (255 / levels);
      data[i + 2] = Math.round(data[i + 2] / 255 * levels) * (255 / levels);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply dithering
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} pattern - Dithering pattern ('bayer', 'floyd-steinberg')
   */
  applyDither(ctx, pattern = 'bayer') {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (pattern === 'bayer') {
      // Bayer matrix 4x4
      const bayerMatrix = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]
      ];

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          
          if (data[index + 3] === 0) continue;
          
          const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
          
          for (let c = 0; c < 3; c++) {
            data[index + c] = data[index + c] > threshold ? 255 : 0;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

module.exports = TextureBrain;
