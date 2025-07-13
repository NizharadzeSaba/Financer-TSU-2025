#!/bin/bash

# Step 0: Kill any lingering ngrok processes
echo "🧹 Killing any existing ngrok processes..."
pkill ngrok 2>/dev/null || echo "✅ No ngrok processes found"

# Step 1: Kill any process using port 8081
PORT=8081
PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
    echo "🔪 Killing process on port $PORT (PID: $PID)"
    kill -9 "$PID"
else
    echo "✅ No process running on port $PORT"
fi

# Step 2: Change to FrontEnd directory
cd FrontEnd || { echo "❌ Failed to enter FrontEnd directory"; exit 1; }

# Step 3: Run Expo in detached mode (no output saved)
echo "🚀 Starting Expo in the background..."
nohup npx expo start --tunnel --go >/dev/null 2>&1 &

echo "✅ Expo started in background."
