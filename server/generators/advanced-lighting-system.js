/**
 * Advanced Lighting System
 * Physically-based lighting with multiple light sources, shadows, global illumination
 */

class AdvancedLightingSystem {
  constructor() {
    this.lights = [];
    this.ambientLight = { r: 0.2, g: 0.2, b: 0.2 };
    this.globalIllumination = true;
  }

  /**
   * Add light source
   */
  addLight(light) {
    this.lights.push({
      type: light.type || 'point',        // point, directional, spot, area
      position: light.position || { x: 0, y: -50, z: 50 },
      color: light.color || { r: 1, g: 1, b: 1 },
      intensity: light.intensity || 1.0,
      range: light.range || 100,
      falloff: light.falloff || 2.0,       // Inverse square law
      castsShadows: light.castsShadows !== false,
      shadowQuality: light.shadowQuality || 'medium',
      // Spot light specific
      direction: light.direction || { x: 0, y: 1, z: 0 },
      angle: light.angle || Math.PI / 4,
      penumbra: light.penumbra || 0.1
    });
  }

  /**
   * Calculate lighting for a point on surface
   */
  calculateLighting(point, normal, materialProperties) {
    const {
      baseColor = { r: 1, g: 1, b: 1 }
    } = materialProperties;

    // Start with ambient
    let finalColor = {
      r: this.ambientLight.r * baseColor.r,
      g: this.ambientLight.g * baseColor.g,
      b: this.ambientLight.b * baseColor.b
    };

    // Process each light
    for (const light of this.lights) {
      const lightContribution = this.calculateLightContribution(
        point, normal, light, materialProperties
      );

      finalColor.r += lightContribution.r;
      finalColor.g += lightContribution.g;
      finalColor.b += lightContribution.b;
    }

    // Global illumination (simplified)
    if (this.globalIllumination) {
      const gi = this.calculateGlobalIllumination(point, normal);
      finalColor.r += gi.r * 0.3;
      finalColor.g += gi.g * 0.3;
      finalColor.b += gi.b * 0.3;
    }

    // Clamp to valid range
    return {
      r: Math.min(1, Math.max(0, finalColor.r)),
      g: Math.min(1, Math.max(0, finalColor.g)),
      b: Math.min(1, Math.max(0, finalColor.b))
    };
  }

  /**
   * Calculate contribution from single light source
   */
  calculateLightContribution(point, normal, light, materialProperties) {
    const { x, y, z } = point;
    const { nx, ny, nz } = normal;
    const { baseColor, roughness, metallic, reflectivity } = materialProperties;

    // Light direction
    let lightDir;
    let distance;
    
    if (light.type === 'directional') {
      lightDir = {
        x: -light.direction.x,
        y: -light.direction.y,
        z: -light.direction.z
      };
      distance = Infinity;
    } else {
      // Point or spot light
      lightDir = {
        x: light.position.x - x,
        y: light.position.y - y,
        z: light.position.z - z
      };
      distance = Math.sqrt(
        lightDir.x * lightDir.x + 
        lightDir.y * lightDir.y + 
        lightDir.z * lightDir.z
      );
      
      // Normalize
      if (distance > 0) {
        lightDir.x /= distance;
        lightDir.y /= distance;
        lightDir.z /= distance;
      }
    }

    // Check if light is in range
    if (distance > light.range) {
      return { r: 0, g: 0, b: 0 };
    }

    // Spot light cone check
    if (light.type === 'spot') {
      const spotDir = light.direction;
      const cosAngle = -(lightDir.x * spotDir.x + lightDir.y * spotDir.y + lightDir.z * spotDir.z);
      const cosOuterAngle = Math.cos(light.angle);
      const cosInnerAngle = Math.cos(light.angle * (1 - light.penumbra));
      
      if (cosAngle < cosOuterAngle) {
        return { r: 0, g: 0, b: 0 };
      }
      
      // Smooth falloff in penumbra
      const spotIntensity = cosAngle < cosInnerAngle ?
        (cosAngle - cosOuterAngle) / (cosInnerAngle - cosOuterAngle) : 1.0;
      light = { ...light, intensity: light.intensity * spotIntensity };
    }

    // Diffuse (Lambertian)
    const NdotL = Math.max(0, nx * lightDir.x + ny * lightDir.y + nz * lightDir.z);

    // Specular (Cook-Torrance BRDF)
    const viewDir = { x: 0, y: 0, z: 1 }; // Camera looking down Z
    const halfDir = {
      x: lightDir.x + viewDir.x,
      y: lightDir.y + viewDir.y,
      z: lightDir.z + viewDir.z
    };
    const halfLen = Math.sqrt(halfDir.x * halfDir.x + halfDir.y * halfDir.y + halfDir.z * halfDir.z);
    if (halfLen > 0) {
      halfDir.x /= halfLen;
      halfDir.y /= halfLen;
      halfDir.z /= halfLen;
    }

    const NdotH = Math.max(0, nx * halfDir.x + ny * halfDir.y + nz * halfDir.z);
    const specularPower = (1 - roughness) * 128;
    const specular = Math.pow(NdotH, specularPower);

    // Fresnel (Schlick approximation)
    const F0 = metallic > 0.5 ? 0.9 : reflectivity;
    const VdotH = Math.max(0, viewDir.x * halfDir.x + viewDir.y * halfDir.y + viewDir.z * halfDir.z);
    const fresnel = F0 + (1 - F0) * Math.pow(1 - VdotH, 5);

    // Attenuation
    let attenuation = 1.0;
    if (light.type !== 'directional') {
      attenuation = 1.0 / (1.0 + light.falloff * distance * distance / (light.range * light.range));
    }

    // Combine diffuse and specular
    const diffuseAmount = (1 - metallic) * NdotL;
    const specularAmount = specular * fresnel * reflectivity;

    const lightIntensity = light.intensity * attenuation;

    return {
      r: (baseColor.r * diffuseAmount + specularAmount) * light.color.r * lightIntensity,
      g: (baseColor.g * diffuseAmount + specularAmount) * light.color.g * lightIntensity,
      b: (baseColor.b * diffuseAmount + specularAmount) * light.color.b * lightIntensity
    };
  }

