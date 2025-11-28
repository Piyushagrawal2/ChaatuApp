#!/bin/bash

# Backend Setup Script
# This script ensures the backend is ready to run with all dependencies installed

set -e  # Exit on error

cd "$(dirname "$0")"

echo "🔧 Setting up backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo "✅ Backend setup complete!"
