/**
 * Quality Presets System
 * One-click professional quality configurations for different use cases
 */

class QualityPresets {
  constructor() {
    this.presets = this.initializePresets();
  }

  /**
   * Initialize all quality presets
   */
  initializePresets() {
    return {
      // Game-specific presets
      mobileGame: {
        name: 'Mobile Game Optimized',
        description: 'Optimized for mobile games - lower detail, higher performance',
        settings: {
          resolution: 64,
          detailLevel: 0.4,
          particleCount: 20,
          lightingQuality: 'low',
          shadowQuality: 'none',
          animationFrames: 4,
          textureResolution: 32,
          antialiasing: false,
          effects: {
            glow: false,
            blur: false,
            distortion: false
          },
          style: {
            aesthetic: 0.7,
            line: 0.6,
            color: 0.9,
            shading: 0.3,
            detail: 0.4,
            texture: 0.3,
            effects: 0.2,
            finish: 0.5
          }
        }
      },

      retro8Bit: {
        name: '8-Bit Retro',
        description: 'Classic 8-bit console style (NES, Gameboy)',
        settings: {
          resolution: 16,
          detailLevel: 0.3,
          paletteSize: 4,
          dithering: true,
          pixelPerfect: true,
          lightingQuality: 'none',
          shadowQuality: 'none',
          style: {
            aesthetic: 0.6,
            line: 0.8,
            color: 0.7,
            shading: 0.2,
            detail: 0.2,
            texture: 0.1,
            effects: 0,
            finish: 0.1
          },
          colorConstraints: {
            hueSteps: 8,
            saturationLevels: 2,
            brightnessLevels: 4
          }
        }
      },

      snes16Bit: {
        name: '16-Bit SNES Style',
        description: 'Super Nintendo era quality',
        settings: {
          resolution: 32,
          detailLevel: 0.5,
          paletteSize: 16,
          dithering: true,
          pixelPerfect: true,
          lightingQuality: 'low',
          shadowQuality: 'low',
          style: {
            aesthetic: 0.7,
            line: 0.6,
            color: 0.8,
            shading: 0.5,
            detail: 0.5,
            texture: 0.4,
            effects: 0.2,
            finish: 0.3
          }
        }
      },

      modernPixelArt: {
        name: 'Modern Pixel Art',
        description: 'Contemporary pixel art with advanced techniques',
        settings: {
          resolution: 64,
          detailLevel: 0.7,
          paletteSize: 32,
          dithering: true,
          pixelPerfect: true,
          lightingQuality: 'medium',
          shadowQuality: 'medium',
          animationFrames: 8,
          style: {
            aesthetic: 0.8,
            line: 0.4,
            color: 0.9,
            shading: 0.7,
            detail: 0.7,
            texture: 0.6,
            effects: 0.5,
            finish: 0.6
          }
        }
      },

      hdSprite: {
        name: 'HD Sprite',
        description: 'High-definition sprites with maximum detail',
        settings: {
          resolution: 128,
          detailLevel: 0.9,
          particleCount: 100,
          lightingQuality: 'high',
          shadowQuality: 'high',
          animationFrames: 16,
          textureResolution: 128,
          antialiasing: true,
          subsurfaceScattering: true,
          globalIllumination: true,
          effects: {
            glow: true,
            blur: true,
            distortion: true,
            chromatic: false
          },
          style: {
            aesthetic: 0.8,
            line: 0.2,
            color: 1.0,
            shading: 0.9,
            detail: 0.9,
            texture: 0.8,
            effects: 0.7,
            finish: 0.9
          }
        }
      },

      ultraRealism: {
        name: 'Ultra Realistic 2D',
        description: 'Maximum quality, photorealistic rendering',
        settings: {
          resolution: 256,
          detailLevel: 1.0,
          particleCount: 200,
          lightingQuality: 'ultra',
          shadowQuality: 'ultra',
          animationFrames: 24,
          textureResolution: 256,
          antialiasing: true,
          subsurfaceScattering: true,
          globalIllumination: true,
          ambientOcclusion: true,
          effects: {
            glow: true,
            blur: true,
            distortion: true,
            chromatic: true,
            depthOfField: true,
            motionBlur: true
          },
          style: {
            aesthetic: 0.7,
            line: 0,
            color: 1.0,
            shading: 1.0,
            detail: 1.0,
            texture: 1.0,
            effects: 1.0,
            finish: 1.0
          }
        }
      },

      // Art style presets
      cozyRPG: {
        name: 'Cozy RPG',
        description: 'Warm, inviting style for cozy games',
        settings: {
          resolution: 64,
          detailLevel: 0.6,
          lightingQuality: 'medium',
          shadowQuality: 'soft',
          style: {
            aesthetic: 0.9,
            line: 0.5,
            color: 0.9,
            shading: 0.5,
            detail: 0.6,
            texture: 0.4,
            effects: 0.4,
            finish: 0.5
          },
          colorProfile: {
            temperature: 0.7, // Warm
            saturation: 1.2,
            brightness: 1.1,
            contrast: 0.8
          }
        }
      },

      darkFantasy: {
        name: 'Dark Fantasy',
        description: 'Gritty, dark, atmospheric',
        settings: {
          resolution: 96,
          detailLevel: 0.8,
          lightingQuality: 'high',
          shadowQuality: 'high',
          style: {
            aesthetic: 0.2,
            line: 0.7,
            color: 0.4,
            shading: 0.9,
            detail: 0.8,
            texture: 0.9,
            effects: 0.6,
            finish: 0.3
          },
          colorProfile: {
            temperature: 0.3, // Cool
            saturation: 0.6,
            brightness: 0.6,
            contrast: 1.3
          },
          weatherDefault: 'fog'
        }
      },

      cyberpunkNeon: {
        name: 'Cyberpunk Neon',
        description: 'Neon lights, high contrast, futuristic',
        settings: {
          resolution: 96,
          detailLevel: 0.8,
          lightingQuality: 'high',
          shadowQuality: 'medium',
          style: {
            aesthetic: 0.5,
            line: 0.6,
            color: 1.0,
            shading: 0.7,
            detail: 0.8,
            texture: 0.5,
            effects: 1.0,
            finish: 0.9
          },
          colorProfile: {
            temperature: 0.5,
            saturation: 1.5,
            brightness: 0.8,
            contrast: 1.4,
            neonGlow: true
          },
          effects: {
            glow: true,
            scanlines: true,
            chromatic: true
          }
        }
      },

      anime: {
        name: 'Anime Style',
        description: 'Clean, cel-shaded anime aesthetic',
        settings: {
          resolution: 96,
          detailLevel: 0.6,
          lightingQuality: 'medium',
          shadowQuality: 'cel',
          style: {
            aesthetic: 0.8,
            line: 0.9,
            color: 1.0,
            shading: 0.4,
            detail: 0.6,
            texture: 0.2,
            effects: 0.5,
            finish: 0.7
          },
          shadingType: 'cel',
          outlineWidth: 2,
          colorProfile: {
            saturation: 1.3,
            brightness: 1.1,
            contrast: 1.2
          }
        }
      },

      watercolor: {
        name: 'Watercolor',
        description: 'Soft, painted watercolor effect',
        settings: {
          resolution: 96,
          detailLevel: 0.7,
          lightingQuality: 'medium',
          shadowQuality: 'soft',
          style: {
            aesthetic: 0.9,
            line: 0.3,
            color: 0.8,
            shading: 0.6,
            detail: 0.6,
            texture: 0.7,
            effects: 0.3,
            finish: 0.4
          },
          effects: {
            blur: true,
            watercolorEdges: true,
            paperTexture: true
          },
          colorProfile: {
            saturation: 0.9,
            brightness: 1.0,
            softness: 0.7
          }
        }
      },

      // Production presets
      rapidPrototype: {
        name: 'Rapid Prototype',
        description: 'Fast generation for quick iteration',
        settings: {
          resolution: 32,
          detailLevel: 0.3,
          particleCount: 10,
          lightingQuality: 'low',
          shadowQuality: 'none',
          animationFrames: 2,
          textureResolution: 16,
          antialiasing: false,
          cacheEnabled: true,
          optimizationLevel: 'maximum'
        }
      },

      balanced: {
        name: 'Balanced',
        description: 'Good balance of quality and performance',
        settings: {
          resolution: 64,
          detailLevel: 0.6,
          particleCount: 50,
          lightingQuality: 'medium',
          shadowQuality: 'medium',
          animationFrames: 8,
          textureResolution: 64,
          antialiasing: true,
          style: {
            aesthetic: 0.7,
            line: 0.5,
            color: 0.8,
            shading: 0.6,
            detail: 0.6,
            texture: 0.5,
            effects: 0.5,
            finish: 0.6
          }
        }
      },

      production: {
        name: 'Production Ready',
        description: 'Optimized for shipping in games',
        settings: {
          resolution: 64,
          detailLevel: 0.7,
          particleCount: 50,
          lightingQuality: 'medium',
          shadowQuality: 'medium',
          animationFrames: 8,
          textureResolution: 64,
          antialiasing: true,
          compressionEnabled: true,
          atlasPackingEnabled: true,
          style: {
            aesthetic: 0.8,
            line: 0.5,
            color: 0.9,
            shading: 0.7,
            detail: 0.7,
            texture: 0.6,
            effects: 0.6,
            finish: 0.7
          }
        }
      },

      showcase: {
        name: 'Showcase/Marketing',
        description: 'Maximum quality for screenshots and trailers',
        settings: {
          resolution: 128,
          detailLevel: 1.0,
          particleCount: 150,
          lightingQuality: 'ultra',
          shadowQuality: 'ultra',
          animationFrames: 16,
          textureResolution: 128,
          antialiasing: true,
          subsurfaceScattering: true,
          globalIllumination: true,
          ambientOcclusion: true,
          effects: {
            glow: true,
            blur: true,
            distortion: true,
            chromatic: false,
            depthOfField: true
          },
          style: {
            aesthetic: 0.85,
            line: 0.3,
            color: 1.0,
            shading: 0.95,
            detail: 0.95,
            texture: 0.9,
            effects: 0.8,
            finish: 0.95
          }
        }
      }
    };
  }

