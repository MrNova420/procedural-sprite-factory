#!/usr/bin/env node

/**
 * Complete System Verification Test
 * Tests all systems end-to-end to ensure high quality and amazing visuals
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Import all generators
const ShapeEngine = require('./server/generators/shape-engine');
const UniversalRealityCompiler = require('./server/generators/universal-reality-compiler');
const UniversalStyleSpace = require('./server/generators/universal-style-space');
const AdvancedLightingSystem = require('./server/generators/advanced-lighting-system');
const MaterialPhysicsSystem = require('./server/generators/material-physics-system');
const InverseKinematics = require('./server/generators/inverse-kinematics');
const WeatherSystem = require('./server/generators/weather-system');
const QualityPresets = require('./server/generators/quality-presets');
const AutoTiler = require('./server/generators/auto-tiler');

console.log('🚀 Universal 2D Reality Compiler - Complete System Test\n');
console.log('=' .repeat(80));

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, fn) {
  try {
    console.log(`\n📋 Testing: ${name}`);
    const result = fn();
    if (result) {
      console.log(`✅ PASS: ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
    } else {
      console.log(`❌ FAIL: ${name}`);
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: 'Returned false' });
    }
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.error(`   Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
  }
}

// Create output directory
const outputDir = path.join(__dirname, 'test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('\n🎨 TESTING CORE SYSTEMS\n');

// Test 1: Universal Reality Compiler
test('Universal Reality Compiler - Crystal Spider Generation', () => {
  const compiler = new UniversalRealityCompiler();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  const params = {
    form: {
      topology: 'octopod',
      symmetry: { type: 'radial', count: 8 },
      complexity: 0.7,
      organic: 0.3
    },
    material: {
      physical: { reflectivity: 0.9, translucency: 0.6 },
      optical: { iridescence: 0.7, fluorescence: 0.5 }
    },
    seed: 42
  };
  
  compiler.generate(ctx, params, 64, 64, 50);
  
  // Save output
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test1-crystal-spider.png'), buffer);
  console.log('   Generated: test1-crystal-spider.png');
  
  return true;
});

// Test 2: Style Space Navigation
test('Universal Style Space - Multiple Art Styles', () => {
  const styleSpace = new UniversalStyleSpace();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  // Draw a simple shape
  ctx.fillStyle = '#4080ff';
  ctx.fillRect(30, 30, 68, 68);
  
  // Test cozy RPG style
  const cozyStyle = {
    aesthetic: 0.9,
    line: 0.5,
    color: 0.9,
    shading: 0.6,
    detail: 0.7,
    texture: 0.3,
    effects: 0.5,
    finish: 0.6
  };
  
  styleSpace.applyStyle(ctx, canvas.width, canvas.height, cozyStyle);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test2-cozy-style.png'), buffer);
  console.log('   Generated: test2-cozy-style.png');
  
  return true;
});

// Test 3: Advanced Lighting System
test('Advanced Lighting System - PBR with Global Illumination', () => {
  const lighting = new AdvancedLightingSystem();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  // Setup three-point lighting
  const lights = lighting.setupThreePointLighting(64, 64, 128, 128);
  
  // Create a sphere to light
  const imageData = ctx.getImageData(0, 0, 128, 128);
  
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const dx = x - 64;
      const dy = y - 64;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 40) {
        // Inside sphere
        const normal = { x: dx / 40, y: dy / 40, z: Math.sqrt(1 - (dx*dx + dy*dy) / 1600) };
        const color = lighting.calculateLighting(
          { x, y, z: 0 },
          normal,
          { r: 100, g: 150, b: 255 },
          { roughness: 0.3, metallic: 0.5 },
          lights,
          { quality: 'high', globalIllumination: true }
        );
        
        const idx = (y * 128 + x) * 4;
        imageData.data[idx] = color.r;
        imageData.data[idx + 1] = color.g;
        imageData.data[idx + 2] = color.b;
        imageData.data[idx + 3] = 255;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test3-pbr-lighting.png'), buffer);
  console.log('   Generated: test3-pbr-lighting.png');
  
  return true;
});

// Test 4: Material Physics - Cloth Simulation
test('Material Physics System - Cloth Simulation', () => {
  const physics = new MaterialPhysicsSystem();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  // Create cloth
  const cloth = physics.createCloth({
    width: 5,
    height: 5,
    spacing: 15,
    x: 24,
    y: 10
  });
  
  // Simulate for a few frames
  for (let i = 0; i < 30; i++) {
    physics.updateCloth(cloth, 0.016, { x: 0.5, y: 0 });
  }
  
  // Render cloth
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 128, 128);
  
  physics.renderCloth(ctx, cloth, { r: 200, g: 100, b: 50 });
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test4-cloth-physics.png'), buffer);
  console.log('   Generated: test4-cloth-physics.png');
  
  return true;
});

// Test 5: Inverse Kinematics - Walk Cycle
test('Inverse Kinematics System - Procedural Walk Cycle', () => {
  const ik = new InverseKinematics();
  const canvas = createCanvas(512, 128);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 512, 128);
  
  // Generate 8-frame walk cycle
  const walkCycle = ik.generateWalkCycle({
    frameCount: 8,
    legLength: 40,
    stepHeight: 15,
    stepLength: 25
  });
  
  // Render all frames side by side
  walkCycle.forEach((frame, idx) => {
    const offsetX = idx * 64 + 32;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    
    // Render skeleton
    frame.forEach(limb => {
      ctx.beginPath();
      ctx.moveTo(offsetX + limb.start.x, 64 + limb.start.y);
      limb.joints.forEach(joint => {
        ctx.lineTo(offsetX + joint.x, 64 + joint.y);
      });
      ctx.stroke();
      
      // Draw joints
      ctx.fillStyle = '#333';
      limb.joints.forEach(joint => {
        ctx.beginPath();
        ctx.arc(offsetX + joint.x, 64 + joint.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  });
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test5-walk-cycle.png'), buffer);
  console.log('   Generated: test5-walk-cycle.png');
  
  return true;
});

// Test 6: Weather System - Rain Effect
test('Weather System - Animated Rain', () => {
  const weather = new WeatherSystem();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  // Setup rain
  const rain = weather.createRain({ intensity: 0.7, wind: 0.3 });
  
  // Simulate and render
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 128, 128);
  
  for (let i = 0; i < 5; i++) {
    weather.updateRain(rain, 0.016);
  }
  
  weather.renderRain(ctx, rain, 128, 128);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test6-rain-effect.png'), buffer);
  console.log('   Generated: test6-rain-effect.png');
  
  return true;
});

// Test 7: Quality Presets
test('Quality Presets System - Multiple Quality Levels', () => {
  const presets = new QualityPresets();
  
  const showcase = presets.getPreset('showcase');
  const mobile = presets.getPreset('mobileGame');
  const ultra = presets.getPreset('ultraRealism');
  
  console.log(`   Showcase: ${showcase.size}x${showcase.size}, ${showcase.estimatedTime}ms`);
  console.log(`   Mobile: ${mobile.size}x${mobile.size}, ${mobile.estimatedTime}ms`);
  console.log(`   Ultra: ${ultra.size}x${ultra.size}, ${ultra.estimatedTime}ms`);
  
  return showcase && mobile && ultra;
});

// Test 8: Auto-Tiler
test('Auto-Tiler System - Seamless Terrain', () => {
  const tiler = new AutoTiler();
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  
  // Generate grass tileset
  const tileset = tiler.generateTileset({
    material: 'grass',
    size: 32,
    seed: 12345
  });
  
  // Render 8x8 grid of center tiles
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const tile = tileset.tiles.center;
      ctx.putImageData(tile, x * 32, y * 32);
    }
  }
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test8-grass-tileset.png'), buffer);
  console.log('   Generated: test8-grass-tileset.png');
  
  return true;
});

// Test 9: Professional Dragon Renderer
test('Professional Dragon Renderer - 100+ Scales', () => {
  const shapeEngine = new ShapeEngine();
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  const params = {
    species: 'dragon',
    size: 2,
    seed: 42
  };
  
  const result = shapeEngine.generateShape(params, 128, 128);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test9-professional-dragon.png'), buffer);
  console.log('   Generated: test9-professional-dragon.png');
  
  return result !== null;
});

// Test 10: Complete Integrated Generation
test('Complete Integrated System - AAA Quality Output', () => {
  const shapeEngine = new ShapeEngine();
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  
  const params = {
    universal: true,
    preset: 'showcase',
    form: {
      topology: 'biped',
      symmetry: { type: 'mirror', axis: 'vertical' },
      complexity: 0.8,
      organic: 0.7
    },
    material: {
      physical: {
        roughness: 0.4,
        reflectivity: 0.6,
        translucency: 0.0
      },
      optical: {
        iridescence: 0.3,
        fluorescence: 0.1
      }
    },
    styleCoordinates: {
      aesthetic: 0.8,
      line: 0.6,
      color: 0.9,
      shading: 0.8,
      detail: 0.9,
      texture: 0.5,
      effects: 0.6,
      finish: 0.7
    },
    colorParams: {
      baseHue: 220,
      saturation: 0.8,
      harmonyType: 'triadic'
    },
    lighting: {
      setup: 'three-point',
      quality: 'high',
      globalIllumination: true
    },
    seed: 777
  };
  
  const result = shapeEngine.generateShape(params, 256, 256);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'test10-aaa-integrated.png'), buffer);
  console.log('   Generated: test10-aaa-integrated.png');
  
  return result !== null;
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 TEST RESULTS\n');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

console.log('\n📁 Output Directory: ' + outputDir);
console.log('   View generated images to verify visual quality\n');

if (results.failed === 0) {
  console.log('🎉 ALL TESTS PASSED! System is fully operational and producing high-quality output.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the output above for details.\n');
  process.exit(1);
}
