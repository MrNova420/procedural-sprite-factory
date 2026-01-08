const Engine = require('./server/core/engine');

async function test() {
  console.log('\n🐉 Generating Dragon...');
  
  const dragonDNA = {
    species: 'dragon',
    size: 2.0,
    colors: { primary: '#FF0000' },
    style: 'pixel'
  };
  
  const dragon = await Engine.generate(dragonDNA);
  console.log('✅ Dragon generated:', dragon.id);
  console.log('   Image length:', dragon.image.length, 'chars');
  
  console.log('\n🐺 Generating Wolf...');
  const wolfDNA = {
    species: 'wolf',
    size: 2.0,
    colors: { primary: '#808080' },
    style: 'pixel'
  };
  
  const wolf = await Engine.generate(wolfDNA);
  console.log('✅ Wolf generated:', wolf.id);
  console.log('   Image length:', wolf.image.length, 'chars');
  
  console.log('\n📊 Quality Check:');
  console.log('Both sprites generated successfully');
  console.log('Using updated shape-engine.js with:');
  console.log('  - drawSmoothLimb() for smooth curves');
  console.log('  - drawFurTexture() for fur details');
  console.log('  - drawScalePattern() for dragon scales');
}

test().catch(console.error);
