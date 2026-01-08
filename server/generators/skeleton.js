const MathUtils = require('../utils/math');

/**
 * Skeleton System
 * Creates and manages bone structures for sprites
 */
class Skeleton {
  constructor(type = 'biped') {
    this.type = type;
    this.bones = [];
    this.rootBone = null;
    
    this.initializeSkeleton(type);
  }

  /**
   * Initialize skeleton based on type
   */
  initializeSkeleton(type) {
    switch (type) {
      case 'biped':
        this.createBipedSkeleton();
        break;
      case 'quadruped':
        this.createQuadrupedSkeleton();
        break;
      case 'flying':
        this.createFlyingSkeleton();
        break;
      case 'serpentine':
        this.createSerpentineSkeleton();
        break;
      default:
        this.createBipedSkeleton();
    }
  }

  /**
   * Create a bone
   */
  createBone(name, x, y, length, angle, parent = null) {
    const bone = {
      name,
      x,
      y,
      length,
      angle,
      parent,
      children: [],
      // End position (calculated)
      endX: x + Math.cos(angle) * length,
      endY: y + Math.sin(angle) * length
    };
    
    if (parent) {
      parent.children.push(bone);
    } else {
      this.rootBone = bone;
    }
    
    this.bones.push(bone);
    return bone;
  }

  /**
   * Create biped skeleton (humanoid)
   */
  createBipedSkeleton() {
    // Root/hip
    const hip = this.createBone('hip', 0, 0, 10, 0);
    
    // Torso/spine
    const spine = this.createBone('spine', 0, 0, 20, -Math.PI / 2, hip);
    
    // Head
    const neck = this.createBone('neck', spine.endX, spine.endY, 5, -Math.PI / 2, spine);
    const head = this.createBone('head', neck.endX, neck.endY, 10, -Math.PI / 2, neck);
    
    // Left arm
    const leftShoulder = this.createBone('leftShoulder', spine.endX - 5, spine.endY, 8, Math.PI / 4, spine);
    const leftArm = this.createBone('leftArm', leftShoulder.endX, leftShoulder.endY, 12, Math.PI / 4, leftShoulder);
    
    // Right arm
    const rightShoulder = this.createBone('rightShoulder', spine.endX + 5, spine.endY, 8, -Math.PI / 4, spine);
    const rightArm = this.createBone('rightArm', rightShoulder.endX, rightShoulder.endY, 12, -Math.PI / 4, rightShoulder);
    
    // Left leg
    const leftThigh = this.createBone('leftThigh', hip.x - 3, hip.y, 15, Math.PI / 2, hip);
    const leftShin = this.createBone('leftShin', leftThigh.endX, leftThigh.endY, 15, Math.PI / 2, leftThigh);
    
    // Right leg
    const rightThigh = this.createBone('rightThigh', hip.x + 3, hip.y, 15, Math.PI / 2, hip);
    const rightShin = this.createBone('rightShin', rightThigh.endX, rightThigh.endY, 15, Math.PI / 2, rightThigh);
  }

