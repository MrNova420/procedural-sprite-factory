#!/bin/bash
# Monitor server logs in real-time for issues

echo "🔍 Monitoring Procedural Sprite Factory logs..."
echo "Watching for: PLACEHOLDER, TODO, FIXME, ERROR, 404, 500"
echo "Press Ctrl+C to stop"
echo ""

tail -f server-detailed.log | grep --line-buffered -E "(PLACEHOLDER|TODO|FIXME|ERROR|404|500|⚠️|🚨|❌)" --color=always
