/**
 * UI Generator
 * Generates UI elements for 2D games - panels, buttons, icons, progress bars
 */

const { createCanvas } = require('canvas');
const ColorUtils = require('../utils/colors');

class UIGenerator {
  constructor() {
    this.panelStyles = ['simple', 'ornate', 'wooden', 'stone', 'metal', 'fantasy', 'sci-fi', 'minimal'];
    this.buttonStates = ['normal', 'hover', 'pressed', 'disabled', 'selected', 'focused', 'success', 'danger'];
    this.iconCategories = {
      combat: ['sword', 'shield', 'bow', 'magic', 'axe', 'dagger', 'spear', 'hammer'],
      stats: ['health', 'mana', 'stamina', 'defense', 'attack', 'speed', 'luck', 'exp'],
      items: ['potion', 'key', 'coin', 'gem', 'chest', 'bag', 'scroll', 'book'],
      actions: ['attack', 'defend', 'flee', 'use', 'talk', 'trade', 'rest', 'save'],
      status: ['poison', 'burn', 'freeze', 'stun', 'sleep', 'silence', 'blind', 'curse'],
      navigation: ['map', 'compass', 'quest', 'inventory', 'menu', 'settings', 'help', 'exit']
    };
    this.themes = {
      'dark-fantasy': { bg: '#1a1a2e', fg: '#a8b2d1', accent: '#8b5cf6' },
      'cyberpunk': { bg: '#0a0e27', fg: '#00f7ff', accent: '#ff006e' },
      'retro': { bg: '#2c3e50', fg: '#ecf0f1', accent: '#e74c3c' },
      'minimal': { bg: '#ffffff', fg: '#000000', accent: '#007bff' }
    };
  }

  /**
   * Generate a panel/frame
   */
  generatePanel(options = {}) {
    const {
      style = 'simple',
      width = 200,
      height = 150,
      theme = 'dark-fantasy',
      borderWidth = 4
    } = options;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const themeColors = this.themes[theme] || this.themes['dark-fantasy'];

    // Background
    ctx.fillStyle = themeColors.bg;
    ctx.fillRect(0, 0, width, height);

    // Border based on style
    switch (style) {
      case 'simple':
        this.drawSimpleBorder(ctx, width, height, borderWidth, themeColors.fg);
        break;
      case 'ornate':
        this.drawOrnateBorder(ctx, width, height, borderWidth, themeColors.accent);
        break;
      case 'wooden':
        this.drawWoodenBorder(ctx, width, height, borderWidth, '#8B4513');
        break;
      case 'stone':
        this.drawStoneBorder(ctx, width, height, borderWidth, '#808080');
        break;
      default:
        this.drawSimpleBorder(ctx, width, height, borderWidth, themeColors.fg);
    }

    return {
      canvas,
      image: canvas.toDataURL()
    };
  }

  drawSimpleBorder(ctx, width, height, borderWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  drawOrnateBorder(ctx, width, height, borderWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    
    // Main border
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
    
    // Corner decorations
    const cornerSize = 10;
    [
      [borderWidth, borderWidth],
      [width - borderWidth, borderWidth],
      [borderWidth, height - borderWidth],
      [width - borderWidth, height - borderWidth]
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, cornerSize, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  drawWoodenBorder(ctx, width, height, borderWidth, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, borderWidth);
    ctx.fillRect(0, height - borderWidth, width, borderWidth);
    ctx.fillRect(0, 0, borderWidth, height);
    ctx.fillRect(width - borderWidth, 0, borderWidth, height);

    // Wood grain effect
    ctx.strokeStyle = ColorUtils.darken(color, 0.2);
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = borderWidth + Math.random() * (height - borderWidth * 2);
      ctx.beginPath();
      ctx.moveTo(borderWidth, y);
      ctx.lineTo(width - borderWidth, y);
      ctx.stroke();
    }
  }

  drawStoneBorder(ctx, width, height, borderWidth, color) {
    ctx.fillStyle = color;
    
    // Draw stone blocks
    const blockSize = borderWidth * 2;
    for (let x = 0; x < width; x += blockSize) {
      ctx.fillRect(x, 0, blockSize - 1, borderWidth);
      ctx.fillRect(x, height - borderWidth, blockSize - 1, borderWidth);
    }
    for (let y = 0; y < height; y += blockSize) {
      ctx.fillRect(0, y, borderWidth, blockSize - 1);
      ctx.fillRect(width - borderWidth, y, borderWidth, blockSize - 1);
    }
  }

  /**
   * Generate a button
   */
  generateButton(options = {}) {
    const {
      state = 'normal',
      width = 100,
      height = 40,
      text = '',
      theme = 'dark-fantasy'
    } = options;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const themeColors = this.themes[theme] || this.themes['dark-fantasy'];

    // Get state-specific colors
    let bgColor = themeColors.bg;
    let fgColor = themeColors.fg;
    
    switch (state) {
      case 'hover':
        bgColor = ColorUtils.lighten(themeColors.bg, 0.2);
        break;
      case 'pressed':
        bgColor = ColorUtils.darken(themeColors.bg, 0.2);
        break;
      case 'disabled':
        bgColor = ColorUtils.darken(themeColors.bg, 0.4);
        fgColor = ColorUtils.darken(themeColors.fg, 0.5);
        break;
      case 'selected':
      case 'focused':
        bgColor = themeColors.accent;
        fgColor = '#ffffff';
        break;
      case 'success':
        bgColor = '#00ff00';
        fgColor = '#000000';
        break;
      case 'danger':
        bgColor = '#ff0000';
        fgColor = '#ffffff';
        break;
    }

    // Draw button background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Draw text if provided
    if (text) {
      ctx.fillStyle = fgColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
    }

    return {
      canvas,
      image: canvas.toDataURL()
    };
  }

  /**
   * Generate an icon
   */
  generateIcon(options = {}) {
    const {
      category = 'combat',
      iconType = 'sword',
      size = 32,
      theme = 'dark-fantasy'
    } = options;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const themeColors = this.themes[theme] || this.themes['dark-fantasy'];

    // Draw icon based on type
    ctx.fillStyle = themeColors.fg;
    ctx.strokeStyle = themeColors.fg;
    ctx.lineWidth = 2;

    const centerX = size / 2;
    const centerY = size / 2;

    switch (iconType) {
      case 'sword':
        this.drawSwordIcon(ctx, centerX, centerY, size);
        break;
      case 'shield':
        this.drawShieldIcon(ctx, centerX, centerY, size);
        break;
      case 'health':
        this.drawHeartIcon(ctx, centerX, centerY, size);
        break;
      case 'mana':
        this.drawManaIcon(ctx, centerX, centerY, size);
        break;
      case 'potion':
        this.drawPotionIcon(ctx, centerX, centerY, size);
        break;
      case 'coin':
        this.drawCoinIcon(ctx, centerX, centerY, size);
        break;
      default:
        this.drawDefaultIcon(ctx, centerX, centerY, size);
    }

    return {
      canvas,
      image: canvas.toDataURL()
    };
  }

  drawSwordIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.beginPath();
    ctx.moveTo(x - 2 * scale, y + 10 * scale);
    ctx.lineTo(x + 2 * scale, y + 10 * scale);
    ctx.lineTo(x, y - 12 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 4 * scale, y + 8 * scale, 8 * scale, 2 * scale);
  }

  drawShieldIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.beginPath();
    ctx.moveTo(x, y - 10 * scale);
    ctx.lineTo(x + 8 * scale, y - 5 * scale);
    ctx.lineTo(x + 8 * scale, y + 5 * scale);
    ctx.lineTo(x, y + 12 * scale);
    ctx.lineTo(x - 8 * scale, y + 5 * scale);
    ctx.lineTo(x - 8 * scale, y - 5 * scale);
    ctx.closePath();
    ctx.fill();
  }

  drawHeartIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(x, y + 6 * scale);
    ctx.bezierCurveTo(x, y + 3 * scale, x - 8 * scale, y - 6 * scale, x - 8 * scale, y - 2 * scale);
    ctx.bezierCurveTo(x - 8 * scale, y + 2 * scale, x, y + 6 * scale, x, y + 10 * scale);
    ctx.bezierCurveTo(x, y + 6 * scale, x + 8 * scale, y + 2 * scale, x + 8 * scale, y - 2 * scale);
    ctx.bezierCurveTo(x + 8 * scale, y - 6 * scale, x, y + 3 * scale, x, y + 6 * scale);
    ctx.closePath();
    ctx.fill();
  }

  drawManaIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.fillStyle = '#0000FF';
    ctx.beginPath();
    ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x - 2 * scale + i * 2 * scale, y - 2 * scale, 1 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPotionIcon(ctx, x, y, size) {
    const scale = size / 32;
    
    // Bottle outline
    ctx.beginPath();
    ctx.moveTo(x - 4 * scale, y - 8 * scale);
    ctx.lineTo(x - 6 * scale, y + 8 * scale);
    ctx.quadraticCurveTo(x, y + 10 * scale, x + 6 * scale, y + 8 * scale);
    ctx.lineTo(x + 4 * scale, y - 8 * scale);
    ctx.closePath();
    ctx.stroke();
    
    // Liquid
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x - 5 * scale, y, 10 * scale, 8 * scale);
  }

  drawCoinIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#FFA500';
    ctx.font = `${12 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', x, y);
  }

  drawDefaultIcon(ctx, x, y, size) {
    const scale = size / 32;
    ctx.fillRect(x - 6 * scale, y - 6 * scale, 12 * scale, 12 * scale);
  }

  /**
   * Generate a progress bar
   */
  generateProgressBar(options = {}) {
    const {
      type = 'health',
      width = 100,
      height = 20,
      value = 1.0,
      theme = 'dark-fantasy'
    } = options;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Get color based on type
    let barColor = '#FF0000';
    switch (type) {
      case 'health':
        barColor = '#FF0000';
        break;
      case 'mana':
        barColor = '#0000FF';
        break;
      case 'experience':
        barColor = '#FFD700';
        break;
      case 'loading':
        barColor = '#00FF00';
        break;
    }

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, width, height);

    // Fill bar
    const fillWidth = width * Math.min(1, Math.max(0, value));
    const gradient = ctx.createLinearGradient(0, 0, fillWidth, 0);
    gradient.addColorStop(0, ColorUtils.darken(barColor, 0.2));
    gradient.addColorStop(1, barColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, fillWidth, height);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    return {
      canvas,
      image: canvas.toDataURL(),
      value
    };
  }

  /**
   * Get all available icon types
   */
  getIconTypes() {
    return this.iconCategories;
  }

  /**
   * Get all themes
   */
  getThemes() {
    return Object.keys(this.themes);
  }
}

module.exports = UIGenerator;
