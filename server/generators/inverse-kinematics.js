/**
 * Inverse Kinematics System
 * FABRIK (Forward And Backward Reaching Inverse Kinematics) algorithm
 * Procedural animation, ragdoll physics, natural motion
 */

class InverseKinematicsSystem {
  constructor() {
    this.tolerance = 0.01;
    this.maxIterations = 10;
  }

  /**
   * Create limb chain (arm, leg, tail, tentacle)
   */
  createChain(basePosition, segmentLengths, constraints = {}) {
    const joints = [];
    let currentPos = { ...basePosition };
    
    joints.push({
      pos: { ...currentPos },
      angle: 0,
      angleMin: constraints.angleMin || -Math.PI,
      angleMax: constraints.angleMax || Math.PI,
      fixed: true // Base is fixed
    });
    
    for (let i = 0; i < segmentLengths.length; i++) {
      currentPos = {
        x: currentPos.x + segmentLengths[i],
        y: currentPos.y,
        z: currentPos.z || 0
      };
      
      joints.push({
        pos: { ...currentPos },
        length: segmentLengths[i],
        angle: 0,
        angleMin: constraints.angleMin || -Math.PI,
        angleMax: constraints.angleMax || Math.PI,
        fixed: false
      });
    }
    
    return {
      joints,
      basePosition: { ...basePosition },
      totalLength: segmentLengths.reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Solve IK using FABRIK algorithm
   */
  solveIK(chain, targetPosition) {
    const { joints, basePosition, totalLength } = chain;
    
    // Check if target is reachable
    const dx = targetPosition.x - basePosition.x;
    const dy = targetPosition.y - basePosition.y;
    const dz = (targetPosition.z || 0) - (basePosition.z || 0);
    const distToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // If target is out of reach, extend fully towards it
    if (distToTarget > totalLength) {
      const direction = {
        x: dx / distToTarget,
        y: dy / distToTarget,
        z: dz / distToTarget
      };
      
      joints[0].pos = { ...basePosition };
      
      for (let i = 1; i < joints.length; i++) {
        const prevJoint = joints[i - 1];
        const length = joints[i].length;
        
        joints[i].pos = {
          x: prevJoint.pos.x + direction.x * length,
          y: prevJoint.pos.y + direction.y * length,
          z: prevJoint.pos.z + direction.z * length
        };
      }
      
      return joints;
    }
    
    // FABRIK iterations
    let iteration = 0;
    let endEffector = joints[joints.length - 1];
    
    while (iteration < this.maxIterations) {
      const dx = targetPosition.x - endEffector.pos.x;
      const dy = targetPosition.y - endEffector.pos.y;
      const dz = (targetPosition.z || 0) - (endEffector.pos.z || 0);
      const distToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distToTarget < this.tolerance) break;
      
      // BACKWARD REACH: Start from end effector, move towards target
      joints[joints.length - 1].pos = { ...targetPosition };
      
      for (let i = joints.length - 2; i >= 0; i--) {
        const currentJoint = joints[i];
        const nextJoint = joints[i + 1];
        const length = nextJoint.length;
        
        // Direction from next to current
        const dx = currentJoint.pos.x - nextJoint.pos.x;
        const dy = currentJoint.pos.y - nextJoint.pos.y;
        const dz = (currentJoint.pos.z || 0) - (nextJoint.pos.z || 0);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist > 0) {
          const ratio = length / dist;
          currentJoint.pos = {
            x: nextJoint.pos.x + dx * ratio,
            y: nextJoint.pos.y + dy * ratio,
            z: nextJoint.pos.z + dz * ratio
          };
        }
        
        // Apply angle constraints
        if (i > 0) {
          this.applyAngleConstraints(joints, i);
        }
      }
      
      // FORWARD REACH: Start from base, restore base position
      joints[0].pos = { ...basePosition };
      
      for (let i = 0; i < joints.length - 1; i++) {
        const currentJoint = joints[i];
        const nextJoint = joints[i + 1];
        const length = nextJoint.length;
        
        // Direction from current to next
        const dx = nextJoint.pos.x - currentJoint.pos.x;
        const dy = nextJoint.pos.y - currentJoint.pos.y;
        const dz = (nextJoint.pos.z || 0) - (currentJoint.pos.z || 0);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist > 0) {
          const ratio = length / dist;
          nextJoint.pos = {
            x: currentJoint.pos.x + dx * ratio,
            y: currentJoint.pos.y + dy * ratio,
            z: currentJoint.pos.z + dz * ratio
          };
        }
        
        // Apply angle constraints
        this.applyAngleConstraints(joints, i + 1);
      }
      
      endEffector = joints[joints.length - 1];
      iteration++;
    }
    
