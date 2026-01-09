const AdvancedRenderer = require('./advanced-renderer');

/**
 * Dragon Renderer
 * Professional anatomically-correct dragon rendering with individual scales
 */
class DragonRenderer extends AdvancedRenderer {
  constructor() {
    super();
  }

  /**
   * Render professional dragon with full anatomy
   */
  async renderDragon(ctx, x, y, radius, dna) {
    const primaryColor = dna.colors?.primary || '#8B0000';
    const secondaryColor = dna.colors?.secondary || this.lightenColor(primaryColor, 0.3);
    
    const anatomy = this.calculateDragonAnatomy(x, y, radius);
    
    // === STAGE 1: BACKGROUND ELEMENTS ===
    
    // Wing membranes (behind everything)
    this.renderWingMembranes(ctx, anatomy.wings, primaryColor);
    
    // Tail
    this.renderDragonTail(ctx, anatomy.tail, primaryColor);
    
    // === STAGE 2: BACK LEGS ===
    
    this.renderDragonLeg(ctx, anatomy.legs.backLeft, 'back', primaryColor);
    this.renderDragonLeg(ctx, anatomy.legs.backRight, 'back', primaryColor);
    
    // === STAGE 3: MAIN BODY ===
    
    this.renderDragonBody(ctx, anatomy.body, primaryColor, secondaryColor);
    
    // Apply scale texture to body
    this.applyDragonScales(ctx, anatomy.body, primaryColor);
    
    // === STAGE 4: FRONT LEGS ===
    
    this.renderDragonLeg(ctx, anatomy.legs.frontLeft, 'front', primaryColor);
    this.renderDragonLeg(ctx, anatomy.legs.frontRight, 'front', primaryColor);
    
    // === STAGE 5: NECK AND HEAD ===
    
    this.renderDragonNeck(ctx, anatomy.neck, primaryColor);
    this.renderDragonHead(ctx, anatomy.head, primaryColor, secondaryColor);
    
    // === STAGE 6: WING BONES ===
    
    this.renderWingBones(ctx, anatomy.wings, primaryColor);
    
    // === STAGE 7: DETAILS ===
    
    this.renderDragonDetails(ctx, anatomy, primaryColor);
  }

  /**
   * Calculate dragon anatomy structure
   */
  calculateDragonAnatomy(x, y, radius) {
    const bodyWidth = radius * 1.4;
    const bodyHeight = radius * 1.8;
    
    return {
      body: {
        x, y,
        width: bodyWidth,
        height: bodyHeight
      },
      tail: {
        startX: x - bodyWidth * 0.3,
        startY: y + bodyHeight * 0.3,
        endX: x - bodyWidth * 1.8,
        endY: y + bodyHeight * 0.9
      },
      wings: {
        left: {
          base: { x: x - bodyWidth * 0.4, y: y - bodyHeight * 0.2 },
          tip: { x: x - bodyWidth * 2.2, y: y - bodyHeight * 0.3 }
        },
        right: {
          base: { x: x + bodyWidth * 0.4, y: y - bodyHeight * 0.2 },
          tip: { x: x + bodyWidth * 2.2, y: y - bodyHeight * 0.3 }
        }
      },
      legs: {
        backLeft: {
          shoulder: { x: x - bodyWidth * 0.2, y: y + bodyHeight * 0.4 },
          foot: { x: x - bodyWidth * 0.2 - radius * 0.3, y: y + bodyHeight * 1.5 }
        },
        backRight: {
          shoulder: { x: x + bodyWidth * 0.1, y: y + bodyHeight * 0.4 },
          foot: { x: x + bodyWidth * 0.1 + radius * 0.2, y: y + bodyHeight * 1.5 }
        },
        frontLeft: {
          shoulder: { x: x - bodyWidth * 0.3, y: y - bodyHeight * 0.1 },
          foot: { x: x - bodyWidth * 0.3 - radius * 0.4, y: y + bodyHeight * 1.3 }
        },
        frontRight: {
          shoulder: { x: x + bodyWidth * 0.3, y: y - bodyHeight * 0.1 },
          foot: { x: x + bodyWidth * 0.3 + radius * 0.4, y: y + bodyHeight * 1.3 }
        }
      },
      neck: {
        startX: x,
        startY: y - bodyHeight * 0.5,
        endX: x,
        endY: y - bodyHeight * 0.85
      },
      head: {
        x: x,
        y: y - bodyHeight * 0.85,
        size: radius * 0.8
      }
    };
  }