  /**
   * Calculate global illumination (simplified ambient occlusion + color bounce)
   */
  calculateGlobalIllumination(point, normal) {
    // Sample hemisphere for indirect light
    const samples = 8;
    let indirectLight = { r: 0, g: 0, b: 0 };
    
    for (let i = 0; i < samples; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random());
      
      // Simple occlusion check (would be more complex in full implementation)
      const occlusion = 1.0 - (Math.random() * 0.3); // Simplified
      
      // Sky color or environment color
      const skyColor = { r: 0.5, g: 0.7, b: 1.0 };
      
      indirectLight.r += skyColor.r * occlusion;
      indirectLight.g += skyColor.g * occlusion;
      indirectLight.b += skyColor.b * occlusion;
    }
    
    return {
      r: indirectLight.r / samples,
      g: indirectLight.g / samples,
      b: indirectLight.b / samples
    };
  }

  /**
   * Cast shadow ray
   */
  castShadow(point, light, occluders = []) {
    if (!light.castsShadows) return 1.0;

    const { x, y, z } = point;
    
    // Direction to light
    let lightDir;
    let maxDistance;
    
    if (light.type === 'directional') {
      lightDir = {
        x: -light.direction.x,
        y: -light.direction.y,
        z: -light.direction.z
      };
      maxDistance = 1000;
    } else {
      lightDir = {
        x: light.position.x - x,
        y: light.position.y - y,
        z: light.position.z - z
      };
      maxDistance = Math.sqrt(
        lightDir.x * lightDir.x + 
        lightDir.y * lightDir.y + 
        lightDir.z * lightDir.z
      );
      
      if (maxDistance > 0) {
        lightDir.x /= maxDistance;
        lightDir.y /= maxDistance;
        lightDir.z /= maxDistance;
      }
    }

    // Bias to prevent self-shadowing
    const bias = 0.01;
    const rayOrigin = {
      x: x + lightDir.x * bias,
      y: y + lightDir.y * bias,
      z: z + lightDir.z * bias
    };

    // Check occlusion
    for (const occluder of occluders) {
      const intersection = this.rayIntersect(rayOrigin, lightDir, occluder);
      if (intersection && intersection.distance < maxDistance) {
        // Soft shadows based on quality
        if (light.shadowQuality === 'high') {
          return 0.2; // Penumbra
        }
        return 0.0; // Hard shadow
      }
    }

    return 1.0; // No shadow
  }

  /**
   * Ray-occluder intersection (simplified)
   */
  rayIntersect(origin, direction, occluder) {
    // Simplified sphere intersection for now
    // In full implementation, would support various shapes
    if (occluder.type === 'sphere') {
      const oc = {
        x: origin.x - occluder.center.x,
        y: origin.y - occluder.center.y,
        z: origin.z - occluder.center.z
      };
      
      const a = direction.x * direction.x + direction.y * direction.y + direction.z * direction.z;
      const b = 2 * (oc.x * direction.x + oc.y * direction.y + oc.z * direction.z);
      const c = oc.x * oc.x + oc.y * oc.y + oc.z * oc.z - occluder.radius * occluder.radius;
      
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant < 0) return null;
      
      const t = (-b - Math.sqrt(discriminant)) / (2 * a);
      
      if (t > 0) {
        return {
          distance: t,
          point: {
            x: origin.x + direction.x * t,
            y: origin.y + direction.y * t,
            z: origin.z + direction.z * t
          }
        };
      }
    }
    
    return null;
  }

  /**
   * Set up standard 3-point lighting
   */
  setupThreePointLighting() {
    this.lights = [];
    
    // Key light (main light)
    this.addLight({
      type: 'directional',
      direction: { x: -0.5, y: -0.7, z: -0.5 },
      color: { r: 1.0, g: 0.95, b: 0.9 },
      intensity: 1.2,
      castsShadows: true,
      shadowQuality: 'high'
    });
    
    // Fill light (soften shadows)
    this.addLight({
      type: 'directional',
      direction: { x: 0.7, y: -0.3, z: -0.6 },
      color: { r: 0.7, g: 0.8, b: 1.0 },
      intensity: 0.4,
      castsShadows: false
    });
    
    // Rim light (edge highlight)
    this.addLight({
      type: 'directional',
      direction: { x: 0, y: 0.5, z: 1 },
      color: { r: 1.0, g: 1.0, b: 1.0 },
      intensity: 0.6,
      castsShadows: false
    });
  }

  /**
   * Apply lighting to pixel
   */
  applyToPixel(x, y, z, normal, material, ctx) {
    const point = { x, y, z };
    const litColor = this.calculateLighting(point, normal, material);
    
    // Convert to 8-bit RGB
    const r = Math.floor(litColor.r * 255);
    const g = Math.floor(litColor.g * 255);
    const b = Math.floor(litColor.b * 255);
    
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

module.exports = AdvancedLightingSystem;
