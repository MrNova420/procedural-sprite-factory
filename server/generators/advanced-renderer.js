/**
 * Advanced Renderer
 * Multi-layer professional rendering system for AAA quality sprites
 */
class AdvancedRenderer {
  constructor() {
    this.lightDirection = { x: -0.5, y: -0.7, z: 0.5 };
  }

  /**
   * Render professional eye with multiple layers
   */
  renderProfessionalEye(ctx, x, y, size, color, mood = 'normal') {
    // Eyeball sphere with gradient
    const gradient = ctx.createRadialGradient(
      x - size * 0.2, y - size * 0.2, 0,
      x, y, size
    );
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(1, '#F0F0F0');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris with radial pattern
    const irisSize = size * 0.6;
    this.renderIris(ctx, x, y, irisSize, color);
    
    // Pupil (adjusts with mood)
    const pupilSize = mood === 'alert' ? irisSize * 0.3 : irisSize * 0.5;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, pupilSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Cornea shine (multiple layers for realism)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Environment reflection
    ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Depth shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Render iris with radial pattern
   */
  renderIris(ctx, x, y, size, color) {
    // Base iris color
    const irisGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    irisGradient.addColorStop(0, this.lightenColor(color, 0.3));
    irisGradient.addColorStop(0.5, color);
    irisGradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Radial pattern (fiber texture)
    ctx.strokeStyle = this.darkenColor(color, 0.2);
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.stroke();
    }
  }

  /**
   * Render individual claw with gradient and highlight
   */
  renderClaw(ctx, x, y, length, angle, sharpness = 1.0) {
    const baseWidth = length * 0.3;
    const tipWidth = length * 0.05;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Claw shape path
    ctx.beginPath();
    ctx.moveTo(0, -baseWidth / 2);
    ctx.quadraticCurveTo(length * 0.3, -tipWidth / 2, length, 0);
    ctx.quadraticCurveTo(length * 0.3, tipWidth / 2, 0, baseWidth / 2);
    ctx.closePath();
    
    // Gradient fill (darker at base, lighter at tip)
    const gradient = ctx.createLinearGradient(0, 0, length, 0);
    gradient.addColorStop(0, '#2A2A2A');
    gradient.addColorStop(0.7, '#3A3A3A');
    gradient.addColorStop(1, '#4A4A4A');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Highlight on edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -baseWidth / 2);
    ctx.quadraticCurveTo(length * 0.3, -tipWidth / 2, length, 0);
    ctx.stroke();
    
    // Sharp tip shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(length, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Render individual scale with 3D appearance
   */
  renderScale(ctx, x, y, size, color, shininess = 0.6, normal = {x: 0, y: 0, z: 1}) {
    // Hexagon points
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      points.push({
        x: x + Math.cos(angle) * size,
        y: y + Math.sin(angle) * size
      });
    }
    
    // Calculate lighting
    const brightness = Math.max(0.3, this.dotProduct(normal, this.lightDirection));
    
    // Base scale color with lighting
    ctx.fillStyle = this.adjustBrightness(color, brightness);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Edge highlight (top-left)
    if (brightness > 0.4) {
      ctx.strokeStyle = this.lightenColor(color, 0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.stroke();
    }
    
    // Specular highlight (shiny spot)
    if (shininess > 0.5 && brightness > 0.6) {
      const specular = Math.pow(brightness, 20) * shininess;
      ctx.fillStyle = `rgba(255, 255, 255, ${specular * 0.5})`;
      ctx.beginPath();
      ctx.arc(x - 1, y - 1, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Draw individual fur strand
   */
  drawFurStrand(ctx, x, y, length, directionAngle, baseColor) {
    // Slight random variation
    const angle = directionAngle + (Math.random() - 0.5) * 0.3;
    const len = length * (0.7 + Math.random() * 0.6);
    
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    
    // Color gradient (darker at root, lighter at tip)
    const gradient = ctx.createLinearGradient(x, y, endX, endY);
    gradient.addColorStop(0, this.darkenColor(baseColor, 0.3));
    gradient.addColorStop(1, this.lightenColor(baseColor, 0.2));
    
    // Draw strand
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  /**
   * Draw smooth organic limb with muscle definition
   */
  drawOrganicLimb(ctx, startX, startY, endX, endY, startThickness, endThickness, color) {
    // Calculate limb direction and length
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Create smooth curve with muscle bulge
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    
    // Limb path with muscle bulge at 40% point
    const bulgePoint = length * 0.4;
    const bulgeAmount = startThickness * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(0, -startThickness / 2);
    ctx.quadraticCurveTo(
      bulgePoint, -(startThickness / 2 + bulgeAmount),
      length, -endThickness / 2
    );
    ctx.lineTo(length, endThickness / 2);
    ctx.quadraticCurveTo(
      bulgePoint, (startThickness / 2 + bulgeAmount),
      0, startThickness / 2
    );
    ctx.closePath();
    
    // Fill with color
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add muscle definition highlight
    ctx.strokeStyle = this.lightenColor(color, 0.2);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -startThickness / 2);
    ctx.quadraticCurveTo(
      bulgePoint, -(startThickness / 2 + bulgeAmount),
      length, -endThickness / 2
    );
    ctx.stroke();
    
    ctx.restore();
  }

  // ============ UTILITY METHODS ============

  /**
   * Calculate dot product for lighting
   */
  dotProduct(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * Adjust color brightness
   */
  adjustBrightness(color, brightness) {
    const rgb = this.hexToRgb(color);
    return `rgb(${Math.floor(rgb.r * brightness)}, ${Math.floor(rgb.g * brightness)}, ${Math.floor(rgb.b * brightness)})`;
  }

  /**
   * Lighten color by percentage
   */
  lightenColor(color, amount) {
    const rgb = this.hexToRgb(color);
    return `rgb(${Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount))}, ${Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount))}, ${Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))})`;
  }

  /**
   * Darken color by percentage
   */
  darkenColor(color, amount) {
    const rgb = this.hexToRgb(color);
    return `rgb(${Math.floor(rgb.r * (1 - amount))}, ${Math.floor(rgb.g * (1 - amount))}, ${Math.floor(rgb.b * (1 - amount))})`;
  }

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    // Handle different color formats
    if (hex.startsWith('rgb')) {
      const match = hex.match(/\d+/g);
      return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
    }
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }
}

module.exports = AdvancedRenderer;
