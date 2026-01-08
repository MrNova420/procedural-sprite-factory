/**
 * Item Generator
 * Generates weapons, armor, consumables, and equipment for 2D games
 */

const { createCanvas } = require('canvas');
const ColorUtils = require('../utils/colors');

class ItemGenerator {
  constructor() {
    this.weaponTypes = ['sword', 'axe', 'bow', 'staff', 'dagger', 'hammer', 'spear', 'mace', 'wand', 'scythe', 'crossbow', 'katana'];
    this.armorTypes = ['helmet', 'chestplate', 'boots', 'shield'];
    this.consumableTypes = ['potion', 'scroll', 'food', 'elixir'];
    this.materials = ['leather', 'iron', 'steel', 'mythril', 'dragon'];
    this.qualities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  }

  /**
   * Generate a weapon
   */
  generateWeapon(options = {}) {
    const {
      weaponType = 'sword',
      quality = 'common',
      material = 'iron',
      size = 32,
      colors = {}
    } = options;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Get quality color
    const qualityColor = this.getQualityColor(quality);
    const materialColor = colors.primary || this.getMaterialColor(material);

    // Draw weapon based on type
    switch (weaponType) {
      case 'sword':
        this.drawSword(ctx, size, materialColor, qualityColor);
        break;
      case 'axe':
        this.drawAxe(ctx, size, materialColor, qualityColor);
        break;
      case 'bow':
        this.drawBow(ctx, size, materialColor, qualityColor);
        break;
      case 'staff':
        this.drawStaff(ctx, size, materialColor, qualityColor);
        break;
      case 'dagger':
        this.drawDagger(ctx, size, materialColor, qualityColor);
        break;
      case 'hammer':
        this.drawHammer(ctx, size, materialColor, qualityColor);
        break;
      case 'spear':
        this.drawSpear(ctx, size, materialColor, qualityColor);
        break;
      case 'mace':
        this.drawMace(ctx, size, materialColor, qualityColor);
        break;
      case 'wand':
        this.drawWand(ctx, size, materialColor, qualityColor);
        break;
      case 'scythe':
        this.drawScythe(ctx, size, materialColor, qualityColor);
        break;
      case 'crossbow':
        this.drawCrossbow(ctx, size, materialColor, qualityColor);
        break;
      case 'katana':
        this.drawKatana(ctx, size, materialColor, qualityColor);
        break;
    }

    // Add enchantment glow for high quality items
    if (['epic', 'legendary', 'mythic'].includes(quality)) {
      this.addEnchantmentGlow(ctx, size, qualityColor);
    }

    // Generate stats
    const stats = this.generateWeaponStats(weaponType, quality, material);

    return {
      canvas,
      image: canvas.toDataURL(),
      stats,
      type: weaponType,
      quality,
      material
    };
  }

  /**
   * Draw sword
   */
  drawSword(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Blade
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - 2, centerY + size * 0.3);
    ctx.lineTo(centerX + 2, centerY + size * 0.3);
    ctx.lineTo(centerX + 1, centerY - size * 0.3);
    ctx.lineTo(centerX - 1, centerY - size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Guard
    ctx.fillRect(centerX - 6, centerY + size * 0.25, 12, 3);

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.3);
    ctx.fillRect(centerX - 2, centerY + size * 0.25, 4, size * 0.15);

    // Pommel
    ctx.beginPath();
    ctx.arc(centerX, centerY + size * 0.4, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw axe
   */
  drawAxe(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.4);
    ctx.fillRect(centerX - 2, centerY - size * 0.1, 4, size * 0.5);

    // Axe head
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - 8, centerY - size * 0.1);
    ctx.lineTo(centerX + 8, centerY - size * 0.1);
    ctx.lineTo(centerX + 10, centerY - size * 0.25);
    ctx.lineTo(centerX - 10, centerY - size * 0.25);
    ctx.closePath();
    ctx.fill();

