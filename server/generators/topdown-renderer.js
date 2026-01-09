const AdvancedRenderer = require('./advanced-renderer');

/**
 * Top-Down Renderer
 * Specialized AAA quality renderer for 2D top-down perspective games
 * Renders everything from birds-eye view with proper depth, shadows, and perspective
 */
class TopDownRenderer extends AdvancedRenderer {
  constructor() {
    super();
    
    // Top-down specific rendering parameters
    this.shadowAngle = Math.PI / 4; // 45-degree shadow angle
    this.shadowLength = 0.3; // Shadow projection length
    this.depthScale = 0.8; // Vertical compression for depth perception
  }

  /**
   * Render character/creature from top-down view
   */
  renderTopDownCharacter(ctx, x, y, scale, params) {
    const { archetype, material, palette, features } = params;
    
    // Layer 1: Shadow (oval on ground)
    this.renderTopDownShadow(ctx, x, y, scale * 1.2, scale * 0.6);
    
    // Layer 2: Feet/base
    if (archetype !== 'floating') {
      this.renderTopDownFeet(ctx, x, y, scale, archetype);
    }
    
    // Layer 3: Body from top
    this.renderTopDownBody(ctx, x, y, scale, archetype, palette.primary, material);
    
    // Layer 4: Arms/appendages
    if (archetype === 'biped' || archetype === 'quadruped') {
      this.renderTopDownLimbs(ctx, x, y, scale, archetype, palette.primary);
    }
    
    // Layer 5: Head from top
    this.renderTopDownHead(ctx, x, y, scale * 0.8, features, palette);
    
    // Layer 6: Equipment/details
    if (features.equipment) {
      this.renderTopDownEquipment(ctx, x, y, scale, features.equipment, palette);
    }
    
    // Layer 7: Effects (selection circle, health bar)
    if (params.showUI) {
      this.renderTopDownUI(ctx, x, y, scale, params);
    }
  }

