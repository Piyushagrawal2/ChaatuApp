#!/bin/bash

# Frontend Setup Script
# This script ensures the frontend is ready to run with all dependencies installed

set -e  # Exit on error

cd "$(dirname "$0")"

echo "🔧 Setting up frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm packages..."
    npm install
else
    echo "📦 Checking for updated packages..."
    npm install --quiet
fi

echo "✅ Frontend setup complete!"
