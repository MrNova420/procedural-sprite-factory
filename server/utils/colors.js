const MathUtils = require('./math');

/**
 * Color Utilities
 * Color manipulation, palette generation, and color theory
 */
class ColorUtils {
  /**
   * Convert hex to RGB
   */
  static hexToRgb(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r, g, b) {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
  }

  /**
   * Lighten color by percentage
   */
  static lighten(hex, percent) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    const newL = Math.min(100, l + percent * 100);
    const [nr, ng, nb] = this.hslToRgb(h, s, newL);
    return this.rgbToHex(nr, ng, nb);
  }

  /**
   * Darken color by percentage
   */
  static darken(hex, percent) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    const newL = Math.max(0, l - percent * 100);
    const [nr, ng, nb] = this.hslToRgb(h, s, newL);
    return this.rgbToHex(nr, ng, nb);
  }

  /**
   * Saturate color by percentage
   */
  static saturate(hex, percent) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    const newS = Math.min(100, s + percent * 100);
    const [nr, ng, nb] = this.hslToRgb(h, newS, l);
    return this.rgbToHex(nr, ng, nb);
  }

  /**
   * Generate complementary color
   */
  static complementary(hex) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    const newH = (h + 180) % 360;
    const [nr, ng, nb] = this.hslToRgb(newH, s, l);
    return this.rgbToHex(nr, ng, nb);
  }

  /**
   * Generate analogous colors
   */
  static analogous(hex, angle = 30) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    
    const [r1, g1, b1] = this.hslToRgb((h + angle) % 360, s, l);
    const [r2, g2, b2] = this.hslToRgb((h - angle + 360) % 360, s, l);
    
    return [
      this.rgbToHex(r1, g1, b1),
      hex,
      this.rgbToHex(r2, g2, b2)
    ];
  }

  /**
   * Generate triadic colors
   */
  static triadic(hex) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    
    const [r1, g1, b1] = this.hslToRgb((h + 120) % 360, s, l);
    const [r2, g2, b2] = this.hslToRgb((h + 240) % 360, s, l);
    
    return [
      hex,
      this.rgbToHex(r1, g1, b1),
      this.rgbToHex(r2, g2, b2)
    ];
  }

  /**
   * Generate monochromatic palette
   */
  static monochromatic(hex, count = 5) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    
    const colors = [];
    const step = 80 / (count - 1);
    
    for (let i = 0; i < count; i++) {
      const newL = 10 + i * step;
      const [nr, ng, nb] = this.hslToRgb(h, s, newL);
      colors.push(this.rgbToHex(nr, ng, nb));
    }
    
    return colors;
  }

  /**
   * Generate harmonious palette
   */
  static harmonious(hex, scheme = 'complementary') {
    switch (scheme) {
      case 'complementary':
        return [hex, this.complementary(hex)];
      
      case 'analogous':
        return this.analogous(hex);
      
      case 'triadic':
        return this.triadic(hex);
      
      case 'split-complementary':
        const comp = this.complementary(hex);
        return this.analogous(comp);
      
      case 'tetradic':
        const [r, g, b] = this.hexToRgb(hex);
        const [h, s, l] = this.rgbToHsl(r, g, b);
        
        const colors = [];
        for (let i = 0; i < 4; i++) {
          const [nr, ng, nb] = this.hslToRgb((h + i * 90) % 360, s, l);
          colors.push(this.rgbToHex(nr, ng, nb));
        }
        return colors;
      
      default:
        return [hex];
    }
  }

  /**
   * Generate random palette
   */
  static randomPalette(count = 5) {
    const baseHue = Math.random() * 360;
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + i * (360 / count)) % 360;
      const saturation = 50 + Math.random() * 50;
      const lightness = 30 + Math.random() * 40;
      
      const [r, g, b] = this.hslToRgb(hue, saturation, lightness);
      colors.push(this.rgbToHex(r, g, b));
    }
    
    return colors;
  }

  /**
   * Get color temperature (warm/cool)
   */
  static temperature(hex) {
    const [r, g, b] = this.hexToRgb(hex);
    const [h] = this.rgbToHsl(r, g, b);
    
    // Warm colors: reds, oranges, yellows (0-60° and 300-360°)
    // Cool colors: blues, greens (150-270°)
    if ((h >= 0 && h <= 60) || (h >= 300 && h <= 360)) return 'warm';
    if (h >= 150 && h <= 270) return 'cool';
    return 'neutral';
  }

  /**
   * Blend two colors
   */
  static blend(hex1, hex2, ratio = 0.5) {
    const [r1, g1, b1] = this.hexToRgb(hex1);
    const [r2, g2, b2] = this.hexToRgb(hex2);
    
    const r = MathUtils.lerp(r1, r2, ratio);
    const g = MathUtils.lerp(g1, g2, ratio);
    const b = MathUtils.lerp(b1, b2, ratio);
    
    return this.rgbToHex(r, g, b);
  }
}

module.exports = ColorUtils;