    // Blade edge
    ctx.strokeStyle = ColorUtils.lighten(color, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - size * 0.25);
    ctx.lineTo(centerX + 10, centerY - size * 0.25);
    ctx.stroke();
  }

  /**
   * Draw bow
   */
  drawBow(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Bow limbs
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + 5, centerY - size * 0.35);
    ctx.quadraticCurveTo(centerX + 8, centerY, centerX + 5, centerY + size * 0.35);
    ctx.stroke();

    // String
    ctx.strokeStyle = ColorUtils.darken(color, 0.5);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX + 5, centerY - size * 0.35);
    ctx.lineTo(centerX + 5, centerY + size * 0.35);
    ctx.stroke();
  }

  /**
   * Draw staff
   */
  drawStaff(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Staff shaft
    ctx.strokeStyle = ColorUtils.darken(color, 0.3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.4);
    ctx.lineTo(centerX, centerY + size * 0.4);
    ctx.stroke();

    // Orb at top
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY - size * 0.35, 5, 0, Math.PI * 2);
    ctx.fill();

    // Glow around orb
    const gradient = ctx.createRadialGradient(centerX, centerY - size * 0.35, 2, centerX, centerY - size * 0.35, 8);
    gradient.addColorStop(0, glowColor + 'AA');
    gradient.addColorStop(1, glowColor + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY - size * 0.35, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw dagger
   */
  drawDagger(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Blade (smaller than sword)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - 2, centerY + size * 0.2);
    ctx.lineTo(centerX + 2, centerY + size * 0.2);
    ctx.lineTo(centerX, centerY - size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.3);
    ctx.fillRect(centerX - 2, centerY + size * 0.2, 4, size * 0.1);
  }

  /**
   * Draw hammer
   */
  drawHammer(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.4);
    ctx.fillRect(centerX - 2, centerY, 4, size * 0.4);

    // Hammer head
    ctx.fillStyle = color;
    ctx.fillRect(centerX - 8, centerY - size * 0.15, 16, size * 0.15);
  }

  /**
   * Draw spear
   */
  drawSpear(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Shaft
    ctx.strokeStyle = ColorUtils.darken(color, 0.4);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.15);
    ctx.lineTo(centerX, centerY + size * 0.4);
    ctx.stroke();

    // Spear tip
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - 4, centerY - size * 0.15);
    ctx.lineTo(centerX + 4, centerY - size * 0.15);
    ctx.lineTo(centerX, centerY - size * 0.35);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw mace
   */
  drawMace(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.4);
    ctx.fillRect(centerX - 2, centerY, 4, size * 0.4);

    // Mace head (spiked ball)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY - size * 0.1, 6, 0, Math.PI * 2);
    ctx.fill();

    // Spikes
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * 6;
      const y1 = centerY - size * 0.1 + Math.sin(angle) * 6;
      const x2 = centerX + Math.cos(angle) * 10;
      const y2 = centerY - size * 0.1 + Math.sin(angle) * 10;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

  /**
   * Draw wand
   */
  drawWand(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Wand shaft
    ctx.strokeStyle = ColorUtils.darken(color, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.3);
    ctx.lineTo(centerX, centerY + size * 0.3);
    ctx.stroke();

    // Crystal at tip
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.35);
    ctx.lineTo(centerX - 3, centerY - size * 0.25);
    ctx.lineTo(centerX + 3, centerY - size * 0.25);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw scythe
   */
  drawScythe(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Handle
    ctx.strokeStyle = ColorUtils.darken(color, 0.4);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.2);
    ctx.lineTo(centerX, centerY + size * 0.4);
    ctx.stroke();

    // Blade
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY - size * 0.2, 10, Math.PI, Math.PI * 1.5);
    ctx.stroke();
  }

  /**
   * Draw crossbow
   */
  drawCrossbow(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Stock
    ctx.fillStyle = ColorUtils.darken(color, 0.4);
    ctx.fillRect(centerX - 2, centerY, 4, size * 0.3);

    // Bow
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    ctx.stroke();

    // String
    ctx.strokeStyle = ColorUtils.darken(color, 0.6);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, -Math.PI * 0.3, -Math.PI * 0.7, true);
    ctx.stroke();
  }

  /**
   * Draw katana
   */
  drawKatana(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Blade (slightly curved)
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + size * 0.3);
    ctx.quadraticCurveTo(centerX + 2, centerY, centerX, centerY - size * 0.3);
    ctx.stroke();

    // Guard
    ctx.fillStyle = ColorUtils.darken(color, 0.2);
    ctx.fillRect(centerX - 6, centerY + size * 0.25, 12, 2);

    // Handle
    ctx.fillStyle = ColorUtils.darken(color, 0.4);
    ctx.fillRect(centerX - 2, centerY + size * 0.25, 4, size * 0.12);
  }

  /**
   * Generate armor
   */
  generateArmor(options = {}) {
    const {
      armorType = 'helmet',
      quality = 'common',
      material = 'iron',
      size = 32,
      colors = {}
    } = options;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const qualityColor = this.getQualityColor(quality);
    const materialColor = colors.primary || this.getMaterialColor(material);

    switch (armorType) {
      case 'helmet':
        this.drawHelmet(ctx, size, materialColor, qualityColor);
        break;
      case 'chestplate':
        this.drawChestplate(ctx, size, materialColor, qualityColor);
        break;
      case 'boots':
        this.drawBoots(ctx, size, materialColor, qualityColor);
        break;
      case 'shield':
        this.drawShield(ctx, size, materialColor, qualityColor);
        break;
    }

    if (['epic', 'legendary', 'mythic'].includes(quality)) {
      this.addEnchantmentGlow(ctx, size, qualityColor);
    }

    const stats = this.generateArmorStats(armorType, quality, material);

    return {
      canvas,
      image: canvas.toDataURL(),
      stats,
      type: armorType,
      quality,
      material
    };
  }

  /**
   * Draw helmet
   */
  drawHelmet(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Helmet dome
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.3, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Visor
    ctx.fillStyle = ColorUtils.darken(color, 0.5);
    ctx.fillRect(centerX - size * 0.25, centerY, size * 0.5, size * 0.1);
  }

  /**
   * Draw chestplate
   */
  drawChestplate(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.fillStyle = color;
    ctx.fillRect(centerX - size * 0.3, centerY - size * 0.2, size * 0.6, size * 0.5);

    // Shoulder guards
    ctx.beginPath();
    ctx.arc(centerX - size * 0.3, centerY - size * 0.15, size * 0.1, 0, Math.PI * 2);
    ctx.arc(centerX + size * 0.3, centerY - size * 0.15, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw boots
   */
  drawBoots(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Left boot
    ctx.fillStyle = color;
    ctx.fillRect(centerX - size * 0.25, centerY, size * 0.2, size * 0.3);
    
    // Right boot
    ctx.fillRect(centerX + size * 0.05, centerY, size * 0.2, size * 0.3);
  }

  /**
   * Draw shield
   */
  drawShield(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Shield body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.35);
    ctx.lineTo(centerX + size * 0.25, centerY - size * 0.15);
    ctx.lineTo(centerX + size * 0.25, centerY + size * 0.15);
    ctx.lineTo(centerX, centerY + size * 0.35);
    ctx.lineTo(centerX - size * 0.25, centerY + size * 0.15);
    ctx.lineTo(centerX - size * 0.25, centerY - size * 0.15);
    ctx.closePath();
    ctx.fill();

    // Boss (center decoration)
    ctx.fillStyle = ColorUtils.lighten(color, 0.3);
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Generate consumable
   */
  generateConsumable(options = {}) {
    const {
      consumableType = 'potion',
      effect = 'health',
      quality = 'common',
      size = 32,
      colors = {}
    } = options;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const effectColor = colors.primary || this.getEffectColor(effect);
    const qualityColor = this.getQualityColor(quality);

    switch (consumableType) {
      case 'potion':
        this.drawPotion(ctx, size, effectColor, qualityColor);
        break;
      case 'scroll':
        this.drawScroll(ctx, size, effectColor, qualityColor);
        break;
      case 'food':
        this.drawFood(ctx, size, effectColor, qualityColor);
        break;
      case 'elixir':
        this.drawElixir(ctx, size, effectColor, qualityColor);
        break;
    }

    const stats = this.generateConsumableStats(consumableType, effect, quality);

    return {
      canvas,
      image: canvas.toDataURL(),
      stats,
      type: consumableType,
      effect,
      quality
    };
  }

  /**
   * Draw potion
   */
  drawPotion(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Bottle
    ctx.fillStyle = ColorUtils.lighten('#888888', 0.3);
    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.15, centerY - size * 0.1);
    ctx.lineTo(centerX - size * 0.2, centerY + size * 0.2);
    ctx.quadraticCurveTo(centerX, centerY + size * 0.25, centerX + size * 0.2, centerY + size * 0.2);
    ctx.lineTo(centerX + size * 0.15, centerY - size * 0.1);
    ctx.closePath();
    ctx.fill();

    // Liquid
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.18, centerY + size * 0.05);
    ctx.lineTo(centerX - size * 0.2, centerY + size * 0.2);
    ctx.quadraticCurveTo(centerX, centerY + size * 0.25, centerX + size * 0.2, centerY + size * 0.2);
    ctx.lineTo(centerX + size * 0.18, centerY + size * 0.05);
    ctx.closePath();
    ctx.fill();

    // Cork
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(centerX - size * 0.1, centerY - size * 0.15, size * 0.2, size * 0.08);
  }

  /**
   * Draw scroll
   */
  drawScroll(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Scroll paper
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(centerX - size * 0.25, centerY - size * 0.3, size * 0.5, size * 0.6);

    // Rolled edges
    ctx.fillStyle = ColorUtils.darken('#F5E6D3', 0.2);
    ctx.fillRect(centerX - size * 0.25, centerY - size * 0.3, size * 0.5, size * 0.05);
    ctx.fillRect(centerX - size * 0.25, centerY + size * 0.25, size * 0.5, size * 0.05);

    // Magical symbols
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY - size * 0.15 + i * size * 0.15, size * 0.05, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /**
   * Draw food
   */
  drawFood(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Simple food item (apple-like)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = ColorUtils.lighten(color, 0.3);
    ctx.beginPath();
    ctx.arc(centerX - size * 0.1, centerY - size * 0.1, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw elixir
   */
  drawElixir(ctx, size, color, glowColor) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Flask
    ctx.fillStyle = ColorUtils.lighten('#888888', 0.4);
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Glowing liquid
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.25);
    gradient.addColorStop(0, ColorUtils.lighten(color, 0.3));
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Add enchantment glow effect
   */
  addEnchantmentGlow(ctx, size, color) {
    const centerX = size / 2;
    const centerY = size / 2;

    const gradient = ctx.createRadialGradient(centerX, centerY, size * 0.1, centerX, centerY, size * 0.5);
    gradient.addColorStop(0, color + '00');
    gradient.addColorStop(0.5, color + '44');
    gradient.addColorStop(1, color + '00');

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Get quality color
   */
  getQualityColor(quality) {
    const colors = {
      common: '#888888',
      uncommon: '#00FF00',
      rare: '#0080FF',
      epic: '#A335EE',
      legendary: '#FF8000',
      mythic: '#FF00FF'
    };
    return colors[quality] || colors.common;
  }

  /**
   * Get material color
   */
  getMaterialColor(material) {
    const colors = {
      leather: '#8B4513',
      iron: '#808080',
      steel: '#B0B0B0',
      mythril: '#ADD8E6',
      dragon: '#8B0000'
    };
    return colors[material] || colors.iron;
  }

  /**
   * Get effect color
   */
  getEffectColor(effect) {
    const colors = {
      health: '#FF0000',
      mana: '#0000FF',
      stamina: '#00FF00',
      strength: '#FFA500',
      speed: '#FFFF00',
      defense: '#808080'
    };
    return colors[effect] || colors.health;
  }

  /**
   * Generate weapon stats
   */
  generateWeaponStats(weaponType, quality, material) {
    const qualityMultiplier = { common: 1, uncommon: 1.5, rare: 2, epic: 3, legendary: 4, mythic: 5 }[quality];
    const materialMultiplier = { leather: 0.5, iron: 1, steel: 1.5, mythril: 2, dragon: 3 }[material];

    const baseDamage = { sword: 10, axe: 12, bow: 8, staff: 6, dagger: 7, hammer: 15, spear: 11, mace: 13, wand: 5, scythe: 14, crossbow: 9, katana: 11 }[weaponType] || 10;

    return {
      damage: Math.floor(baseDamage * qualityMultiplier * materialMultiplier),
      speed: Math.random() * 0.5 + 0.5,
      critChance: Math.random() * 0.2,
      durability: Math.floor(100 * materialMultiplier)
    };
  }

  /**
   * Generate armor stats
   */
  generateArmorStats(armorType, quality, material) {
    const qualityMultiplier = { common: 1, uncommon: 1.5, rare: 2, epic: 3, legendary: 4, mythic: 5 }[quality];
    const materialMultiplier = { leather: 0.5, iron: 1, steel: 1.5, mythril: 2, dragon: 3 }[material];

    const baseDefense = { helmet: 5, chestplate: 10, boots: 4, shield: 8 }[armorType] || 5;

    return {
      defense: Math.floor(baseDefense * qualityMultiplier * materialMultiplier),
      durability: Math.floor(100 * materialMultiplier),
      weight: Math.floor(10 * materialMultiplier)
    };
  }

  /**
   * Generate consumable stats
   */
  generateConsumableStats(consumableType, effect, quality) {
    const qualityMultiplier = { common: 1, uncommon: 1.5, rare: 2, epic: 3, legendary: 4, mythic: 5 }[quality];

    const baseValue = { potion: 50, scroll: 30, food: 20, elixir: 40 }[consumableType] || 30;

    return {
      effectPower: Math.floor(baseValue * qualityMultiplier),
      duration: Math.floor(10 * qualityMultiplier),
      cooldown: Math.max(1, Math.floor(30 / qualityMultiplier))
    };
  }
}

module.exports = ItemGenerator;
