const AdvancedRenderer = require('./advanced-renderer');

/**
 * Wolf Renderer
 * Professional quadruped wolf with realistic fur rendering
 */
class WolfRenderer extends AdvancedRenderer {
  constructor() {
    super();
  }

  /**
   * Render professional wolf with full anatomy and fur
   */
  async renderWolf(ctx, x, y, radius, dna) {
    const primaryColor = dna.colors?.primary || '#808080';
    const secondaryColor = dna.colors?.secondary || this.lightenColor(primaryColor, 0.4);
    
    const anatomy = this.calculateWolfAnatomy(x, y, radius);
    
    // === STAGE 1: BACK LEGS ===
    
    this.renderWolfLeg(ctx, anatomy.legs.backLeft, 'hind', primaryColor);
    this.renderWolfLeg(ctx, anatomy.legs.backRight, 'hind', primaryColor);
    
    // === STAGE 2: TAIL ===
    
    this.renderWolfTail(ctx, anatomy.tail, primaryColor);
    
    // === STAGE 3: BODY ===
    
    this.renderWolfBody(ctx, anatomy.body, primaryColor, secondaryColor);
    
    // === STAGE 4: FRONT LEGS ===
    
    this.renderWolfLeg(ctx, anatomy.legs.frontLeft, 'fore', primaryColor);
    this.renderWolfLeg(ctx, anatomy.legs.frontRight, 'fore', primaryColor);
    
    // === STAGE 5: NECK AND HEAD ===
    
    this.renderWolfNeck(ctx, anatomy.neck, primaryColor);
    this.renderWolfHead(ctx, anatomy.head, primaryColor, secondaryColor);
    
    // === STAGE 6: FUR TEXTURE ===
    
    this.applyWolfFur(ctx, anatomy, primaryColor);
    
    // === STAGE 7: DETAILS ===
    
    this.renderWolfDetails(ctx, anatomy, primaryColor);
  }

  /**
   * Calculate wolf anatomy structure
   */
  calculateWolfAnatomy(x, y, radius) {
    const bodyLength = radius * 2.2;
    const bodyHeight = radius * 0.9;
    
    return {
      body: {
        x, y,
        length: bodyLength,
        height: bodyHeight
      },
      tail: {
        startX: x - bodyLength * 0.5,
        startY: y,
        endX: x - bodyLength * 1.0,
        endY: y - radius * 0.9
      },
      legs: {
        backLeft: {
          hip: { x: x - bodyLength * 0.25, y: y + bodyHeight * 0.3 },
          paw: { x: x - bodyLength * 0.25 - radius * 0.1, y: y + bodyHeight * 1.8 }
        },
        backRight: {
          hip: { x: x - bodyLength * 0.05, y: y + bodyHeight * 0.3 },
          paw: { x: x - bodyLength * 0.05 + radius * 0.05, y: y + bodyHeight * 1.8 }
        },
        frontLeft: {
          shoulder: { x: x + bodyLength * 0.25, y: y + bodyHeight * 0.2 },
          paw: { x: x + bodyLength * 0.25 - radius * 0.05, y: y + bodyHeight * 1.7 }
        },
        frontRight: {
          shoulder: { x: x + bodyLength * 0.4, y: y + bodyHeight * 0.2 },
          paw: { x: x + bodyLength * 0.4 + radius * 0.05, y: y + bodyHeight * 1.7 }
        }
      },
      neck: {
        startX: x + bodyLength * 0.4,
        startY: y - bodyHeight * 0.3,
        endX: x + bodyLength * 0.55,
        endY: y - bodyHeight * 0.8
      },
      head: {
        x: x + bodyLength * 0.55,
        y: y - bodyHeight * 0.8,
        size: radius * 0.65
      }
    };
  }

