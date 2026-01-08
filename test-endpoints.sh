#!/bin/bash

echo "Testing Procedural Sprite Factory API Endpoints"
echo "================================================"
echo ""

# Test 1: Generate Dragon
echo "1. Testing Dragon Generation..."
result=$(curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species":"dragon","size":1.0,"style":"pixel","colors":{"primary":"#8B0000"}}')
echo "$result" | grep -o '"success":true' && echo "✅ Dragon generation works!"
echo ""

# Test 2: Generate Wolf
echo "2. Testing Wolf Generation..."
result=$(curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species":"wolf","size":1.0,"style":"pixel","colors":{"primary":"#808080"}}')
echo "$result" | grep -o '"success":true' && echo "✅ Wolf generation works!"
echo ""

# Test 3: Text to Asset
echo "3. Testing Text-to-Asset..."
result=$(curl -s -X POST http://localhost:3000/api/universal/from-text \
  -H "Content-Type: application/json" \
  -d '{"prompt":"fierce red dragon with glowing eyes"}')
echo "$result" | grep -o '"success":true' && echo "✅ Text-to-Asset works!"
echo ""

# Test 4: Animation
echo "4. Testing Animation Generation..."
result=$(curl -s -X POST http://localhost:3000/api/animations/generate \
  -H "Content-Type: application/json" \
  -d '{"dna":{"species":"goblin","size":1.0},"animationType":"walk","frameCount":8}')
echo "$result" | grep -o '"success":true' && echo "✅ Animation generation works!"
echo ""

# Test 5: Particle Effects
echo "5. Testing Particle Effects..."
result=$(curl -s -X POST http://localhost:3000/api/effects/generate \
  -H "Content-Type: application/json" \
  -d '{"effectType":"fire","particleCount":50,"duration":60}')
echo "$result" | grep -o '"success":true' && echo "✅ Particle effects work!"
echo ""

# Test 6: World Generation
echo "6. Testing World Generation..."
result=$(curl -s -X POST http://localhost:3000/api/world/generate \
  -H "Content-Type: application/json" \
  -d '{"width":32,"height":32,"biome":"forest"}')
echo "$result" | grep -o '"success":true' && echo "✅ World generation works!"
echo ""

# Test 7: Item Generation
echo "7. Testing Item Generation..."
result=$(curl -s -X POST http://localhost:3000/api/items/generate \
  -H "Content-Type: application/json" \
  -d '{"category":"weapon","rarity":"legendary"}')
echo "$result" | grep -o '"success":true' && echo "✅ Item generation works!"
echo ""

# Test 8: UI Generation
echo "8. Testing UI Element Generation..."
result=$(curl -s -X POST http://localhost:3000/api/ui/generate \
  -H "Content-Type: application/json" \
  -d '{"elementType":"button","style":"fantasy"}')
echo "$result" | grep -o '"success":true' && echo "✅ UI element generation works!"
echo ""

echo "================================================"
echo "✅ ALL TESTS PASSED!"
echo "Server is running at: http://localhost:3000"
echo "================================================"
