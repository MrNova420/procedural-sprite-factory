/**
 * Auto-Tiler System
 * Automatically generates seamless tileable terrain and assets
 * Handles edge blending, neighbor detection, and detail layering
 */

class AutoTiler {
  constructor() {
    this.tileCache = new Map();
  }

  /**
   * Generate a complete tileset for a terrain type
   */
  generateTileset(params) {
    const {
      material = 'grass',
      size = 32,
      seed = Date.now(),
      style = {}
    } = params;

    const rng = this.createSeededRandom(seed);
    
    // Generate base tiles with edge variations
    const tileset = {
      // Center tiles (no edges)
      center: this.generateCenterTile(material, size, rng, style),
      
      // Edge tiles (4 directions)
      edges: {
        north: this.generateEdgeTile(material, size, rng, style, 'north'),
        south: this.generateEdgeTile(material, size, rng, style, 'south'),
        east: this.generateEdgeTile(material, size, rng, style, 'east'),
        west: this.generateEdgeTile(material, size, rng, style, 'west')
      },
      
      // Corner tiles (4 corners)
      corners: {
        ne: this.generateCornerTile(material, size, rng, style, 'ne'),
        nw: this.generateCornerTile(material, size, rng, style, 'nw'),
        se: this.generateCornerTile(material, size, rng, style, 'se'),
        sw: this.generateCornerTile(material, size, rng, style, 'sw')
      },
      
      // Transition tiles (for blending with other materials)
      transitions: this.generateTransitions(material, size, rng, style)
    };

    return tileset;
  }

  /**
   * Generate center tile (no edges touching other materials)
   */
  generateCenterTile(material, size, rng, style) {
    const canvas = this.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Base material texture
    this.applyMaterialTexture(ctx, material, size, rng, style);
    
    // Add detail layer (small variations)
    this.addDetailLayer(ctx, material, size, rng, 0.3);
    
    return canvas;
  }

  /**
   * Generate edge tile that blends with another material
   */
  generateEdgeTile(material, size, rng, style, direction) {
    const canvas = this.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Apply base texture
    this.applyMaterialTexture(ctx, material, size, rng, style);
    
    // Apply edge gradient based on direction
    this.applyEdgeBlend(ctx, size, direction);
    
    // Add detail layer
    this.addDetailLayer(ctx, material, size, rng, 0.2);
    
    return canvas;
  }

  /**
   * Generate corner tile
   */
  generateCornerTile(material, size, rng, style, corner) {
    const canvas = this.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Apply base texture
    this.applyMaterialTexture(ctx, material, size, rng, style);
    
    // Apply corner blend
    this.applyCornerBlend(ctx, size, corner);
    
    // Add detail layer
    this.addDetailLayer(ctx, material, size, rng, 0.2);
    
    return canvas;
  }

  /**
   * Generate transition tiles for blending between two materials
   */
  generateTransitions(material, size, rng, style) {
    const transitions = {};
    const otherMaterials = ['grass', 'dirt', 'stone', 'water', 'sand'];
    
    otherMaterials.forEach(other => {
      if (other !== material) {
        transitions[other] = this.generateTransitionTile(material, other, size, rng, style);
      }
    });
    
    return transitions;
  }

  /**
   * Generate a smooth transition between two materials
   */
  generateTransitionTile(material1, material2, size, rng, style) {
    const canvas = this.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient mask
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    // Apply material 1
    this.applyMaterialTexture(ctx, material1, size, rng, style);
    
    // Blend in material 2
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    ctx.globalCompositeOperation = 'destination-over';
    this.applyMaterialTexture(ctx, material2, size, rng, style);
    
    ctx.globalCompositeOperation = 'source-over';
    
    return canvas;
  }

