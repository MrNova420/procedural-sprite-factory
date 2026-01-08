/**
 * Animation Engine
 * Generates sprite animations including walk cycles, actions, and custom keyframe animations
 */

class AnimationEngine {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
  }

  /**
   * Generate walk cycle animation
   */
  generateWalkCycle(dna, options = {}) {
    const {
      frameCount = 8,
      speed = 1.0,
      bodyType = dna.bodyType || 'biped'
    } = options;

    const frames = [];
    const baseHeight = dna.proportions?.height || 1.0;
    
    for (let i = 0; i < frameCount; i++) {
      const phase = (i / frameCount) * Math.PI * 2;
      
      // Body bob
      const bobAmount = Math.sin(phase) * 2 * speed;
      
      // Limb movement based on body type
      let limbRotations = {};
      
      switch (bodyType) {
        case 'biped':
          limbRotations = {
            leftLeg: Math.sin(phase) * 30 * speed,
            rightLeg: Math.sin(phase + Math.PI) * 30 * speed,
            leftArm: Math.sin(phase + Math.PI) * 20 * speed,
            rightArm: Math.sin(phase) * 20 * speed
          };
          break;
          
        case 'quadruped':
          limbRotations = {
            frontLeftLeg: Math.sin(phase) * 25 * speed,
            frontRightLeg: Math.sin(phase + Math.PI) * 25 * speed,
            backLeftLeg: Math.sin(phase + Math.PI) * 25 * speed,
            backRightLeg: Math.sin(phase) * 25 * speed
          };
          break;
          
        case 'flying':
          limbRotations = {
            leftWing: Math.sin(phase) * 45 * speed,
            rightWing: Math.sin(phase + Math.PI) * 45 * speed
          };
          break;
          
        case 'serpentine':
          limbRotations = {
            bodySegments: Array.from({ length: 5 }, (_, j) => 
              Math.sin(phase + j * 0.5) * 15 * speed
            )
          };
          break;
      }
      
      frames.push({
        frameIndex: i,
        bodyOffset: { x: 0, y: bobAmount },
        limbRotations,
        timestamp: i / frameCount
      });
    }
    
    return {
      type: 'walk',
      frameCount,
      frames,
      fps: 12,
      loop: true
    };
  }

  /**
   * Generate action animation
   */
  generateActionAnimation(dna, actionType, options = {}) {
    const {
      frameCount = 6,
      weaponType = 'sword'
    } = options;

    const frames = [];
    
    switch (actionType) {
      case 'attack':
        for (let i = 0; i < frameCount; i++) {
          const progress = i / (frameCount - 1);
          const attackPhase = this.easeInOutCubic(progress);
          
          frames.push({
            frameIndex: i,
            weaponRotation: attackPhase * 120 - 30,
            armRotation: attackPhase * 90,
            bodyLean: attackPhase * 10,
            timestamp: progress
          });
        }
        break;
        
      case 'hurt':
        for (let i = 0; i < frameCount; i++) {
          const progress = i / (frameCount - 1);
          frames.push({
            frameIndex: i,
            bodyOffset: { x: Math.sin(progress * Math.PI) * 5, y: 0 },
            flash: i % 2 === 0,
            timestamp: progress
          });
        }
        break;
        
      case 'death':
        for (let i = 0; i < frameCount; i++) {
          const progress = i / (frameCount - 1);
          const fallProgress = this.easeInQuad(progress);
          
          frames.push({
            frameIndex: i,
            rotation: fallProgress * 90,
            opacity: 1 - (fallProgress * 0.5),
            bodyOffset: { x: 0, y: fallProgress * 20 },
            timestamp: progress
          });
        }
        break;
        
      case 'idle':
        for (let i = 0; i < frameCount; i++) {
          const phase = (i / frameCount) * Math.PI * 2;
          frames.push({
            frameIndex: i,
            bodyOffset: { x: 0, y: Math.sin(phase) * 1 },
            breathe: Math.sin(phase) * 0.05,
            timestamp: i / frameCount
          });
        }
        break;
        
      case 'jump':
        for (let i = 0; i < frameCount; i++) {
          const progress = i / (frameCount - 1);
          const jumpHeight = Math.sin(progress * Math.PI) * 30;
          
          frames.push({
            frameIndex: i,
            bodyOffset: { x: 0, y: -jumpHeight },
            legBend: progress < 0.5 ? progress * 40 : (1 - progress) * 40,
            timestamp: progress
          });
        }
        break;
        
      case 'cast':
        for (let i = 0; i < frameCount; i++) {
          const progress = i / (frameCount - 1);
          const castPhase = this.easeInOutQuad(progress);
          
          frames.push({
            frameIndex: i,
            armRaise: castPhase * 90,
            glowIntensity: castPhase,
            particleEmission: progress > 0.7,
            timestamp: progress
          });
        }
        break;
    }
    
    return {
      type: actionType,
      frameCount,
      frames,
      fps: actionType === 'idle' ? 8 : 12,
      loop: actionType === 'idle'
    };
  }

  /**
   * Generate custom keyframe animation
   */
  generateCustomAnimation(dna, keyframes, options = {}) {
    const {
      totalFrames = 30,
      easing = 'linear'
    } = options;

    const frames = [];
    const easingFunc = this.getEasingFunction(easing);
    
    for (let i = 0; i < totalFrames; i++) {
      const progress = i / (totalFrames - 1);
      const frame = this.interpolateKeyframes(keyframes, progress, easingFunc);
      
      frames.push({
        frameIndex: i,
        ...frame,
        timestamp: progress
      });
    }
    
    return {
      type: 'custom',
      frameCount: totalFrames,
      frames,
      fps: options.fps || 12,
      loop: options.loop || false
    };
  }

  /**
   * Interpolate between keyframes
   */
  interpolateKeyframes(keyframes, progress, easingFunc) {
    // Find surrounding keyframes
    let beforeKey = keyframes[0];
    let afterKey = keyframes[keyframes.length - 1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (keyframes[i].time <= progress && keyframes[i + 1].time >= progress) {
        beforeKey = keyframes[i];
        afterKey = keyframes[i + 1];
        break;
      }
    }
    
    // Calculate local progress between keyframes
    const localProgress = (progress - beforeKey.time) / (afterKey.time - beforeKey.time);
    const easedProgress = easingFunc(localProgress);
    
    // Interpolate properties
    const result = {};
    const allKeys = new Set([...Object.keys(beforeKey), ...Object.keys(afterKey)]);
    
    for (const key of allKeys) {
      if (key === 'time') continue;
      
      const before = beforeKey[key] || 0;
      const after = afterKey[key] || 0;
      
      if (typeof before === 'number' && typeof after === 'number') {
        result[key] = before + (after - before) * easedProgress;
      }
    }
    
    return result;
  }

  /**
   * Export animation as sprite sheet
   */
  exportSpriteSheet(animation, dna, options = {}) {
    const {
      layout = 'horizontal', // horizontal, vertical, grid
      frameSize = 64,
      padding = 2
    } = options;

    const frameCount = animation.frameCount;
    let width, height, cols, rows;
    
    switch (layout) {
      case 'horizontal':
        cols = frameCount;
        rows = 1;
        width = frameSize * cols + padding * (cols + 1);
        height = frameSize + padding * 2;
        break;
        
      case 'vertical':
        cols = 1;
        rows = frameCount;
        width = frameSize + padding * 2;
        height = frameSize * rows + padding * (rows + 1);
        break;
        
      case 'grid':
        cols = Math.ceil(Math.sqrt(frameCount));
        rows = Math.ceil(frameCount / cols);
        width = frameSize * cols + padding * (cols + 1);
        height = frameSize * rows + padding * (rows + 1);
        break;
    }
    
    return {
      width,
      height,
      frameSize,
      padding,
      layout,
      cols,
      rows,
      frameCount,
      metadata: {
        animation: animation.type,
        fps: animation.fps,
        loop: animation.loop,
        frames: animation.frames.map(f => ({
          index: f.frameIndex,
          timestamp: f.timestamp
        }))
      }
    };
  }

  // Easing functions
  easeLinear(t) { return t; }
  easeInQuad(t) { return t * t; }
  easeOutQuad(t) { return t * (2 - t); }
  easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  easeInCubic(t) { return t * t * t; }
  easeOutCubic(t) { return (--t) * t * t + 1; }
  easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
  
  getEasingFunction(name) {
    const easings = {
      'linear': this.easeLinear,
      'easeIn': this.easeInQuad,
      'easeOut': this.easeOutQuad,
      'easeInOut': this.easeInOutQuad,
      'easeInCubic': this.easeInCubic,
      'easeOutCubic': this.easeOutCubic,
      'easeInOutCubic': this.easeInOutCubic
    };
    
    return easings[name] || this.easeLinear;
  }
}

module.exports = AnimationEngine;