  /**
   * Get preset by name
   */
  getPreset(presetName) {
    return this.presets[presetName] || this.presets.balanced;
  }

  /**
   * Apply preset to generation parameters
   */
  applyPreset(presetName, baseParams = {}) {
    const preset = this.getPreset(presetName);
    
    // Deep merge preset settings with base parameters
    return this.deepMerge(baseParams, preset.settings);
  }

  /**
   * Get all preset names and descriptions
   */
  listPresets() {
    return Object.entries(this.presets).map(([key, preset]) => ({
      id: key,
      name: preset.name,
      description: preset.description
    }));
  }

  /**
   * Get presets by category
   */
  getPresetsByCategory() {
    return {
      games: [
        'mobileGame',
        'retro8Bit',
        'snes16Bit',
        'modernPixelArt',
        'hdSprite',
        'ultraRealism'
      ],
      artStyles: [
        'cozyRPG',
        'darkFantasy',
        'cyberpunkNeon',
        'anime',
        'watercolor'
      ],
      production: [
        'rapidPrototype',
        'balanced',
        'production',
        'showcase'
      ]
    };
  }

  /**
   * Create custom preset from current settings
   */
  createCustomPreset(name, description, settings) {
    this.presets[`custom_${name}`] = {
      name,
      description,
      settings,
      custom: true
    };
    
    return `custom_${name}`;
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(output[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    
    return output;
  }

  /**
   * Get recommended preset for use case
   */
  getRecommendedPreset(useCase) {
    const recommendations = {
      'mobile-game': 'mobileGame',
      'desktop-game': 'production',
      'indie-game': 'modernPixelArt',
      'aaa-game': 'showcase',
      'retro-game': 'snes16Bit',
      'prototype': 'rapidPrototype',
      'marketing': 'showcase',
      'portfolio': 'showcase',
      'casual': 'cozyRPG',
      'action': 'darkFantasy',
      'scifi': 'cyberpunkNeon',
      'jrpg': 'anime'
    };
    
    return recommendations[useCase] || 'balanced';
  }

  /**
   * Get quality score for preset
   */
  getQualityScore(presetName) {
    const preset = this.getPreset(presetName);
    const settings = preset.settings;
    
    const scores = {
      resolution: (settings.resolution || 64) / 256,
      detail: settings.detailLevel || 0.5,
      lighting: {
        'none': 0,
        'low': 0.25,
        'medium': 0.5,
        'high': 0.75,
        'ultra': 1.0
      }[settings.lightingQuality] || 0.5,
      effects: settings.effects ? Object.values(settings.effects).filter(v => v).length / 6 : 0
    };
    
    return {
      overall: (scores.resolution + scores.detail + scores.lighting + scores.effects) / 4,
      breakdown: scores
    };
  }

  /**
   * Get performance estimate
   */
  getPerformanceEstimate(presetName) {
    const preset = this.getPreset(presetName);
    const quality = this.getQualityScore(presetName);
    
    // Estimate generation time in ms
    const baseTime = 10;
    const timeMultiplier = 1 + quality.overall * 10;
    const estimatedTime = baseTime * timeMultiplier;
    
    // Estimate memory usage in MB
    const resolution = preset.settings.resolution || 64;
    const memoryMB = (resolution * resolution * 4) / (1024 * 1024) * 2; // RGBA + overhead
    
    return {
      generationTime: Math.round(estimatedTime),
      memoryUsage: memoryMB.toFixed(2),
      performanceRating: quality.overall < 0.4 ? 'fast' : quality.overall < 0.7 ? 'moderate' : 'slow'
    };
  }
}

module.exports = QualityPresets;
