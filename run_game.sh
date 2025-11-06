#!/bin/bash
# Quick test script for the game

echo "🎮 Testing Modern Flappy Bird"
echo "=============================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed!"
    exit 1
fi
echo "✅ Python3 found"

# Check dependencies
echo "Checking dependencies..."
python3 -c "import pygame; import numpy" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "🚀 Launching game..."
echo ""
python3 main.py
