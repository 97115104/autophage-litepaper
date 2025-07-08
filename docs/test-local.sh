#!/bin/bash
echo "Starting local test server..."
echo "Server will run at: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""
cd "$(dirname "$0")"
python3 -m http.server 8000