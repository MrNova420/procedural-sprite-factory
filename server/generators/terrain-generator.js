const { createNoise2D } = require('simplex-noise');
const seedrandom = require('seedrandom');
const MathUtils = require('../utils/math');

/**
 * Terrain Generator
 * Generates procedural terrain tiles for 2D games
 */
class TerrainGenerator {
  constructor() {
    // Noise instances will be created per-tile with seed
    this.tileSize = 16; // Default 16x16 tiles
    
    // Terrain type definitions
    this.terrainTypes = {
      grass: {
        baseColors: ['#4CAF50', '#45A049', '#66BB6A'],
        noiseScale: 0.3,
        pattern: 'organic',
        variations: 5
      },
      dirt: {
        baseColors: ['#8B4513', '#A0522D', '#654321'],
        noiseScale: 0.4,
        pattern: 'rough',
        variations: 4
      },
      stone: {
        baseColors: ['#808080', '#696969', '#778899'],
        noiseScale: 0.2,
        pattern: 'cracked',
        variations: 6
      },
      water: {
        baseColors: ['#1E90FF', '#4169E1', '#0077BE'],
        noiseScale: 0.1,
        pattern: 'flowing',
        variations: 4,
        animated: true
      },
      sand: {
        baseColors: ['#F4A460', '#EDC9AF', '#DAA520'],
        noiseScale: 0.5,
        pattern: 'grainy',
        variations: 3
      },
      snow: {
        baseColors: ['#FFFFFF', '#F0F8FF', '#E6F2FF'],
        noiseScale: 0.2,
        pattern: 'crystalline',
        variations: 3
      },
      lava: {
        baseColors: ['#FF4500', '#FF6347', '#DC143C'],
        noiseScale: 0.3,
        pattern: 'bubbling',
        variations: 4,
        animated: true,
        glow: true
      },
      wood: {
        baseColors: ['#8B4513', '#A0522D', '#CD853F'],
        noiseScale: 0.15,
        pattern: 'grain',
        variations: 4
      },
      ice: {
        baseColors: ['#ADD8E6', '#B0E0E6', '#87CEEB'],
        noiseScale: 0.2,
        pattern: 'crystalline',
        variations: 3,
        transparent: true
      },
      cave: {
        baseColors: ['#2F4F4F', '#36454F', '#3B3C3D'],
        noiseScale: 0.3,
        pattern: 'rocky',
        variations: 5
      }
    };
  }

  /**
   * Generate a tile set for terrain type
   * @param {string} terrainType - Type of terrain
   * @param {number} tileSize - Size of each tile
   * @param {Object} options - Generation options
   * @returns {Object} - Tile set data
   */
  generateTileSet(terrainType, tileSize = 16, options = {}) {
    this.tileSize = tileSize;
    const terrain = this.terrainTypes[terrainType];
    
    if (!terrain) {
      throw new Error(`Unknown terrain type: ${terrainType}`);
    }

    const tiles = {
      type: terrainType,
      tileSize: tileSize,
      tiles: {},
      variations: [],
      animated: terrain.animated || false
    };

    // Generate base tile
    tiles.tiles.base = this.generateBaseTile(terrain, options);

    // Generate variations to prevent repetition
    for (let i = 0; i < terrain.variations; i++) {
      tiles.variations.push(this.generateVariation(terrain, i, options));
    }

    // Generate edge tiles for transitions
    tiles.tiles.edges = this.generateEdgeTiles(terrain, options);

    // Generate corner tiles
    tiles.tiles.corners = this.generateCornerTiles(terrain, options);

    // Generate animated frames if applicable
    if (terrain.animated) {
      tiles.frames = this.generateAnimatedFrames(terrain, 4, options);
    }

    return tiles;
  }

