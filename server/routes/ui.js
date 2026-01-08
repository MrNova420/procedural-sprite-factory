/**
 * UI API Routes
 * Endpoints for generating UI elements
 */

const express = require('express');
const router = express.Router();
const UIGenerator = require('../generators/ui-generator');

const uiGenerator = new UIGenerator();

/**
 * POST /api/ui/panel
 * Generate a panel/frame
 */
router.post('/panel', (req, res) => {
  try {
    const { style, width, height, theme, borderWidth } = req.body;

    const result = uiGenerator.generatePanel({
      style,
      width: width || 200,
      height: height || 150,
      theme: theme || 'dark-fantasy',
      borderWidth: borderWidth || 4
    });

    res.json({
      success: true,
      image: result.image
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ui/button
 * Generate a button
 */
router.post('/button', (req, res) => {
  try {
    const { state, width, height, text, theme } = req.body;

    const result = uiGenerator.generateButton({
      state: state || 'normal',
      width: width || 100,
      height: height || 40,
      text: text || '',
      theme: theme || 'dark-fantasy'
    });

    res.json({
      success: true,
      image: result.image
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ui/icon
 * Generate an icon
 */
router.post('/icon', (req, res) => {
  try {
    const { category, iconType, size, theme } = req.body;

    const result = uiGenerator.generateIcon({
      category: category || 'combat',
      iconType: iconType || 'sword',
      size: size || 32,
      theme: theme || 'dark-fantasy'
    });

    res.json({
      success: true,
      image: result.image
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ui/progress-bar
 * Generate a progress bar
 */
router.post('/progress-bar', (req, res) => {
  try {
    const { type, width, height, value, theme } = req.body;

    const result = uiGenerator.generateProgressBar({
      type: type || 'health',
      width: width || 100,
      height: height || 20,
      value: value !== undefined ? value : 1.0,
      theme: theme || 'dark-fantasy'
    });

    res.json({
      success: true,
      image: result.image,
      value: result.value
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ui/types
 * Get all available UI types
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    panelStyles: uiGenerator.panelStyles,
    buttonStates: uiGenerator.buttonStates,
    iconCategories: uiGenerator.getIconTypes(),
    themes: uiGenerator.getThemes()
  });
});

module.exports = router;