  /**
   * Render wolf leg
   */
  renderWolfLeg(ctx, leg, type, color) {
    const startPoint = type === 'hind' ? leg.hip : leg.shoulder;
    const endPoint = leg.paw;
    const thickness = type === 'hind' ? 14 : 12;
    
    // Use organic limb drawing
    this.drawOrganicLimb(
      ctx,
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
      thickness,
      thickness * 0.5,
      this.darkenColor(color, 0.15)
    );
    
    // Paw
    ctx.fillStyle = this.darkenColor(color, 0.2);
    ctx.beginPath();
    ctx.ellipse(endPoint.x, endPoint.y, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Toe pads
    ctx.fillStyle = '#2A2A2A';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(endPoint.x + (i - 1) * 3, endPoint.y + 5, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Render wolf tail
   */
  renderWolfTail(ctx, tail, color) {
    // Main tail shape (bushy)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tail.startX, tail.startY);
    ctx.bezierCurveTo(
      tail.startX - 20, tail.startY - 10,
      tail.endX + 10, tail.endY + 10,
      tail.endX, tail.endY
    );
    ctx.lineTo(tail.endX + 5, tail.endY + 5);
    ctx.bezierCurveTo(
      tail.endX + 15, tail.endY + 15,
      tail.startX - 10, tail.startY - 5,
      tail.startX + 5, tail.startY + 5
    );
    ctx.fill();
    
    // Tail fur texture
    const furCount = 15;
    for (let i = 0; i < furCount; i++) {
      const t = i / furCount;
      const furX = tail.startX + (tail.endX - tail.startX) * t;
      const furY = tail.startY + (tail.endY - tail.startY) * t;
      const angle = Math.atan2(tail.endY - tail.startY, tail.endX - tail.startX) + (Math.random() - 0.5) * 0.5;
      
      this.drawFurStrand(ctx, furX, furY, 15, angle, color);
    }
  }

  /**
   * Render wolf body
   */
  renderWolfBody(ctx, body, primaryColor, secondaryColor) {
    // Main body (elongated)
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y, body.length * 0.5, body.height, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chest (lighter)
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.ellipse(body.x + body.length * 0.15, body.y + body.height * 0.3, body.length * 0.3, body.height * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render wolf neck
   */
  renderWolfNeck(ctx, neck, color) {
    ctx.fillStyle = color;
    
    const width = 16;
    ctx.beginPath();
    ctx.moveTo(neck.startX - width / 2, neck.startY);
    ctx.lineTo(neck.endX - width / 2, neck.endY);
    ctx.lineTo(neck.endX + width / 2, neck.endY);
    ctx.lineTo(neck.startX + width / 2, neck.startY);
    ctx.fill();
  }

  /**
   * Render wolf head
   */
  renderWolfHead(ctx, head, primaryColor, secondaryColor) {
    // Main head
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(head.x, head.y, head.size, head.size * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Muzzle/snout
    ctx.fillStyle = this.darkenColor(primaryColor, 0.1);
    ctx.beginPath();
    ctx.ellipse(head.x + head.size * 0.3, head.y + head.size * 0.2, head.size * 0.6, head.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(head.x + head.size * 0.7, head.y + head.size * 0.2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    this.renderWolfEars(ctx, head, primaryColor);
    
    // Eyes (professional quality)
    const eyeSize = head.size * 0.18;
    const eyeColor = '#FFD700';
    this.renderProfessionalEye(ctx, head.x - head.size * 0.2, head.y - head.size * 0.3, eyeSize, eyeColor, 'alert');
    this.renderProfessionalEye(ctx, head.x + head.size * 0.15, head.y - head.size * 0.25, eyeSize, eyeColor, 'alert');
  }

  /**
   * Render wolf ears
   */
  renderWolfEars(ctx, head, color) {
    const earColor = this.darkenColor(color, 0.15);
    
    // Left ear (pointed, alert)
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.moveTo(head.x - head.size * 0.5, head.y - head.size * 0.4);
    ctx.lineTo(head.x - head.size * 0.6, head.y - head.size * 0.9);
    ctx.lineTo(head.x - head.size * 0.3, head.y - head.size * 0.5);
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(head.x + head.size * 0.3, head.y - head.size * 0.5);
    ctx.lineTo(head.x + head.size * 0.4, head.y - head.size * 0.9);
    ctx.lineTo(head.x + head.size * 0.5, head.y - head.size * 0.4);
    ctx.fill();
    
    // Ear inner (lighter)
    ctx.fillStyle = this.lightenColor(color, 0.2);
    ctx.beginPath();
    ctx.moveTo(head.x - head.size * 0.5, head.y - head.size * 0.45);
    ctx.lineTo(head.x - head.size * 0.55, head.y - head.size * 0.75);
    ctx.lineTo(head.x - head.size * 0.4, head.y - head.size * 0.5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(head.x + head.size * 0.35, head.y - head.size * 0.5);
    ctx.lineTo(head.x + head.size * 0.4, head.y - head.size * 0.75);
    ctx.lineTo(head.x + head.size * 0.45, head.y - head.size * 0.45);
    ctx.fill();
  }

  /**
   * Apply realistic fur texture to wolf
   */
  applyWolfFur(ctx, anatomy, color) {
    // Fur regions with different densities and lengths
    const furRegions = [
      { 
        center: { x: anatomy.body.x, y: anatomy.body.y - anatomy.body.height * 0.3 },
        radius: anatomy.body.length * 0.3,
        length: 12,
        density: 0.6,
        direction: Math.PI / 2
      },
      {
        center: anatomy.tail,
        radius: 20,
        length: 18,
        density: 0.8,
        direction: Math.atan2(anatomy.tail.endY - anatomy.tail.startY, anatomy.tail.endX - anatomy.tail.startX)
      },
      {
        center: { x: anatomy.neck.endX, y: anatomy.neck.endY },
        radius: 15,
        length: 10,
        density: 0.5,
        direction: Math.PI / 2
      }
    ];
    
    for (const region of furRegions) {
      const count = Math.floor(region.radius * region.density * 2);
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * region.radius;
        const furX = (region.center.startX || region.center.x) + Math.cos(angle) * dist;
        const furY = (region.center.startY || region.center.y) + Math.sin(angle) * dist;
        
        this.drawFurStrand(ctx, furX, furY, region.length, region.direction, color);
      }
    }
  }

  /**
   * Render wolf details (whiskers, etc.)
   */
  renderWolfDetails(ctx, anatomy, color) {
    const head = anatomy.head;
    
    // Whiskers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    
    // Left whiskers
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(head.x, head.y + i * 3);
      ctx.lineTo(head.x - head.size * 0.8, head.y + i * 3 - 5);
      ctx.stroke();
    }
    
    // Right whiskers
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(head.x + head.size * 0.3, head.y + i * 3);
      ctx.lineTo(head.x + head.size * 1.1, head.y + i * 3 - 5);
      ctx.stroke();
    }
  }
}

module.exports = WolfRenderer;
