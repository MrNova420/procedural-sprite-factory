/**
 * Math Utilities
 * Common mathematical functions for procedural generation
 */

class MathUtils {
  /**
   * Linear interpolation
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Map value from one range to another
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Distance between two points
   */
  static distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Angle between two points (in radians)
   */
  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  /**
   * Rotate point around center
   */
  static rotatePoint(x, y, centerX, centerY, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - centerX;
    const dy = y - centerY;
    
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  }

  /**
   * Cubic bezier curve point
   */
  static bezierPoint(t, p0, p1, p2, p3) {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    return {
      x: p0.x * mt3 + 3 * p1.x * mt2 * t + 3 * p2.x * mt * t2 + p3.x * t3,
      y: p0.y * mt3 + 3 * p1.y * mt2 * t + 3 * p2.y * mt * t2 + p3.y * t3
    };
  }

  /**
   * Quadratic bezier curve point
   */
  static quadraticBezier(t, p0, p1, p2) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    
    return {
      x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
      y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y
    };
  }

  /**
   * Catmull-Rom spline interpolation
   */
  static catmullRom(t, p0, p1, p2, p3, tension = 0.5) {
    const t2 = t * t;
    const t3 = t2 * t;
    
    const v0 = (p2 - p0) * tension;
    const v1 = (p3 - p1) * tension;
    
    return (2 * p1 - 2 * p2 + v0 + v1) * t3 +
           (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
           v0 * t + p1;
  }

  /**
   * Ease in-out function
   */
  static easeInOut(t) {
    return t < 0.5 
      ? 2 * t * t 
      : -1 + (4 - 2 * t) * t;
  }

  /**
   * Random float between min and max
   */
  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Random integer between min and max (inclusive)
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Random choice from array
   */
  static randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Weighted random choice
   */
  static weightedRandom(items, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }

  /**
   * Perlin noise 2D (simplified)
   * For full implementation, use simplex-noise library
   */
  static perlinNoise2D(x, y, seed = 0) {
    // Simple hash-based noise for now
    const X = Math.floor(x);
    const Y = Math.floor(y);
    
    const hash = (n) => {
      n = ((n << 13) ^ n);
      return (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff;
    };
    
    const noise = (x, y) => {
      const n = x + y * 57 + seed * 131;
      return 1.0 - (hash(n) / 1073741824.0);
    };
    
    // Interpolate
    const xf = x - X;
    const yf = y - Y;
    
    const u = xf * xf * (3.0 - 2.0 * xf);
    const v = yf * yf * (3.0 - 2.0 * yf);
    
    const n00 = noise(X, Y);
    const n10 = noise(X + 1, Y);
    const n01 = noise(X, Y + 1);
    const n11 = noise(X + 1, Y + 1);
    
    const nx0 = this.lerp(n00, n10, u);
    const nx1 = this.lerp(n01, n11, u);
    
    return this.lerp(nx0, nx1, v);
  }
}

module.exports = MathUtils;