  /**
   * Render item from top-down view
   */
  renderTopDownItem(ctx, x, y, scale, itemData) {
    const { itemType, quality, palette } = itemData;
    
    // Shadow
    this.renderTopDownShadow(ctx, x, y, scale * 0.6, scale * 0.4);
    
    // Item base
    ctx.save();
    
    if (itemType.includes('sword') || itemType.includes('weapon')) {
      // Weapon lying on ground
      const length = scale * 0.8;
      const width = scale * 0.15;
      
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      
      // Blade
      ctx.fillStyle = palette.primary;
      ctx.fillRect(-width / 2, -length / 2, width, length * 0.7);
      
      // Handle
      ctx.fillStyle = this.darkenColor(palette.primary, 0.3);
      ctx.fillRect(-width / 2, length * 0.2, width, length * 0.3);
      
      // Guard
      ctx.fillRect(-width * 1.5, length * 0.15, width * 3, width * 0.5);
      
      // Quality glow
      if (quality === 'epic' || quality === 'legendary') {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = palette.accent;
        ctx.fillRect(-width, -length / 2 - 5, width * 2, length + 10);
      }
      
      ctx.restore();
    } else if (itemType.includes('potion')) {
      // Potion bottle from top
      const size = scale * 0.4;
      
      // Bottle body (circular from top)
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Cork/cap (smaller circle)
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Liquid shine
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = this.lightenColor(palette.primary, 0.4);
      ctx.beginPath();
      ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      ctx.restore();
    } else if (itemType.includes('shield')) {
      // Shield from top (circular or shaped)
      const shieldSize = scale * 0.6;
      
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.arc(x, y, shieldSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Shield boss
      ctx.fillStyle = this.lightenColor(palette.primary, 0.3);
      ctx.beginPath();
      ctx.arc(x, y, shieldSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Edge highlight
      ctx.strokeStyle = this.lightenColor(palette.primary, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, shieldSize, 0, Math.PI);
      ctx.stroke();
      
      ctx.restore();
    } else {
      // Generic item (box/gem from top)
      const itemSize = scale * 0.4;
      
      if (itemType.includes('gem') || itemType.includes('crystal')) {
        // Gem sparkle from top
        const sides = 6;
        ctx.fillStyle = palette.primary;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const radius = itemSize * (i % 2 === 0 ? 1 : 0.7);
          ctx.lineTo(
            x + Math.cos(angle) * radius,
            y + Math.sin(angle) * radius
          );
        }
        ctx.closePath();
        ctx.fill();
        
        // Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, itemSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      } else {
        // Generic box/crate
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x - itemSize / 2, y - itemSize / 2, itemSize, itemSize);
        
        // 3D edge
        ctx.fillStyle = this.lightenColor(palette.primary, 0.3);
        ctx.beginPath();
        ctx.moveTo(x - itemSize / 2, y - itemSize / 2);
        ctx.lineTo(x + itemSize / 2, y - itemSize / 2);
        ctx.lineTo(x + itemSize / 2 + 5, y - itemSize / 2 - 5);
        ctx.lineTo(x - itemSize / 2 + 5, y - itemSize / 2 - 5);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  /**
   * Render environment from top-down view
   */
  renderTopDownEnvironment(ctx, x, y, scale, envData) {
    const { assetType, structure, palette } = envData;
    
    if (assetType === 'tree') {
      // Tree from top (circular canopy)
      const canopySize = scale * structure.canopy.size;
      const trunkSize = scale * structure.trunk.width;
      
      // Shadow
      this.renderTopDownShadow(ctx, x + 5, y + 5, canopySize, canopySize * 0.8);
      
      // Trunk (small circle in center)
      ctx.fillStyle = '#4A3018';
      ctx.beginPath();
      ctx.arc(x, y, trunkSize * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Canopy (large circle with texture)
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.arc(x, y, canopySize, 0, Math.PI * 2);
      ctx.fill();
      
      // Foliage detail (clusters)
      ctx.fillStyle = this.darkenColor(palette.primary, 0.2);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const clusterX = x + Math.cos(angle) * canopySize * 0.6;
        const clusterY = y + Math.sin(angle) * canopySize * 0.6;
        ctx.beginPath();
        ctx.arc(clusterX, clusterY, canopySize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Highlights
      ctx.fillStyle = this.lightenColor(palette.primary, 0.3);
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(x - canopySize * 0.3, y - canopySize * 0.3, canopySize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
    } else if (assetType === 'rock' || assetType === 'boulder') {
      // Rock from top (irregular shape)
      const rockSize = scale * 0.8;
      
      this.renderTopDownShadow(ctx, x + 3, y + 3, rockSize, rockSize * 0.7);
      
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      const segments = structure.segments || 6;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const radius = rockSize * (0.8 + Math.random() * 0.4);
        if (i === 0) {
          ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        } else {
          ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        }
      }
      ctx.closePath();
      ctx.fill();
      
      // Top highlight
      ctx.fillStyle = this.lightenColor(palette.primary, 0.3);
      ctx.beginPath();
      ctx.arc(x - rockSize * 0.2, y - rockSize * 0.2, rockSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Cracks
      ctx.strokeStyle = this.darkenColor(palette.primary, 0.4);
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        const angle = Math.random() * Math.PI * 2;
        ctx.lineTo(x + Math.cos(angle) * rockSize * 0.6, y + Math.sin(angle) * rockSize * 0.6);
        ctx.stroke();
      }
      
    } else if (assetType === 'building' || assetType === 'tower') {
      // Building from top (rectangular footprint)
      const buildingWidth = scale * structure.width;
      const buildingDepth = scale * structure.width * 0.8;
      
      // Shadow
      this.renderTopDownShadow(ctx, x + 8, y + 8, buildingWidth * 1.2, buildingDepth * 1.2);
      
      // Roof
      ctx.fillStyle = this.darkenColor(palette.primary, 0.2);
      ctx.fillRect(x - buildingWidth / 2, y - buildingDepth / 2, buildingWidth, buildingDepth);
      
      // Roof edge highlight
      ctx.fillStyle = this.lightenColor(palette.primary, 0.2);
      ctx.fillRect(x - buildingWidth / 2, y - buildingDepth / 2, buildingWidth, 5);
      ctx.fillRect(x - buildingWidth / 2, y - buildingDepth / 2, 5, buildingDepth);
      
      // Roof details (tiles pattern)
      ctx.strokeStyle = this.darkenColor(palette.primary, 0.4);
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(x - buildingWidth / 2, y - buildingDepth / 2 + i * (buildingDepth / 10));
        ctx.lineTo(x + buildingWidth / 2, y - buildingDepth / 2 + i * (buildingDepth / 10));
        ctx.stroke();
      }
      
      // Chimney (if present)
      if (structure.floors > 1) {
        ctx.fillStyle = '#4A3018';
        ctx.fillRect(x + buildingWidth * 0.2, y - buildingDepth * 0.2, buildingWidth * 0.15, buildingDepth * 0.15);
        
        // Smoke
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.beginPath();
        ctx.arc(x + buildingWidth * 0.27, y - buildingDepth * 0.25, 5, 0, Math.PI * 2);
        ctx.arc(x + buildingWidth * 0.27 - 3, y - buildingDepth * 0.35, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      
    } else if (assetType === 'bush' || assetType === 'grass') {
      // Vegetation from top (organic cluster)
      const vegSize = scale * 0.6;
      
      ctx.fillStyle = palette.primary;
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const offset = vegSize * 0.4;
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(angle) * offset,
          y + Math.sin(angle) * offset,
          vegSize * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      
      // Center
      ctx.fillStyle = this.darkenColor(palette.primary, 0.2);
      ctx.beginPath();
      ctx.arc(x, y, vegSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Render wall/fence from top-down view
   */
  renderTopDownWall(ctx, startX, startY, endX, endY, thickness, color) {
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    
    // Wall base
    ctx.fillStyle = color;
    ctx.fillRect(0, -thickness / 2, length, thickness);
    
    // Top edge (lighter)
    ctx.fillStyle = this.lightenColor(color, 0.3);
    ctx.fillRect(0, -thickness / 2, length, 2);
    
    // Segments
    ctx.strokeStyle = this.darkenColor(color, 0.3);
    ctx.lineWidth = 1;
    const segments = Math.floor(length / 20);
    for (let i = 1; i < segments; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (length / segments), -thickness / 2);
      ctx.lineTo(i * (length / segments), thickness / 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Render floor/ground tile
   */
  renderTopDownTile(ctx, x, y, tileSize, tileType, palette) {
    ctx.save();
    
    switch (tileType) {
      case 'grass':
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x, y, tileSize, tileSize);
        
        // Grass blades
        ctx.strokeStyle = this.darkenColor(palette.primary, 0.2);
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          const bx = x + Math.random() * tileSize;
          const by = y + Math.random() * tileSize;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.random() * 3 - 1.5, by - 3);
          ctx.stroke();
        }
        break;
        
      case 'stone':
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x, y, tileSize, tileSize);
        
        // Stone pattern
        ctx.strokeStyle = this.darkenColor(palette.primary, 0.3);
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
        
        // Cracks
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + tileSize / 2);
        ctx.lineTo(x + tileSize, y + tileSize / 2);
        ctx.moveTo(x + tileSize / 2, y);
        ctx.lineTo(x + tileSize / 2, y + tileSize);
        ctx.stroke();
        break;
        
      case 'wood':
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x, y, tileSize, tileSize);
        
        // Wood grain
        ctx.strokeStyle = this.darkenColor(palette.primary, 0.3);
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const gy = y + (i / 5) * tileSize;
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.lineTo(x + tileSize, gy);
          ctx.stroke();
        }
        break;
        
      case 'water':
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x, y, tileSize, tileSize);
        
        // Water ripples
        ctx.strokeStyle = this.lightenColor(palette.primary, 0.2);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 3; i++) {
          const cx = x + tileSize / 2 + (Math.random() - 0.5) * tileSize * 0.5;
          const cy = y + tileSize / 2 + (Math.random() - 0.5) * tileSize * 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, tileSize * 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        break;
    }
    
    ctx.restore();
  }

  // ============ HELPER METHODS ============

  renderTopDownShadow(ctx, x, y, width, height) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderTopDownFeet(ctx, x, y, scale, archetype) {
    const feetColor = '#2A2A2A';
    ctx.fillStyle = feetColor;
    
    if (archetype === 'biped') {
      // Two feet
      ctx.beginPath();
      ctx.ellipse(x - scale * 0.15, y + scale * 0.4, scale * 0.12, scale * 0.08, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(x + scale * 0.15, y + scale * 0.4, scale * 0.12, scale * 0.08, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (archetype === 'quadruped') {
      // Four paws
      const positions = [
        [-scale * 0.2, scale * 0.3],
        [scale * 0.2, scale * 0.3],
        [-scale * 0.15, -scale * 0.2],
        [scale * 0.15, -scale * 0.2]
      ];
      positions.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(x + px, y + py, scale * 0.08, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  renderTopDownBody(ctx, x, y, scale, archetype, color, material) {
    ctx.fillStyle = color;
    
    if (archetype === 'biped' || archetype === 'quadruped') {
      // Oval body
      ctx.beginPath();
      ctx.ellipse(x, y, scale * 0.6, scale * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Shading
      ctx.fillStyle = this.darkenColor(color, 0.2);
      ctx.beginPath();
      ctx.ellipse(x + scale * 0.2, y + scale * 0.2, scale * 0.4, scale * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (archetype === 'floating') {
      // Circular floating body
      ctx.beginPath();
      ctx.arc(x, y, scale * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = this.lightenColor(color, 0.5);
      ctx.beginPath();
      ctx.arc(x, y, scale * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  renderTopDownLimbs(ctx, x, y, scale, archetype, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = scale * 0.15;
    ctx.lineCap = 'round';
    
    if (archetype === 'biped') {
      // Arms
      ctx.beginPath();
      ctx.moveTo(x - scale * 0.6, y);
      ctx.lineTo(x - scale * 0.3, y - scale * 0.2);
      ctx.moveTo(x + scale * 0.6, y);
      ctx.lineTo(x + scale * 0.3, y - scale * 0.2);
      ctx.stroke();
    } else if (archetype === 'quadruped') {
      // Four legs (simplified from top)
      const legPositions = [
        [-scale * 0.5, -scale * 0.3, -scale * 0.2, -scale * 0.2],
        [scale * 0.5, -scale * 0.3, scale * 0.2, -scale * 0.2],
        [-scale * 0.4, scale * 0.4, -scale * 0.15, scale * 0.3],
        [scale * 0.4, scale * 0.4, scale * 0.15, scale * 0.3]
      ];
      
      legPositions.forEach(([sx, sy, ex, ey]) => {
        ctx.beginPath();
        ctx.moveTo(x + sx, y + sy);
        ctx.lineTo(x + ex, y + ey);
        ctx.stroke();
      });
    }
  }

  renderTopDownHead(ctx, x, y, scale, features, palette) {
    // Head circle
    ctx.fillStyle = palette.primary;
    ctx.beginPath();
    ctx.arc(x, y - scale * 0.8, scale * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (two dots)
    if (features.eyes) {
      ctx.fillStyle = features.eyes.color;
      const eyeSize = scale * 0.08;
      ctx.beginPath();
      ctx.arc(x - scale * 0.15, y - scale * 0.85, eyeSize, 0, Math.PI * 2);
      ctx.arc(x + scale * 0.15, y - scale * 0.85, eyeSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderTopDownEquipment(ctx, x, y, scale, equipment, palette) {
    // Helmet/hat on top of head
    if (equipment.helmet) {
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(x, y - scale * 0.8, scale * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Weapon in hand
    if (equipment.weapon) {
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = scale * 0.1;
      ctx.beginPath();
      ctx.moveTo(x + scale * 0.7, y);
      ctx.lineTo(x + scale * 1.2, y - scale * 0.3);
      ctx.stroke();
    }
  }

  renderTopDownUI(ctx, x, y, scale, params) {
    // Selection circle
    if (params.selected) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x, y, scale * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Health bar
    if (params.showHealth) {
      const barWidth = scale * 1.5;
      const barHeight = 4;
      const healthPercent = params.health || 1.0;
      
      // Background
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(x - barWidth / 2, y - scale * 1.5, barWidth, barHeight);
      
      // Health
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(x - barWidth / 2, y - scale * 1.5, barWidth * healthPercent, barHeight);
      
      // Border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - barWidth / 2, y - scale * 1.5, barWidth, barHeight);
    }
  }
}

module.exports = TopDownRenderer;
