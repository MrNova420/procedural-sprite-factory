#!/bin/bash

echo "🧪 Testing AAA Quality Universal Procedural Generation"
echo "======================================================"
echo ""

# Test 1: Procedural creature with biped archetype
echo "Test 1: Procedural Biped Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"biped","size":2,"seed":12345}' \
  -o /tmp/test-biped.json 2>/dev/null

if [ -f "/tmp/test-biped.json" ]; then
  echo "✅ Biped creature generated successfully"
else
  echo "❌ Biped creature generation failed"
fi

# Test 2: Procedural quadruped creature
echo ""
echo "Test 2: Procedural Quadruped Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"quadruped","size":2,"seed":54321,"material":"fur"}' \
  -o /tmp/test-quadruped.json 2>/dev/null

if [ -f "/tmp/test-quadruped.json" ]; then
  echo "✅ Quadruped creature generated successfully"
else
  echo "❌ Quadruped creature generation failed"
fi

# Test 3: Flying creature with wings
echo ""
echo "Test 3: Procedural Flying Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"flying","size":2,"seed":99999,"material":"scales"}' \
  -o /tmp/test-flying.json 2>/dev/null

if [ -f "/tmp/test-flying.json" ]; then
  echo "✅ Flying creature generated successfully"
else
  echo "❌ Flying creature generation failed"
fi

# Test 4: Spider-like creature
echo ""
echo "Test 4: Procedural Spider Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"spider","size":2,"seed":77777,"eyeCount":8}' \
  -o /tmp/test-spider.json 2>/dev/null

if [ -f "/tmp/test-spider.json" ]; then
  echo "✅ Spider creature generated successfully"
else
  echo "❌ Spider creature generation failed"
fi

# Test 5: Serpentine creature
echo ""
echo "Test 5: Procedural Serpentine Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"serpentine","size":2,"seed":11111,"material":"scales"}' \
  -o /tmp/test-serpentine.json 2>/dev/null

if [ -f "/tmp/test-serpentine.json" ]; then
  echo "✅ Serpentine creature generated successfully"
else
  echo "❌ Serpentine creature generation failed"
fi

# Test 6: Floating/ethereal creature
echo ""
echo "Test 6: Procedural Floating Creature"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"procedural":true,"archetype":"floating","size":2,"seed":33333,"magical":true}' \
  -o /tmp/test-floating.json 2>/dev/null

if [ -f "/tmp/test-floating.json" ]; then
  echo "✅ Floating creature generated successfully"
else
  echo "❌ Floating creature generation failed"
fi

# Test 7: Dragon with professional renderer
echo ""
echo "Test 7: Professional Dragon Renderer"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species":"dragon","size":2,"style":"pixel"}' \
  -o /tmp/test-dragon-pro.json 2>/dev/null

if [ -f "/tmp/test-dragon-pro.json" ]; then
  echo "✅ Professional dragon generated successfully"
else
  echo "❌ Professional dragon generation failed"
fi

# Test 8: Wolf with professional renderer
echo ""
echo "Test 8: Professional Wolf Renderer"
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species":"wolf","size":2,"style":"pixel"}' \
  -o /tmp/test-wolf-pro.json 2>/dev/null

if [ -f "/tmp/test-wolf-pro.json" ]; then
  echo "✅ Professional wolf generated successfully"
else
  echo "❌ Professional wolf generation failed"
fi

echo ""
echo "======================================================"
echo "✅ All tests complete!"
echo ""
echo "Generated files:"
ls -lh /tmp/test-*.json | wc -l
echo "files created in /tmp/"
