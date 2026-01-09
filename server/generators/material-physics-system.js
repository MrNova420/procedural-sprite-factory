/**
 * Material Physics System
 * Simulates physical behavior of materials: cloth, fluids, soft bodies, deformation
 */

class MaterialPhysicsSystem {
  constructor() {
    this.gravity = { x: 0, y: 9.8, z: 0 };
    this.timestep = 1 / 60;
  }

  /**
   * Create cloth simulation
   */
  createCloth(width, height, segmentsX = 10, segmentsY = 10) {
    const particles = [];
    const constraints = [];
    
    const dx = width / segmentsX;
    const dy = height / segmentsY;
    
    // Create particle grid
    for (let y = 0; y <= segmentsY; y++) {
      for (let x = 0; x <= segmentsX; x++) {
        particles.push({
          pos: { x: x * dx, y: y * dy, z: 0 },
          prevPos: { x: x * dx, y: y * dy, z: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          mass: 1.0,
          pinned: y === 0, // Pin top row
          damping: 0.99
        });
      }
    }
    
    // Create constraints (springs)
    const getIndex = (x, y) => y * (segmentsX + 1) + x;
    
    for (let y = 0; y <= segmentsY; y++) {
      for (let x = 0; x <= segmentsX; x++) {
        const idx = getIndex(x, y);
        
        // Structural constraints (horizontal and vertical)
        if (x < segmentsX) {
          constraints.push({
            p1: idx,
            p2: idx + 1,
            restLength: dx,
            stiffness: 0.9
          });
        }
        if (y < segmentsY) {
          constraints.push({
            p1: idx,
            p2: idx + (segmentsX + 1),
            restLength: dy,
            stiffness: 0.9
          });
        }
        
        // Shear constraints (diagonal)
        if (x < segmentsX && y < segmentsY) {
          const diag = Math.sqrt(dx * dx + dy * dy);
          constraints.push({
            p1: idx,
            p2: idx + (segmentsX + 1) + 1,
            restLength: diag,
            stiffness: 0.8
          });
          constraints.push({
            p1: idx + 1,
            p2: idx + (segmentsX + 1),
            restLength: diag,
            stiffness: 0.8
          });
        }
        
        // Bending constraints (skip one)
        if (x < segmentsX - 1) {
          constraints.push({
            p1: idx,
            p2: idx + 2,
            restLength: dx * 2,
            stiffness: 0.5
          });
        }
        if (y < segmentsY - 1) {
          constraints.push({
            p1: idx,
            p2: idx + (segmentsX + 1) * 2,
            restLength: dy * 2,
            stiffness: 0.5
          });
        }
      }
    }
    
    return {
      type: 'cloth',
      particles,
      constraints,
      segmentsX,
      segmentsY,
      width,
      height
    };
  }

  /**
   * Simulate cloth physics
   */
  simulateCloth(cloth, iterations = 5, wind = { x: 0, y: 0, z: 0 }) {
    const { particles, constraints } = cloth;
    
    // Verlet integration
    for (const particle of particles) {
      if (particle.pinned) continue;
      
      // Store current position
      const tempX = particle.pos.x;
      const tempY = particle.pos.y;
      const tempZ = particle.pos.z;
      
      // Velocity (from previous position)
      const vx = particle.pos.x - particle.prevPos.x;
      const vy = particle.pos.y - particle.prevPos.y;
      const vz = particle.pos.z - particle.prevPos.z;
      
      // Update position with velocity and forces
      particle.pos.x += vx * particle.damping + (this.gravity.x + wind.x) * this.timestep * this.timestep;
      particle.pos.y += vy * particle.damping + (this.gravity.y + wind.y) * this.timestep * this.timestep;
      particle.pos.z += vz * particle.damping + (this.gravity.z + wind.z) * this.timestep * this.timestep;
      
      // Store previous position
      particle.prevPos.x = tempX;
      particle.prevPos.y = tempY;
      particle.prevPos.z = tempZ;
    }
    
    // Constraint satisfaction
    for (let iter = 0; iter < iterations; iter++) {
      for (const constraint of constraints) {
        const p1 = particles[constraint.p1];
        const p2 = particles[constraint.p2];
        
        if (p1.pinned && p2.pinned) continue;
        
        // Calculate distance
        const dx = p2.pos.x - p1.pos.x;
        const dy = p2.pos.y - p1.pos.y;
        const dz = p2.pos.z - p1.pos.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist === 0) continue;
        
        // Calculate correction
        const diff = (dist - constraint.restLength) / dist;
        const correction = diff * constraint.stiffness * 0.5;
        
        const offsetX = dx * correction;
        const offsetY = dy * correction;
        const offsetZ = dz * correction;
        
        // Apply correction
        if (!p1.pinned) {
          p1.pos.x += offsetX;
          p1.pos.y += offsetY;
          p1.pos.z += offsetZ;
        }
        if (!p2.pinned) {
          p2.pos.x -= offsetX;
          p2.pos.y -= offsetY;
          p2.pos.z -= offsetZ;
        }
      }
    }
  }