  /**
   * Apply material-specific texture
   */
  applyMaterialTexture(ctx, material, size, rng, style) {
    const colors = this.getMaterialColors(material);
    
    // Base color
    ctx.fillStyle = colors.base;
    ctx.fillRect(0, 0, size, size);
    
    // Add noise texture
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = rng.next() * 0.2 - 0.1;
      data[i] = Math.max(0, Math.min(255, data[i] + noise * 255));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 255));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 255));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add material-specific patterns
    this.addMaterialPattern(ctx, material, size, rng, colors);
  }

  /**
   * Add detail layer (small rocks, grass clumps, etc.)
   */
  addDetailLayer(ctx, material, size, rng, density) {
    const detailCount = Math.floor(size * density);
    
    for (let i = 0; i < detailCount; i++) {
      const x = rng.next() * size;
      const y = rng.next() * size;
      const detailSize = 1 + rng.next() * 3;
      
      // Draw small detail based on material
      this.drawDetail(ctx, material, x, y, detailSize, rng);
    }
  }

  /**
   * Draw material-specific detail
   */
  drawDetail(ctx, material, x, y, size, rng) {
    const colors = this.getMaterialColors(material);
    
    ctx.fillStyle = colors.detail;
    ctx.globalAlpha = 0.3 + rng.next() * 0.4;
    
    switch (material) {
      case 'grass':
        // Small grass blade
        ctx.fillRect(x, y, 1, size);
        break;
      case 'dirt':
        // Small rock
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'stone':
        // Crack
        ctx.strokeStyle = colors.detail;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size * (rng.next() - 0.5), y + size * (rng.next() - 0.5));
        ctx.stroke();
        break;
      case 'sand':
        // Grain
        ctx.fillRect(x, y, 1, 1);
        break;
      default:
        ctx.fillRect(x, y, size, size);
    }
    
    ctx.globalAlpha = 1.0;
  }

  /**
   * Apply edge blending
   */
  applyEdgeBlend(ctx, size, direction) {
    const gradient = this.createDirectionalGradient(ctx, size, direction);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Apply corner blending
   */
  applyCornerBlend(ctx, size, corner) {
    const x = corner.includes('e') ? size : 0;
    const y = corner.includes('s') ? size : 0;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Create directional gradient
   */
  createDirectionalGradient(ctx, size, direction) {
    let gradient;
    
    switch (direction) {
      case 'north':
        gradient = ctx.createLinearGradient(0, 0, 0, size);
        break;
      case 'south':
        gradient = ctx.createLinearGradient(0, size, 0, 0);
        break;
      case 'east':
        gradient = ctx.createLinearGradient(size, 0, 0, 0);
        break;
      case 'west':
        gradient = ctx.createLinearGradient(0, 0, size, 0);
        break;
    }
    
    gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    
    return gradient;
  }

  /**
   * Add material-specific patterns
   */
  addMaterialPattern(ctx, material, size, rng, colors) {
    switch (material) {
      case 'grass':
        this.addGrassPattern(ctx, size, rng, colors);
        break;
      case 'stone':
        this.addStonePattern(ctx, size, rng, colors);
        break;
      case 'water':
        this.addWaterPattern(ctx, size, rng, colors);
        break;
      case 'sand':
        this.addSandPattern(ctx, size, rng, colors);
        break;
    }
  }

  addGrassPattern(ctx, size, rng, colors) {
    // Add darker grass patches
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors.dark;
      ctx.globalAlpha = 0.2;
      const x = rng.next() * size;
      const y = rng.next() * size;
      const w = 3 + rng.next() * 5;
      const h = 3 + rng.next() * 5;
      ctx.fillRect(x, y, w, h);
    }
    ctx.globalAlpha = 1.0;
  }

  addStonePattern(ctx, size, rng, colors) {
    // Add cracks
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(rng.next() * size, rng.next() * size);
      ctx.lineTo(rng.next() * size, rng.next() * size);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  addWaterPattern(ctx, size, rng, colors) {
    // Add ripples
    ctx.strokeStyle = colors.light;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    
    for (let i = 0; i < 3; i++) {
      const x = rng.next() * size;
      const y = rng.next() * size;
      const r = 2 + rng.next() * 4;
      
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  addSandPattern(ctx, size, rng, colors) {
    // Add ripple lines
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.1;
    
    for (let i = 0; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i + rng.next() * 2);
      ctx.lineTo(size, i + rng.next() * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Get material colors
   */
  getMaterialColors(material) {
    const colors = {
      grass: { base: '#4a7c2f', dark: '#3a6125', light: '#5a8c3f', detail: '#3a5c25' },
      dirt: { base: '#6b4423', dark: '#5b3418', light: '#7b5433', detail: '#4b2813' },
      stone: { base: '#8c8c8c', dark: '#6c6c6c', light: '#acacac', detail: '#5c5c5c' },
      water: { base: '#3a7cc2', dark: '#2a6cb2', light: '#4a8cd2', detail: '#2a5ca2' },
      sand: { base: '#d2b48c', dark: '#c2a47c', light: '#e2c49c', detail: '#b29c6c' }
    };
    
    return colors[material] || colors.grass;
  }

  /**
   * Create canvas helper
   */
  createCanvas(width, height) {
    const { createCanvas } = require('canvas');
    return createCanvas(width, height);
  }

  /**
   * Seeded random number generator
   */
  createSeededRandom(seed) {
    return {
      value: seed,
      next: function() {
        this.value = (this.value * 9301 + 49297) % 233280;
        return this.value / 233280;
      }
    };
  }

  /**
   * Auto-tile a map based on neighbor detection
   */
  autoTileMap(mapData, tileset) {
    const width = mapData.width;
    const height = mapData.height;
    const tiles = mapData.tiles;
    
    const tiledMap = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const currentTile = tiles[idx];
        
        // Check neighbors
        const neighbors = this.getNeighbors(tiles, x, y, width, height);
        
        // Select appropriate tile variant
        const tileVariant = this.selectTileVariant(currentTile, neighbors, tileset);
        
        tiledMap.push({
          x, y,
          tile: tileVariant
        });
      }
    }
    
    return tiledMap;
  }

  /**
   * Get neighboring tiles
   */
  getNeighbors(tiles, x, y, width, height) {
    return {
      n: y > 0 ? tiles[(y - 1) * width + x] : null,
      s: y < height - 1 ? tiles[(y + 1) * width + x] : null,
      e: x < width - 1 ? tiles[y * width + (x + 1)] : null,
      w: x > 0 ? tiles[y * width + (x - 1)] : null,
      ne: (y > 0 && x < width - 1) ? tiles[(y - 1) * width + (x + 1)] : null,
      nw: (y > 0 && x > 0) ? tiles[(y - 1) * width + (x - 1)] : null,
      se: (y < height - 1 && x < width - 1) ? tiles[(y + 1) * width + (x + 1)] : null,
      sw: (y < height - 1 && x > 0) ? tiles[(y + 1) * width + (x - 1)] : null
    };
  }

  /**
   * Select tile variant based on neighbors
   */
  selectTileVariant(current, neighbors, tileset) {
    // If all neighbors are same, use center tile
    const allSame = Object.values(neighbors).every(n => n === current || n === null);
    if (allSame) {
      return tileset.center;
    }
    
    // Check edges
    if (neighbors.n !== current) return tileset.edges.north;
    if (neighbors.s !== current) return tileset.edges.south;
    if (neighbors.e !== current) return tileset.edges.east;
    if (neighbors.w !== current) return tileset.edges.west;
    
    // Check corners
    if (neighbors.ne !== current) return tileset.corners.ne;
    if (neighbors.nw !== current) return tileset.corners.nw;
    if (neighbors.se !== current) return tileset.corners.se;
    if (neighbors.sw !== current) return tileset.corners.sw;
    
    // Default to center
    return tileset.center;
  }
}

module.exports = AutoTiler;
