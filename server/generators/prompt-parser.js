/**
 * Prompt Parser
 * Interprets natural language descriptions to generate asset DNA
 */
class PromptParser {
  constructor() {
    // Keywords for different categories
    this.categoryKeywords = {
      character: ['character', 'hero', 'warrior', 'mage', 'knight', 'wizard', 'archer', 'rogue', 'person', 'human', 'elf', 'dwarf', 'orc'],
      creature: ['dragon', 'wolf', 'beast', 'monster', 'demon', 'angel', 'phoenix', 'serpent', 'wyvern', 'griffin', 'unicorn', 'goblin', 'troll'],
      building: ['house', 'castle', 'tower', 'temple', 'church', 'palace', 'fortress', 'mansion', 'hut', 'cabin', 'barn', 'shop', 'tavern'],
      environment: ['forest', 'mountain', 'desert', 'ocean', 'cave', 'dungeon', 'ruins', 'garden', 'swamp', 'tundra', 'volcano'],
      item: ['sword', 'axe', 'bow', 'staff', 'wand', 'shield', 'armor', 'helmet', 'potion', 'scroll', 'ring', 'amulet', 'coin', 'gem'],
      furniture: ['table', 'chair', 'bed', 'chest', 'barrel', 'crate', 'bookshelf', 'desk', 'throne'],
      plant: ['tree', 'bush', 'flower', 'grass', 'vine', 'mushroom', 'cactus', 'bamboo'],
      effect: ['fire', 'ice', 'lightning', 'magic', 'smoke', 'explosion', 'sparkle', 'glow', 'aura']
    };

    // Style keywords
    this.styleKeywords = {
      'pixel': ['pixel', 'pixelated', '8-bit', '16-bit', 'retro'],
      'dark-fantasy': ['dark', 'gritty', 'realistic', 'grim', 'gothic'],
      'cyberpunk': ['cyberpunk', 'futuristic', 'neon', 'tech', 'cyber'],
      'cute': ['cute', 'chibi', 'kawaii', 'adorable', 'cartoon'],
      'anime': ['anime', 'manga', 'japanese'],
      'steampunk': ['steampunk', 'victorian', 'brass', 'mechanical'],
      'minimalist': ['minimalist', 'simple', 'clean', 'flat'],
      'hand-drawn': ['hand-drawn', 'sketch', 'pencil', 'artistic']
    };

    // Color keywords
    this.colorKeywords = {
      red: ['red', 'crimson', 'scarlet', 'ruby'],
      blue: ['blue', 'azure', 'cobalt', 'sapphire', 'cyan'],
      green: ['green', 'emerald', 'jade', 'forest'],
      yellow: ['yellow', 'gold', 'golden', 'amber'],
      purple: ['purple', 'violet', 'magenta', 'amethyst'],
      black: ['black', 'dark', 'ebony', 'shadow'],
      white: ['white', 'pale', 'ivory', 'pearl'],
      orange: ['orange', 'copper', 'rust'],
      brown: ['brown', 'tan', 'bronze'],
      gray: ['gray', 'grey', 'silver', 'steel']
    };

    // Attribute keywords
    this.attributeKeywords = {
      size: ['large', 'big', 'huge', 'giant', 'massive', 'small', 'tiny', 'mini', 'miniature'],
      mood: ['fierce', 'angry', 'calm', 'peaceful', 'aggressive', 'friendly', 'sad', 'happy', 'menacing'],
      age: ['ancient', 'old', 'young', 'new', 'worn', 'pristine'],
      condition: ['broken', 'damaged', 'ruined', 'perfect', 'shiny', 'rusty'],
      quality: ['magical', 'enchanted', 'cursed', 'blessed', 'legendary', 'rare', 'common']
    };
  }

  /**
   * Parse natural language prompt into structured data
   * @param {string} prompt - User's description
   * @returns {Object} - Parsed prompt data
   */
  parse(prompt) {
    const lower = prompt.toLowerCase();
    
    return {
      original: prompt,
      category: this.detectCategory(lower),
      subject: this.extractSubject(lower),
      colors: this.extractColors(lower),
      style: this.detectStyle(lower),
      attributes: this.extractAttributes(lower),
      modifiers: this.extractModifiers(lower),
      keywords: this.extractKeywords(lower)
    };
  }

