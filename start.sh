#!/bin/bash
# ── Kinetic Finance — Start all services ──────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo ""
echo "  ╔═══════════════════════════════╗"
echo "  ║   KINETIC — Starting up...    ║"
echo "  ╚═══════════════════════════════╝"
echo ""

# ── Kill any leftover processes on our ports ──────────────────────────────────
echo "→ Clearing ports 8000 and 5173..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 0.5

# ── Start Backend (FastAPI on port 8000) ──────────────────────────────────────
echo "→ Starting backend on http://localhost:8000 ..."
cd "$BACKEND"

# Activate venv if it exists, otherwise use system python
if [ -f "$ROOT/venv/bin/activate" ]; then
  source "$ROOT/venv/bin/activate"
elif [ -f "$BACKEND/venv/bin/activate" ]; then
  source "$BACKEND/venv/bin/activate"
fi

python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
echo "  ✓ Backend PID: $BACKEND_PID"

# Wait a second for the backend to boot
sleep 2

# Quick health check
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
  echo "  ✓ Backend is healthy"
else
  echo "  ✗ Backend didn't respond — check for errors above"
fi

# ── Start Frontend (Vite on port 5173) ───────────────────────────────────────
echo ""
echo "→ Starting frontend on http://localhost:5173 ..."
cd "$FRONTEND"
npx vite &
FRONTEND_PID=$!
echo "  ✓ Frontend PID: $FRONTEND_PID"

echo ""
echo "  ╔════════════════════════════════════════╗"
echo "  ║  Backend  →  http://localhost:8000     ║"
echo "  ║  Frontend →  http://localhost:5173     ║"
echo "  ║                                        ║"
echo "  ║  Press Ctrl+C to stop everything       ║"
echo "  ╚════════════════════════════════════════╝"
echo ""

# ── Trap Ctrl+C and kill both processes ──────────────────────────────────────
cleanup() {
  echo ""
  echo "→ Shutting down..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  lsof -ti:8000 | xargs kill -9 2>/dev/null || true
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  echo "  ✓ All processes stopped."
  exit 0
}
trap cleanup SIGINT SIGTERM

# Keep the script alive
wait