  /**
   * Create fluid simulation (SPH - Smoothed Particle Hydrodynamics)
   */
  createFluid(particleCount, bounds) {
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        pos: {
          x: bounds.x + Math.random() * bounds.width,
          y: bounds.y + Math.random() * bounds.height,
          z: 0
        },
        velocity: { x: 0, y: 0, z: 0 },
        density: 0,
        pressure: 0,
        mass: 1.0
      });
    }
    
    return {
      type: 'fluid',
      particles,
      bounds,
      smoothingRadius: 10,
      restDensity: 1000,
      stiffness: 1000,
      viscosity: 0.01
    };
  }

  /**
   * Simulate fluid physics (SPH)
   */
  simulateFluid(fluid) {
    const { particles, smoothingRadius, restDensity, stiffness, viscosity, bounds } = fluid;
    
    // Calculate densities and pressures
    for (const pi of particles) {
      pi.density = 0;
      
      for (const pj of particles) {
        const dx = pj.pos.x - pi.pos.x;
        const dy = pj.pos.y - pi.pos.y;
        const dz = pj.pos.z - pi.pos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < smoothingRadius * smoothingRadius) {
          const dist = Math.sqrt(distSq);
          // Poly6 kernel
          const h = smoothingRadius;
          const factor = (h * h - dist * dist);
          pi.density += pj.mass * (315 / (64 * Math.PI * Math.pow(h, 9))) * factor * factor * factor;
        }
      }
      
      // Calculate pressure
      pi.pressure = stiffness * (pi.density - restDensity);
    }
    
    // Calculate forces
    for (const pi of particles) {
      let fx = 0, fy = 0, fz = 0;
      
      for (const pj of particles) {
        if (pi === pj) continue;
        
        const dx = pj.pos.x - pi.pos.x;
        const dy = pj.pos.y - pi.pos.y;
        const dz = pj.pos.z - pi.pos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < smoothingRadius * smoothingRadius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          
          // Pressure force (Spiky kernel gradient)
          const h = smoothingRadius;
          const factor = (h - dist) * (h - dist);
          const pressureForce = -pj.mass * (pi.pressure + pj.pressure) / (2 * pj.density) * 
                               (-45 / (Math.PI * Math.pow(h, 6))) * factor / dist;
          
          fx += pressureForce * dx;
          fy += pressureForce * dy;
          fz += pressureForce * dz;
          
          // Viscosity force
          const viscosityForce = viscosity * pj.mass * 
                                (45 / (Math.PI * Math.pow(h, 6))) * (h - dist);
          
          fx += viscosityForce * (pj.velocity.x - pi.velocity.x);
          fy += viscosityForce * (pj.velocity.y - pi.velocity.y);
          fz += viscosityForce * (pj.velocity.z - pi.velocity.z);
        }
      }
      
      // Gravity
      fy += this.gravity.y * pi.mass;
      
      // Update velocity
      pi.velocity.x += fx / pi.density * this.timestep;
      pi.velocity.y += fy / pi.density * this.timestep;
      pi.velocity.z += fz / pi.density * this.timestep;
      
      // Update position
      pi.pos.x += pi.velocity.x * this.timestep;
      pi.pos.y += pi.velocity.y * this.timestep;
      pi.pos.z += pi.velocity.z * this.timestep;
      
      // Boundary conditions
      if (pi.pos.x < bounds.x) {
        pi.pos.x = bounds.x;
        pi.velocity.x *= -0.5;
      }
      if (pi.pos.x > bounds.x + bounds.width) {
        pi.pos.x = bounds.x + bounds.width;
        pi.velocity.x *= -0.5;
      }
      if (pi.pos.y < bounds.y) {
        pi.pos.y = bounds.y;
        pi.velocity.y *= -0.5;
      }
      if (pi.pos.y > bounds.y + bounds.height) {
        pi.pos.y = bounds.y + bounds.height;
        pi.velocity.y *= -0.5;
      }
    }
  }

  /**
   * Create soft body (mass-spring system)
   */
  createSoftBody(shape, segments = 10) {
    const particles = [];
    const constraints = [];
    
    if (shape === 'sphere') {
      // Create icosphere
      const t = (1 + Math.sqrt(5)) / 2;
      const vertices = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
      ];
      
      for (const v of vertices) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        particles.push({
          pos: { x: v[0] / len * 10, y: v[1] / len * 10, z: v[2] / len * 10 },
          prevPos: { x: v[0] / len * 10, y: v[1] / len * 10, z: v[2] / len * 10 },
          velocity: { x: 0, y: 0, z: 0 },
          mass: 1.0
        });
      }
      
      // Create constraints (icosphere edges)
      const edges = [
        [0, 11], [0, 5], [0, 1], [1, 5], [1, 9], [5, 9],
        [11, 5], [9, 4], [4, 5], [9, 3], [3, 4], [3, 8],
        [8, 9], [8, 1], [8, 7], [7, 1], [7, 0], [0, 10],
        [10, 11], [10, 7], [2, 11], [2, 10], [2, 6], [6, 10],
        [6, 7], [6, 3], [2, 3], [2, 4], [4, 11]
      ];
      
      for (const edge of edges) {
        const p1 = particles[edge[0]];
        const p2 = particles[edge[1]];
        const dx = p2.pos.x - p1.pos.x;
        const dy = p2.pos.y - p1.pos.y;
        const dz = p2.pos.z - p1.pos.z;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        constraints.push({
          p1: edge[0],
          p2: edge[1],
          restLength: len,
          stiffness: 0.9
        });
      }
    }
    
    return {
      type: 'softBody',
      particles,
      constraints,
      pressure: 0, // Internal pressure for volume preservation
      volume: 0
    };
  }

  /**
   * Simulate soft body deformation
   */
  simulateSoftBody(softBody, forces = []) {
    // Similar to cloth simulation but with volume preservation
    const { particles, constraints } = softBody;
    
    // Apply forces
    for (const particle of particles) {
      const tempX = particle.pos.x;
      const tempY = particle.pos.y;
      const tempZ = particle.pos.z;
      
      const vx = particle.pos.x - particle.prevPos.x;
      const vy = particle.pos.y - particle.prevPos.y;
      const vz = particle.pos.z - particle.prevPos.z;
      
      let fx = this.gravity.x;
      let fy = this.gravity.y;
      let fz = this.gravity.z;
      
      // Apply external forces
      for (const force of forces) {
        fx += force.x;
        fy += force.y;
        fz += force.z;
      }
      
      particle.pos.x += vx * 0.99 + fx * this.timestep * this.timestep;
      particle.pos.y += vy * 0.99 + fy * this.timestep * this.timestep;
      particle.pos.z += vz * 0.99 + fz * this.timestep * this.timestep;
      
      particle.prevPos.x = tempX;
      particle.prevPos.y = tempY;
      particle.prevPos.z = tempZ;
    }
    
    // Satisfy constraints
    for (let iter = 0; iter < 5; iter++) {
      for (const constraint of constraints) {
        const p1 = particles[constraint.p1];
        const p2 = particles[constraint.p2];
        
        const dx = p2.pos.x - p1.pos.x;
        const dy = p2.pos.y - p1.pos.y;
        const dz = p2.pos.z - p1.pos.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist === 0) continue;
        
        const diff = (dist - constraint.restLength) / dist;
        const correction = diff * constraint.stiffness * 0.5;
        
        const offsetX = dx * correction;
        const offsetY = dy * correction;
        const offsetZ = dz * correction;
        
        p1.pos.x += offsetX;
        p1.pos.y += offsetY;
        p1.pos.z += offsetZ;
        p2.pos.x -= offsetX;
        p2.pos.y -= offsetY;
        p2.pos.z -= offsetZ;
      }
    }
  }
}

module.exports = MaterialPhysicsSystem;