  /**
   * Detect asset category
   */
  detectCategory(text) {
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return category;
        }
      }
    }
    return 'generic';
  }

  /**
   * Extract main subject
   */
  extractSubject(text) {
    const words = text.split(' ');
    
    // Find most specific keyword
    for (const keywords of Object.values(this.categoryKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return keyword;
        }
      }
    }
    
    // Fallback: use first noun-like word
    for (const word of words) {
      if (word.length > 3 && !['with', 'and', 'the'].includes(word)) {
        return word;
      }
    }
    
    return 'object';
  }

  /**
   * Extract colors from description
   */
  extractColors(text) {
    const colors = [];
    
    for (const [colorName, keywords] of Object.entries(this.colorKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          colors.push(colorName);
          break;
        }
      }
    }
    
    return colors;
  }

  /**
   * Detect art style
   */
  detectStyle(text) {
    for (const [style, keywords] of Object.entries(this.styleKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return style;
        }
      }
    }
    return 'pixel'; // Default
  }

  /**
   * Extract attributes
   */
  extractAttributes(text) {
    const attributes = {};
    
    for (const [attrType, keywords] of Object.entries(this.attributeKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          if (!attributes[attrType]) {
            attributes[attrType] = [];
          }
          attributes[attrType].push(keyword);
        }
      }
    }
    
    return attributes;
  }

  /**
   * Extract modifiers (with, has, wearing, etc.)
   */
  extractModifiers(text) {
    const modifiers = [];
    
    // Look for "with X" patterns
    const withPattern = /with\s+([a-z\s]+?)(?:and|,|$)/gi;
    let match;
    while ((match = withPattern.exec(text)) !== null) {
      modifiers.push({
        type: 'with',
        value: match[1].trim()
      });
    }
    
    // Look for "wearing X" patterns
    const wearingPattern = /wearing\s+([a-z\s]+?)(?:and|,|$)/gi;
    while ((match = wearingPattern.exec(text)) !== null) {
      modifiers.push({
        type: 'wearing',
        value: match[1].trim()
      });
    }
    
    // Look for "has X" patterns
    const hasPattern = /has\s+([a-z\s]+?)(?:and|,|$)/gi;
    while ((match = hasPattern.exec(text)) !== null) {
      modifiers.push({
        type: 'has',
        value: match[1].trim()
      });
    }
    
    return modifiers;
  }

  /**
   * Extract all significant keywords
   */
  extractKeywords(text) {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'with', 'in', 'on', 'at'];
    
    return words.filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) &&
      /^[a-z]+$/.test(word)
    );
  }

  /**
   * Generate DNA from parsed prompt
   * @param {Object} parsed - Parsed prompt data
   * @returns {Object} - DNA structure
   */
  toDNA(parsed) {
    const MathUtils = require('../utils/math');
    const ColorUtils = require('../utils/colors');
    
    // Determine species based on category and subject
    let species = 'human'; // Default to human for generic characters
    
    // Map to known species or use generic
    const knownSpecies = ['dragon', 'wolf', 'goblin', 'robot', 'human'];
    if (knownSpecies.includes(parsed.subject)) {
      species = parsed.subject;
    } else if (parsed.category === 'creature' || parsed.category === 'character') {
      // Map common terms to known species
      const speciesMap = {
        'warrior': 'human',
        'knight': 'human',
        'mage': 'human',
        'wizard': 'human',
        'archer': 'human',
        'rogue': 'human',
        'hero': 'human',
        'monster': 'goblin',
        'beast': 'wolf',
        'demon': 'goblin'
      };
      species = speciesMap[parsed.subject] || 'human';
    }
    
    // Determine colors
    const colorMap = {
      red: '#FF0000',
      blue: '#0000FF',
      green: '#00FF00',
      yellow: '#FFFF00',
      purple: '#800080',
      black: '#000000',
      white: '#FFFFFF',
      orange: '#FFA500',
      brown: '#8B4513',
      gray: '#808080'
    };
    
    const primaryColor = parsed.colors[0] ? colorMap[parsed.colors[0]] : '#4169E1';
    const secondaryColor = parsed.colors[1] ? colorMap[parsed.colors[1]] : ColorUtils.lighten(primaryColor, 0.2);
    
    // Determine size
    let size = 1.0;
    if (parsed.attributes.size) {
      const sizeAttr = parsed.attributes.size[0];
      if (['large', 'big', 'huge', 'giant', 'massive'].includes(sizeAttr)) {
        size = MathUtils.randomRange(1.5, 2.5);
      } else if (['small', 'tiny', 'mini', 'miniature'].includes(sizeAttr)) {
        size = MathUtils.randomRange(0.5, 0.9);
      }
    }
    
    return {
      species: species,
      size: size,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor
      },
      style: parsed.style,
      prompt: parsed.original,
      attributes: parsed.attributes,
      modifiers: parsed.modifiers,
      keywords: parsed.keywords
    };
  }
}

module.exports = PromptParser;
