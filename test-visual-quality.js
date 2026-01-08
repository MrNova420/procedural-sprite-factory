const fs = require('fs');
const { createCanvas } = require('canvas');
const ShapeEngine = require('./server/generators/shape-engine');

console.log('\n🎨 Testing Visual Quality Improvements...\n');

// Create test canvas
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Test if new methods exist
const engine = new ShapeEngine();

console.log('✅ Testing new drawing methods:');
console.log('  - drawSmoothLimb:', typeof engine.drawSmoothLimb === 'function' ? '✅ EXISTS' : '❌ MISSING');
console.log('  - drawFurTexture:', typeof engine.drawFurTexture === 'function' ? '✅ EXISTS' : '❌ MISSING');
console.log('  - drawScalePattern:', typeof engine.drawScalePattern === 'function' ? '✅ EXISTS' : '❌ MISSING');

// Test drawing a limb
console.log('\n🦵 Testing drawSmoothLimb:');
if (typeof engine.drawSmoothLimb === 'function') {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 400, 400);
  
  engine.drawSmoothLimb(ctx, 100, 100, 200, 300, 30, 20, '#FF0000');
  console.log('  ✅ Smooth limb drawn successfully');
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('test-limb.png', buffer);
  console.log('  💾 Saved to: test-limb.png');
} else {
  console.log('  ❌ Method missing!');
}

console.log('\n📊 File Analysis:');
const shapeEngineCode = fs.readFileSync('./server/generators/shape-engine.js', 'utf8');
console.log(`  - shape-engine.js: ${shapeEngineCode.length} characters`);
console.log(`  - Contains "drawSmoothLimb": ${shapeEngineCode.includes('drawSmoothLimb')}`);
console.log(`  - Contains "bezierCurveTo": ${shapeEngineCode.includes('bezierCurveTo')}`);
console.log(`  - Contains "drawFurTexture": ${shapeEngineCode.includes('drawFurTexture')}`);

console.log('\n' + '='.repeat(60));