    // Calculate angles
    for (let i = 1; i < joints.length; i++) {
      const prevJoint = joints[i - 1];
      const currentJoint = joints[i];
      
      const dx = currentJoint.pos.x - prevJoint.pos.x;
      const dy = currentJoint.pos.y - prevJoint.pos.y;
      
      currentJoint.angle = Math.atan2(dy, dx);
    }
    
    return joints;
  }

  /**
   * Apply angle constraints to joint
   */
  applyAngleConstraints(joints, index) {
    if (index <= 0 || index >= joints.length) return;
    
    const joint = joints[index];
    const prevJoint = joints[index - 1];
    
    if (index >= 2) {
      // Calculate angle relative to parent bone
      const dx1 = prevJoint.pos.x - joints[index - 2].pos.x;
      const dy1 = prevJoint.pos.y - joints[index - 2].pos.y;
      const dx2 = joint.pos.x - prevJoint.pos.x;
      const dy2 = joint.pos.y - prevJoint.pos.y;
      
      const angle1 = Math.atan2(dy1, dx1);
      const angle2 = Math.atan2(dy2, dx2);
      let relativeAngle = angle2 - angle1;
      
      // Normalize angle to [-PI, PI]
      while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
      while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;
      
      // Clamp to constraints
      if (relativeAngle < joint.angleMin) {
        relativeAngle = joint.angleMin;
      } else if (relativeAngle > joint.angleMax) {
        relativeAngle = joint.angleMax;
      }
      
      // Reposition joint
      const finalAngle = angle1 + relativeAngle;
      const length = joint.length;
      
      joint.pos = {
        x: prevJoint.pos.x + Math.cos(finalAngle) * length,
        y: prevJoint.pos.y + Math.sin(finalAngle) * length,
        z: joint.pos.z
      };
    }
  }

  /**
   * Generate procedural walk cycle using IK
   */
  generateWalkCycle(character, frameCount = 8) {
    const frames = [];
    
    for (let frame = 0; frame < frameCount; frame++) {
      const phase = (frame / frameCount) * Math.PI * 2;
      
      // Calculate foot targets
      const leftFootTarget = {
        x: character.basePosition.x + Math.sin(phase) * 10,
        y: character.basePosition.y + 20 - Math.abs(Math.sin(phase)) * 5,
        z: 0
      };
      
      const rightFootTarget = {
        x: character.basePosition.x + Math.sin(phase + Math.PI) * 10,
        y: character.basePosition.y + 20 - Math.abs(Math.sin(phase + Math.PI)) * 5,
        z: 0
      };
      
      // Solve IK for legs
      const leftLeg = this.solveIK(character.leftLegChain, leftFootTarget);
      const rightLeg = this.solveIK(character.rightLegChain, rightFootTarget);
      
      // Calculate arm targets (opposite to legs)
      const leftArmTarget = {
        x: character.basePosition.x + Math.sin(phase + Math.PI) * 8,
        y: character.basePosition.y + 5,
        z: 0
      };
      
      const rightArmTarget = {
        x: character.basePosition.x + Math.sin(phase) * 8,
        y: character.basePosition.y + 5,
        z: 0
      };
      
      // Solve IK for arms
      const leftArm = this.solveIK(character.leftArmChain, leftArmTarget);
      const rightArm = this.solveIK(character.rightArmChain, rightArmTarget);
      
      // Body bob
      const bodyOffset = Math.sin(phase * 2) * 2;
      
      frames.push({
        leftLeg,
        rightLeg,
        leftArm,
        rightArm,
        bodyOffset
      });
    }
    
    return frames;
  }

  /**
   * Generate reach animation
   */
  generateReachAnimation(chain, targetPosition, frameCount = 20) {
    const frames = [];
    const startPosition = chain.joints[chain.joints.length - 1].pos;
    
    for (let frame = 0; frame < frameCount; frame++) {
      const t = frame / (frameCount - 1);
      // Ease in-out
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      const intermediateTarget = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * eased,
        y: startPosition.y + (targetPosition.y - startPosition.y) * eased,
        z: startPosition.z + (targetPosition.z - startPosition.z) * eased
      };
      
      const solvedChain = this.solveIK({ ...chain }, intermediateTarget);
      frames.push(solvedChain);
    }
    
    return frames;
  }

  /**
   * Create ragdoll physics setup
   */
  createRagdoll(bodyParts) {
    const ragdoll = {
      parts: [],
      constraints: []
    };
    
    // Each body part becomes a rigid body
    for (const part of bodyParts) {
      ragdoll.parts.push({
        name: part.name,
        pos: { ...part.position },
        velocity: { x: 0, y: 0, z: 0 },
        angularVelocity: 0,
        angle: 0,
        mass: part.mass || 1.0,
        width: part.width || 10,
        height: part.height || 10,
        restitution: 0.2, // Bounciness
        friction: 0.5
      });
    }
    
    // Create joint constraints
    for (const constraint of bodyParts.constraints || []) {
      ragdoll.constraints.push({
        part1: constraint.part1,
        part2: constraint.part2,
        anchor1: constraint.anchor1,
        anchor2: constraint.anchor2,
        angleMin: constraint.angleMin || -Math.PI,
        angleMax: constraint.angleMax || Math.PI,
        stiffness: constraint.stiffness || 0.9
      });
    }
    
    return ragdoll;
  }

  /**
   * Simulate ragdoll physics
   */
  simulateRagdoll(ragdoll, gravity = { x: 0, y: 9.8, z: 0 }, dt = 1/60) {
    const { parts, constraints } = ragdoll;
    
    // Update velocities and positions
    for (const part of parts) {
      // Apply gravity
      part.velocity.x += gravity.x * dt;
      part.velocity.y += gravity.y * dt;
      part.velocity.z += gravity.z * dt;
      
      // Update position
      part.pos.x += part.velocity.x * dt;
      part.pos.y += part.velocity.y * dt;
      part.pos.z += part.velocity.z * dt;
      
      // Update angle
      part.angle += part.angularVelocity * dt;
      
      // Ground collision
      const groundY = 100;
      if (part.pos.y + part.height / 2 > groundY) {
        part.pos.y = groundY - part.height / 2;
        part.velocity.y *= -part.restitution;
        part.velocity.x *= part.friction;
        part.angularVelocity *= part.friction;
      }
    }
    
    // Satisfy joint constraints
    for (let iter = 0; iter < 5; iter++) {
      for (const constraint of constraints) {
        const part1 = parts.find(p => p.name === constraint.part1);
        const part2 = parts.find(p => p.name === constraint.part2);
        
        if (!part1 || !part2) continue;
        
        // Calculate world positions of anchors
        const anchor1World = {
          x: part1.pos.x + constraint.anchor1.x,
          y: part1.pos.y + constraint.anchor1.y,
          z: part1.pos.z + (constraint.anchor1.z || 0)
        };
        
        const anchor2World = {
          x: part2.pos.x + constraint.anchor2.x,
          y: part2.pos.y + constraint.anchor2.y,
          z: part2.pos.z + (constraint.anchor2.z || 0)
        };
        
        // Calculate distance
        const dx = anchor2World.x - anchor1World.x;
        const dy = anchor2World.y - anchor1World.y;
        const dz = anchor2World.z - anchor1World.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist > 0) {
          // Pull parts together
          const correction = dist * constraint.stiffness * 0.5;
          const offsetX = (dx / dist) * correction;
          const offsetY = (dy / dist) * correction;
          const offsetZ = (dz / dist) * correction;
          
          part1.pos.x += offsetX / part1.mass;
          part1.pos.y += offsetY / part1.mass;
          part1.pos.z += offsetZ / part1.mass;
          
          part2.pos.x -= offsetX / part2.mass;
          part2.pos.y -= offsetY / part2.mass;
          part2.pos.z -= offsetZ / part2.mass;
        }
        
        // Angle constraints
        const angle = Math.atan2(
          part2.pos.y - part1.pos.y,
          part2.pos.x - part1.pos.x
        );
        
        let relativeAngle = angle - part1.angle;
        while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
        while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;
        
        if (relativeAngle < constraint.angleMin) {
          const correction = (relativeAngle - constraint.angleMin) * 0.5;
          part1.angle += correction;
          part2.angle -= correction;
        } else if (relativeAngle > constraint.angleMax) {
          const correction = (relativeAngle - constraint.angleMax) * 0.5;
          part1.angle += correction;
          part2.angle -= correction;
        }
      }
    }
  }

  /**
   * Generate procedural tentacle motion
   */
  generateTentacleMotion(chain, time, frequency = 1.0, amplitude = 10) {
    const joints = JSON.parse(JSON.stringify(chain.joints)); // Deep copy
    
    for (let i = 1; i < joints.length; i++) {
      const phase = time * frequency + (i / joints.length) * Math.PI * 2;
      const offset = Math.sin(phase) * amplitude * (i / joints.length);
      
      // Add wave motion
      joints[i].pos.x += Math.cos(phase) * offset;
      joints[i].pos.y += Math.sin(phase) * offset * 0.5;
    }
    
    return joints;
  }
}

module.exports = InverseKinematicsSystem;