  /**
   * Render wing membranes
   */
  renderWingMembranes(ctx, wings, color) {
    // Left wing membrane
    ctx.fillStyle = this.adjustBrightness(color, 0.4);
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(wings.left.base.x, wings.left.base.y);
    ctx.quadraticCurveTo(
      wings.left.base.x - 50, wings.left.base.y - 30,
      wings.left.tip.x, wings.left.tip.y
    );
    ctx.quadraticCurveTo(
      wings.left.base.x - 40, wings.left.base.y + 20,
      wings.left.base.x, wings.left.base.y
    );
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Right wing membrane
    ctx.fillStyle = this.adjustBrightness(color, 0.4);
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(wings.right.base.x, wings.right.base.y);
    ctx.quadraticCurveTo(
      wings.right.base.x + 50, wings.right.base.y - 30,
      wings.right.tip.x, wings.right.tip.y
    );
    ctx.quadraticCurveTo(
      wings.right.base.x + 40, wings.right.base.y + 20,
      wings.right.base.x, wings.right.base.y
    );
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  /**
   * Render wing bones
   */
  renderWingBones(ctx, wings, color) {
    const boneColor = this.darkenColor(color, 0.3);
    ctx.strokeStyle = boneColor;
    ctx.lineWidth = 3;
    
    // Left wing bones
    ctx.beginPath();
    ctx.moveTo(wings.left.base.x, wings.left.base.y);
    ctx.lineTo(wings.left.base.x - 50, wings.left.base.y - 20);
    ctx.moveTo(wings.left.base.x, wings.left.base.y);
    ctx.lineTo(wings.left.base.x - 60, wings.left.base.y);
    ctx.moveTo(wings.left.base.x, wings.left.base.y);
    ctx.lineTo(wings.left.base.x - 45, wings.left.base.y + 15);
    ctx.stroke();
    
    // Right wing bones
    ctx.beginPath();
    ctx.moveTo(wings.right.base.x, wings.right.base.y);
    ctx.lineTo(wings.right.base.x + 50, wings.right.base.y - 20);
    ctx.moveTo(wings.right.base.x, wings.right.base.y);
    ctx.lineTo(wings.right.base.x + 60, wings.right.base.y);
    ctx.moveTo(wings.right.base.x, wings.right.base.y);
    ctx.lineTo(wings.right.base.x + 45, wings.right.base.y + 15);
    ctx.stroke();
  }

  /**
   * Render dragon tail
   */
  renderDragonTail(ctx, tail, color) {
    const tailColor = this.darkenColor(color, 0.2);
    
    // Main tail body
    ctx.fillStyle = tailColor;
    ctx.beginPath();
    ctx.moveTo(tail.startX, tail.startY);
    ctx.quadraticCurveTo(
      tail.startX - 40, tail.startY + 20,
      tail.endX, tail.endY
    );
    ctx.lineTo(tail.endX + 8, tail.endY - 3);
    ctx.quadraticCurveTo(
      tail.startX - 30, tail.startY + 10,
      tail.startX + 5, tail.startY - 5
    );
    ctx.fill();
    
    // Tail spikes
    const spikeColor = this.darkenColor(color, 0.3);
    for (let i = 0; i < 4; i++) {
      const t = i / 4;
      const spikeX = tail.startX - (tail.startX - tail.endX) * t;
      const spikeY = tail.startY + (tail.endY - tail.startY) * t;
      
      ctx.fillStyle = spikeColor;
      ctx.beginPath();
      ctx.moveTo(spikeX - 4, spikeY);
      ctx.lineTo(spikeX, spikeY - 10);
      ctx.lineTo(spikeX + 4, spikeY);
      ctx.fill();
    }
  }

  /**
   * Render dragon leg
   */
  renderDragonLeg(ctx, leg, type, color) {
    const thickness = type === 'back' ? 20 : 18;
    
    // Use organic limb drawing from advanced renderer
    this.drawOrganicLimb(
      ctx,
      leg.shoulder.x,
      leg.shoulder.y,
      leg.foot.x,
      leg.foot.y,
      thickness,
      thickness * 0.6,
      this.darkenColor(color, 0.2)
    );
    
    // Add claws
    const clawCount = 3;
    for (let i = 0; i < clawCount; i++) {
      const clawX = leg.foot.x + (i - 1) * 6;
      const clawAngle = Math.PI / 2 + (i - 1) * 0.2;
      this.renderClaw(ctx, clawX, leg.foot.y, 12, clawAngle);
    }
  }

  /**
   * Render dragon body
   */
  renderDragonBody(ctx, body, primaryColor, secondaryColor) {
    // Main body (muscular oval)
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y, body.width, body.height, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chest/underbelly (lighter)
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.ellipse(body.x, body.y + body.height * 0.2, body.width * 0.7, body.height * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Apply individual dragon scales
   */
  applyDragonScales(ctx, body, color) {
    const scaleSize = 6;
    const rows = Math.floor(body.height * 2 / (scaleSize * 1.5));
    const cols = Math.floor(body.width * 2 / (scaleSize * 1.5));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = (row % 2) * scaleSize * 0.75;
        const scaleX = body.x - body.width + col * scaleSize * 1.5 + offsetX;
        const scaleY = body.y - body.height + row * scaleSize * 1.5;
        
        // Check if scale is within body ellipse
        const dx = (scaleX - body.x) / body.width;
        const dy = (scaleY - body.y) / body.height;
        if (dx * dx + dy * dy < 1.0) {
          // Calculate normal for lighting
          const normal = {
            x: dx,
            y: dy,
            z: Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy))
          };
          
          this.renderScale(ctx, scaleX, scaleY, scaleSize, color, 0.7, normal);
        }
      }
    }
  }

  /**
   * Render dragon neck
   */
  renderDragonNeck(ctx, neck, color) {
    ctx.fillStyle = color;
    
    // Smooth S-curved neck
    const width = 25;
    ctx.beginPath();
    ctx.moveTo(neck.startX - width / 2, neck.startY);
    ctx.quadraticCurveTo(
      neck.startX - width / 3, neck.startY - 20,
      neck.endX - width / 3, neck.endY
    );
    ctx.lineTo(neck.endX + width / 3, neck.endY);
    ctx.quadraticCurveTo(
      neck.startX + width / 3, neck.startY - 20,
      neck.startX + width / 2, neck.startY
    );
    ctx.fill();
  }

  /**
   * Render dragon head
   */
  renderDragonHead(ctx, head, primaryColor, secondaryColor) {
    const headColor = this.darkenColor(primaryColor, 0.1);
    
    // Main head (oval)
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.ellipse(head.x, head.y, head.size, head.size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Snout
    ctx.fillStyle = this.darkenColor(primaryColor, 0.15);
    ctx.beginPath();
    ctx.ellipse(head.x, head.y + head.size * 0.3, head.size * 0.6, head.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Horns
    this.renderDragonHorns(ctx, head);
    
    // Eyes (professional quality)
    const eyeSize = head.size * 0.2;
    const eyeColor = '#FF6600';
    this.renderProfessionalEye(ctx, head.x - head.size * 0.3, head.y - head.size * 0.2, eyeSize, eyeColor, 'alert');
    this.renderProfessionalEye(ctx, head.x + head.size * 0.3, head.y - head.size * 0.2, eyeSize, eyeColor, 'alert');
    
    // Slit pupils for reptilian look
    ctx.fillStyle = '#000000';
    ctx.fillRect(head.x - head.size * 0.3 - 2, head.y - head.size * 0.3, 4, eyeSize * 0.8);
    ctx.fillRect(head.x + head.size * 0.3 - 2, head.y - head.size * 0.3, 4, eyeSize * 0.8);
  }

  /**
   * Render dragon horns
   */
  renderDragonHorns(ctx, head) {
    ctx.fillStyle = '#1A1A1A';
    
    // Left horn
    ctx.beginPath();
    ctx.moveTo(head.x - head.size * 0.6, head.y - head.size * 0.4);
    ctx.quadraticCurveTo(
      head.x - head.size * 0.8, head.y - head.size * 0.9,
      head.x - head.size * 0.7, head.y - head.size * 1.2
    );
    ctx.lineTo(head.x - head.size * 0.65, head.y - head.size * 1.15);
    ctx.quadraticCurveTo(
      head.x - head.size * 0.75, head.y - head.size * 0.85,
      head.x - head.size * 0.55, head.y - head.size * 0.38
    );
    ctx.fill();
    
    // Right horn
    ctx.beginPath();
    ctx.moveTo(head.x + head.size * 0.6, head.y - head.size * 0.4);
    ctx.quadraticCurveTo(
      head.x + head.size * 0.8, head.y - head.size * 0.9,
      head.x + head.size * 0.7, head.y - head.size * 1.2
    );
    ctx.lineTo(head.x + head.size * 0.65, head.y - head.size * 1.15);
    ctx.quadraticCurveTo(
      head.x + head.size * 0.75, head.y - head.size * 0.85,
      head.x + head.size * 0.55, head.y - head.size * 0.38
    );
    ctx.fill();
  }

  /**
   * Render dragon details (smoke, battle scars, etc.)
   */
  renderDragonDetails(ctx, anatomy, color) {
    // Nostril smoke (subtle)
    const head = anatomy.head;
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(
        head.x - 5 + Math.random() * 10,
        head.y + head.size * 0.4 - i * 5,
        3 + i * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

module.exports = DragonRenderer;