  /**
   * Generate base tile
   */
  generateBaseTile(terrain, options) {
    const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
    const ctx = canvas.getContext('2d');
    
    // Get base color
    const baseColor = MathUtils.randomChoice(terrain.baseColors);
    
    // Fill with base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
    
    // Apply noise pattern
    this.applyPattern(ctx, terrain, options.seed || 0);
    
    // Apply shading
    this.applyTileShading(ctx, terrain);
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Generate tile variation
   */
  generateVariation(terrain, variationIndex, options) {
    const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
    const ctx = canvas.getContext('2d');
    
    // Slightly different color
    const colorIndex = variationIndex % terrain.baseColors.length;
    const baseColor = terrain.baseColors[colorIndex];
    
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
    
    // Apply pattern with different seed
    this.applyPattern(ctx, terrain, (options.seed || 0) + variationIndex * 1000);
    
    // Apply shading
    this.applyTileShading(ctx, terrain);
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Apply pattern to tile
   */
  applyPattern(ctx, terrain, seed) {
    // Create noise instance with seed for this tile
    const rng = seedrandom(seed.toString());
    const noise2D = createNoise2D(rng);
    
    const imageData = ctx.getImageData(0, 0, this.tileSize, this.tileSize);
    const data = imageData.data;
    
    for (let y = 0; y < this.tileSize; y++) {
      for (let x = 0; x < this.tileSize; x++) {
        const index = (y * this.tileSize + x) * 4;
        
        // Get noise value
        const noise = noise2D(
          (x + seed) * terrain.noiseScale,
          (y + seed) * terrain.noiseScale
        );
        
        // Apply noise to color
        const variation = noise * 30; // ±30 brightness
        
        data[index] = MathUtils.clamp(data[index] + variation, 0, 255);
        data[index + 1] = MathUtils.clamp(data[index + 1] + variation, 0, 255);
        data[index + 2] = MathUtils.clamp(data[index + 2] + variation, 0, 255);
        
        // Add pattern-specific details
        if (terrain.pattern === 'cracked') {
          if (Math.abs(noise) > 0.7) {
            // Add cracks
            data[index] *= 0.7;
            data[index + 1] *= 0.7;
            data[index + 2] *= 0.7;
          }
        } else if (terrain.pattern === 'grain' && x % 2 === 0) {
          // Wood grain
          data[index] *= 0.95;
          data[index + 1] *= 0.95;
          data[index + 2] *= 0.95;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply shading to tile
   */
  applyTileShading(ctx, terrain) {
    // Add subtle gradient for depth
    const gradient = ctx.createLinearGradient(0, 0, this.tileSize, this.tileSize);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
  }

  /**
   * Generate edge tiles for transitions
   */
  generateEdgeTiles(terrain, options) {
    const edges = {};
    const directions = ['top', 'bottom', 'left', 'right'];
    
    for (const dir of directions) {
      const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext('2d');
      
      // Base color
      const baseColor = MathUtils.randomChoice(terrain.baseColors);
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, this.tileSize, this.tileSize);
      
      // Apply pattern
      this.applyPattern(ctx, terrain, options.seed || 0);
      
      // Add edge blending
      this.applyEdgeBlend(ctx, dir);
      
      edges[dir] = canvas.toBuffer('image/png');
    }
    
    return edges;
  }

  /**
   * Apply edge blending
   */
  applyEdgeBlend(ctx, direction) {
    const gradient = direction === 'top' ? ctx.createLinearGradient(0, 0, 0, this.tileSize) :
                     direction === 'bottom' ? ctx.createLinearGradient(0, this.tileSize, 0, 0) :
                     direction === 'left' ? ctx.createLinearGradient(0, 0, this.tileSize, 0) :
                     ctx.createLinearGradient(this.tileSize, 0, 0, 0);
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
  }

  /**
   * Generate corner tiles
   */
  generateCornerTiles(terrain, options) {
    const corners = {};
    const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    
    for (const pos of positions) {
      const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext('2d');
      
      // Base color
      const baseColor = MathUtils.randomChoice(terrain.baseColors);
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, this.tileSize, this.tileSize);
      
      // Apply pattern
      this.applyPattern(ctx, terrain, options.seed || 0);
      
      corners[pos] = canvas.toBuffer('image/png');
    }
    
    return corners;
  }

  /**
   * Generate animated frames
   */
  generateAnimatedFrames(terrain, frameCount, options) {
    const frames = [];
    
    for (let i = 0; i < frameCount; i++) {
      const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext('2d');
      
      // Base color
      const baseColor = MathUtils.randomChoice(terrain.baseColors);
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, this.tileSize, this.tileSize);
      
      // Apply pattern with animation offset
      this.applyPattern(ctx, terrain, (options.seed || 0) + i * 100);
      
      // Add animation-specific effects
      if (terrain.pattern === 'flowing') {
        this.applyFlowEffect(ctx, i, frameCount);
      } else if (terrain.pattern === 'bubbling') {
        this.applyBubbleEffect(ctx, i, frameCount);
      }
      
      frames.push(canvas.toBuffer('image/png'));
    }
    
    return frames;
  }

  /**
   * Apply flow effect for water
   */
  applyFlowEffect(ctx, frame, totalFrames) {
    const offset = (frame / totalFrames) * this.tileSize;
    const imageData = ctx.getImageData(0, 0, this.tileSize, this.tileSize);
    const data = imageData.data;
    
    for (let y = 0; y < this.tileSize; y++) {
      for (let x = 0; x < this.tileSize; x++) {
        const index = (y * this.tileSize + x) * 4;
        
        // Subtle wave effect
        const wave = Math.sin((x + offset) * 0.5) * 10;
        
        data[index + 2] = MathUtils.clamp(data[index + 2] + wave, 0, 255);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply bubble effect for lava
   */
  applyBubbleEffect(ctx, frame, totalFrames) {
    const bubbleChance = 0.05;
    
    for (let i = 0; i < 5; i++) {
      if (Math.random() < bubbleChance) {
        const x = Math.random() * this.tileSize;
        const y = Math.random() * this.tileSize;
        const radius = Math.random() * 2 + 1;
        
        ctx.fillStyle = 'rgba(255, 200, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Generate auto-tile based on neighbors
   * Wang tiles for seamless tiling
   */
  generateAutoTile(terrainType, neighbors, options = {}) {
    const terrain = this.terrainTypes[terrainType];
    if (!terrain) {
      throw new Error(`Unknown terrain type: ${terrainType}`);
    }

    // Create 47-tile Wang set for perfect auto-tiling
    // neighbors: { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight }
    
    const canvas = require('canvas').createCanvas(this.tileSize, this.tileSize);
    const ctx = canvas.getContext('2d');
    
    // Generate base
    const baseColor = MathUtils.randomChoice(terrain.baseColors);
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
    
    // Apply pattern
    this.applyPattern(ctx, terrain, options.seed || 0);
    
    // Apply transitions based on neighbors
    this.applyNeighborTransitions(ctx, neighbors, terrain);
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Apply neighbor-based transitions
   */
  applyNeighborTransitions(ctx, neighbors, terrain) {
    const half = this.tileSize / 2;
    
    // Apply edge darkening based on neighbors
    if (!neighbors.top) {
      const gradient = ctx.createLinearGradient(0, 0, 0, half);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.tileSize, half);
    }
    
    if (!neighbors.bottom) {
      const gradient = ctx.createLinearGradient(0, this.tileSize, 0, half);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, half, this.tileSize, half);
    }
    
    // Similar for left and right...
  }
}

module.exports = TerrainGenerator;