  /**
   * Create quadruped skeleton (animals)
   */
  createQuadrupedSkeleton() {
    // Root/torso
    const torso = this.createBone('torso', 0, 0, 30, 0);
    
    // Neck and head
    const neck = this.createBone('neck', torso.endX, torso.endY, 10, -Math.PI / 4, torso);
    const head = this.createBone('head', neck.endX, neck.endY, 12, -Math.PI / 6, neck);
    
    // Front left leg
    const frontLeftShoulder = this.createBone('frontLeftShoulder', torso.endX - 5, torso.endY, 8, Math.PI / 2, torso);
    const frontLeftLeg = this.createBone('frontLeftLeg', frontLeftShoulder.endX, frontLeftShoulder.endY, 15, Math.PI / 2, frontLeftShoulder);
    
    // Front right leg
    const frontRightShoulder = this.createBone('frontRightShoulder', torso.endX + 5, torso.endY, 8, Math.PI / 2, torso);
    const frontRightLeg = this.createBone('frontRightLeg', frontRightShoulder.endX, frontRightShoulder.endY, 15, Math.PI / 2, frontRightShoulder);
    
    // Back left leg
    const backLeftThigh = this.createBone('backLeftThigh', torso.x - 5, torso.y, 12, Math.PI / 2, torso);
    const backLeftShin = this.createBone('backLeftShin', backLeftThigh.endX, backLeftThigh.endY, 15, Math.PI / 2, backLeftThigh);
    
    // Back right leg
    const backRightThigh = this.createBone('backRightThigh', torso.x + 5, torso.y, 12, Math.PI / 2, torso);
    const backRightShin = this.createBone('backRightShin', backRightThigh.endX, backRightThigh.endY, 15, Math.PI / 2, backRightThigh);
    
    // Tail
    const tail = this.createBone('tail', torso.x, torso.y, 20, Math.PI, torso);
  }

  /**
   * Create flying skeleton (winged creatures)
   */
  createFlyingSkeleton() {
    // Start with biped base
    this.createBipedSkeleton();
    
    // Find spine to attach wings
    const spine = this.bones.find(b => b.name === 'spine');
    
    if (spine) {
      // Left wing
      const leftWingBase = this.createBone('leftWingBase', spine.endX - 8, spine.endY, 15, Math.PI * 0.75, spine);
      const leftWingMid = this.createBone('leftWingMid', leftWingBase.endX, leftWingBase.endY, 18, Math.PI * 0.8, leftWingBase);
      const leftWingTip = this.createBone('leftWingTip', leftWingMid.endX, leftWingMid.endY, 12, Math.PI * 0.85, leftWingMid);
      
      // Right wing
      const rightWingBase = this.createBone('rightWingBase', spine.endX + 8, spine.endY, 15, Math.PI * 0.25, spine);
      const rightWingMid = this.createBone('rightWingMid', rightWingBase.endX, rightWingBase.endY, 18, Math.PI * 0.2, rightWingBase);
      const rightWingTip = this.createBone('rightWingTip', rightWingMid.endX, rightWingMid.endY, 12, Math.PI * 0.15, rightWingMid);
    }
  }

  /**
   * Create serpentine skeleton (snake-like)
   */
  createSerpentineSkeleton() {
    const segments = 10;
    const segmentLength = 8;
    
    let prevBone = null;
    
    for (let i = 0; i < segments; i++) {
      const x = prevBone ? prevBone.endX : 0;
      const y = prevBone ? prevBone.endY : 0;
      const angle = 0;
      
      prevBone = this.createBone(`segment${i}`, x, y, segmentLength, angle, prevBone);
    }
    
    // Head at the end
    const head = this.createBone('head', prevBone.endX, prevBone.endY, 10, 0, prevBone);
  }

  /**
   * Update bone positions recursively
   */
  updateBone(bone) {
    if (bone.parent) {
      bone.x = bone.parent.endX;
      bone.y = bone.parent.endY;
    }
    
    bone.endX = bone.x + Math.cos(bone.angle) * bone.length;
    bone.endY = bone.y + Math.sin(bone.angle) * bone.length;
    
    bone.children.forEach(child => this.updateBone(child));
  }

  /**
   * Update entire skeleton
   */
  update() {
    if (this.rootBone) {
      this.updateBone(this.rootBone);
    }
  }

  /**
   * Get bone by name
   */
  getBone(name) {
    return this.bones.find(b => b.name === name);
  }

  /**
   * Scale skeleton
   */
  scale(factor) {
    this.bones.forEach(bone => {
      bone.length *= factor;
      bone.x *= factor;
      bone.y *= factor;
    });
    this.update();
  }

  /**
   * Translate skeleton
   */
  translate(dx, dy) {
    if (this.rootBone) {
      this.rootBone.x += dx;
      this.rootBone.y += dy;
      this.update();
    }
  }
}

module.exports = Skeleton;
