/**
 * Items API Routes
 * Endpoints for generating weapons, armor, and consumables
 */

const express = require('express');
const router = express.Router();
const ItemGenerator = require('../generators/item-generator');

const itemGenerator = new ItemGenerator();

/**
 * POST /api/items/weapon
 * Generate a weapon
 */
router.post('/weapon', (req, res) => {
  try {
    const { weaponType, quality, material, size, colors } = req.body;

    const result = itemGenerator.generateWeapon({
      weaponType,
      quality,
      material,
      size: size || 32,
      colors
    });

    res.json({
      success: true,
      image: result.image,
      stats: result.stats,
      type: result.type,
      quality: result.quality,
      material: result.material
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/items/armor
 * Generate armor
 */
router.post('/armor', (req, res) => {
  try {
    const { armorType, quality, material, size, colors } = req.body;

    const result = itemGenerator.generateArmor({
      armorType,
      quality,
      material,
      size: size || 32,
      colors
    });

    res.json({
      success: true,
      image: result.image,
      stats: result.stats,
      type: result.type,
      quality: result.quality,
      material: result.material
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/items/consumable
 * Generate a consumable
 */
router.post('/consumable', (req, res) => {
  try {
    const { consumableType, effect, quality, size, colors } = req.body;

    const result = itemGenerator.generateConsumable({
      consumableType,
      effect,
      quality,
      size: size || 32,
      colors
    });

    res.json({
      success: true,
      image: result.image,
      stats: result.stats,
      type: result.type,
      effect: result.effect,
      quality: result.quality
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/items/random
 * Generate a random item
 */
router.post('/random', (req, res) => {
  try {
    const { minQuality, maxQuality, categories, size } = req.body;

    // Determine item category
    const allowedCategories = categories || ['weapon', 'armor', 'consumable'];
    const category = allowedCategories[Math.floor(Math.random() * allowedCategories.length)];

    // Determine quality
    const qualities = itemGenerator.qualities;
    const minIndex = minQuality ? qualities.indexOf(minQuality) : 0;
    const maxIndex = maxQuality ? qualities.indexOf(maxQuality) : qualities.length - 1;
    const qualityIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
    const quality = qualities[qualityIndex];

    let result;
    if (category === 'weapon') {
      const weaponType = itemGenerator.weaponTypes[Math.floor(Math.random() * itemGenerator.weaponTypes.length)];
      const material = itemGenerator.materials[Math.floor(Math.random() * itemGenerator.materials.length)];
      result = itemGenerator.generateWeapon({ weaponType, quality, material, size: size || 32 });
      result.category = 'weapon';
    } else if (category === 'armor') {
      const armorType = itemGenerator.armorTypes[Math.floor(Math.random() * itemGenerator.armorTypes.length)];
      const material = itemGenerator.materials[Math.floor(Math.random() * itemGenerator.materials.length)];
      result = itemGenerator.generateArmor({ armorType, quality, material, size: size || 32 });
      result.category = 'armor';
    } else {
      const consumableType = itemGenerator.consumableTypes[Math.floor(Math.random() * itemGenerator.consumableTypes.length)];
      const effects = ['health', 'mana', 'stamina', 'strength', 'speed', 'defense'];
      const effect = effects[Math.floor(Math.random() * effects.length)];
      result = itemGenerator.generateConsumable({ consumableType, effect, quality, size: size || 32 });
      result.category = 'consumable';
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/items/batch
 * Generate multiple items
 */
router.post('/batch', (req, res) => {
  try {
    const { count, categories, minQuality, maxQuality, size } = req.body;
    const itemCount = Math.min(count || 10, 100);

    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const allowedCategories = categories || ['weapon', 'armor', 'consumable'];
      const category = allowedCategories[Math.floor(Math.random() * allowedCategories.length)];

      const qualities = itemGenerator.qualities;
      const minIndex = minQuality ? qualities.indexOf(minQuality) : 0;
      const maxIndex = maxQuality ? qualities.indexOf(maxQuality) : qualities.length - 1;
      const qualityIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
      const quality = qualities[qualityIndex];

      let result;
      if (category === 'weapon') {
        const weaponType = itemGenerator.weaponTypes[Math.floor(Math.random() * itemGenerator.weaponTypes.length)];
        const material = itemGenerator.materials[Math.floor(Math.random() * itemGenerator.materials.length)];
        result = itemGenerator.generateWeapon({ weaponType, quality, material, size: size || 32 });
        result.category = 'weapon';
      } else if (category === 'armor') {
        const armorType = itemGenerator.armorTypes[Math.floor(Math.random() * itemGenerator.armorTypes.length)];
        const material = itemGenerator.materials[Math.floor(Math.random() * itemGenerator.materials.length)];
        result = itemGenerator.generateArmor({ armorType, quality, material, size: size || 32 });
        result.category = 'armor';
      } else {
        const consumableType = itemGenerator.consumableTypes[Math.floor(Math.random() * itemGenerator.consumableTypes.length)];
        const effects = ['health', 'mana', 'stamina', 'strength', 'speed', 'defense'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        result = itemGenerator.generateConsumable({ consumableType, effect, quality, size: size || 32 });
        result.category = 'consumable';
      }

      items.push(result);
    }

    res.json({
      success: true,
      items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/items/types
 * Get all available item types
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    weaponTypes: itemGenerator.weaponTypes,
    armorTypes: itemGenerator.armorTypes,
    consumableTypes: itemGenerator.consumableTypes,
    materials: itemGenerator.materials,
    qualities: itemGenerator.qualities
  });
});

module.exports = router;
