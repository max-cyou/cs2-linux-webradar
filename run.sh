#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BINARY="$ROOT/usermode/build/cs2_webradar"
WEBSOCKET_PORT=22006
VITE_PORT=5173
WEBAPP_PID=""
BINARY_PID=""

# ── colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

ok()    { printf "${GREEN}[✓]${RESET} %s\n" "$1"; }
warn()  { printf "${YELLOW}[!]${RESET} %s\n" "$1"; }
fail()  { printf "${RED}[✗]${RESET} %s\n" "$1"; exit 1; }

cleanup() {
  trap - INT TERM HUP
  printf "\n${DIM}Shutting down...${RESET}\n"
  fuser -k -9 "$WEBSOCKET_PORT/tcp" "$VITE_PORT/tcp" 2>/dev/null || true
  [ -n "$BINARY_PID" ] && kill -9 "$BINARY_PID" 2>/dev/null || true
  [ -n "$WEBAPP_PID" ] && kill -9 "$WEBAPP_PID" 2>/dev/null || true
  ok "Stopped"
  exit 0
}

trap cleanup INT TERM HUP

# ── banner ──
printf "\n"
printf "${BOLD}${CYAN}  ╔══════════════════════════════════════╗${RESET}\n"
printf "${BOLD}${CYAN}  ║      CS2 LINUX WEBRADAR              ║${RESET}\n"
printf "${BOLD}${CYAN}  ╚══════════════════════════════════════╝${RESET}\n"
printf "${DIM}  Ported on Linux by ${RESET}${BOLD}maxcyou${RESET}${DIM} · codeberg.org/maxcyou/cs2_linux_webradar${RESET}\n"
printf "\n"

# ── kill anything on our ports ──
if fuser 22006/tcp 5173/tcp >/dev/null 2>&1; then
  warn "Killing stale processes on ports $WEBSOCKET_PORT, $VITE_PORT..."
  fuser -k -9 "$WEBSOCKET_PORT/tcp" "$VITE_PORT/tcp" 2>/dev/null || true
  sleep 0.5
  fuser -k -9 "$WEBSOCKET_PORT/tcp" "$VITE_PORT/tcp" 2>/dev/null || true
fi

# ── check system deps ──
check_cmd() {
  command -v "$1" &>/dev/null && ok "$1 found" || fail "$1 not found — $2"
}

check_cmd cmake  "install cmake"
check_cmd make    "install make"
check_cmd g++     "install gcc"
check_cmd node    "install nodejs"
check_cmd npm     "install npm"

if pkg-config --exists nlohmann_json 2>/dev/null; then
  ok "nlohmann_json found"
else
  warn "nlohmann_json not found via pkg-config — build may fail"
fi

if pkg-config --exists ixwebsocket 2>/dev/null; then
  ok "ixwebsocket found"
else
  warn "ixwebsocket not found via pkg-config — build may fail"
fi

printf "\n"

# ── build binary if missing ──
if [ ! -f "$BINARY" ]; then
  info "Building usermode..."
  cd "$ROOT/usermode"
  cmake -B build -S . -DCMAKE_BUILD_TYPE=Release >/dev/null
  cmake --build build -j"$(nproc)" 2>&1 | tail -1
  cd "$ROOT"
  [ -f "$BINARY" ] && ok "Binary built: $BINARY" || fail "Build failed"
else
  ok "Binary found: $BINARY"
fi

# ── check webapp node_modules ──
if [ ! -d "$ROOT/webapp/node_modules" ]; then
  info "Installing webapp dependencies..."
  cd "$ROOT/webapp"
  npm install --silent 2>/dev/null
  cd "$ROOT"
  ok "Webapp dependencies installed"
else
  ok "Webapp dependencies ready"
fi

printf "\n"

# ── start websocket relay + vite ──
cd "$ROOT/webapp"
npm run dev >/dev/null 2>&1 &
WEBAPP_PID=$!
cd "$ROOT"

sleep 2

# ── start usermode binary ──
cd "$ROOT/usermode"
./build/cs2_webradar >/dev/null 2>&1 &
BINARY_PID=$!
cd "$ROOT"

printf "\n"
ok "All services running"
printf "  ${DIM}WebSocket relay  → ws://localhost:$WEBSOCKET_PORT/cs2_webradar${RESET}\n"
printf "  ${DIM}Webapp           → http://localhost:$VITE_PORT${RESET}\n"
printf "  ${DIM}Usermode         → PID $BINARY_PID${RESET}\n"
printf "\n"
printf "${DIM}Press Ctrl+C to stop all services${RESET}\n"

wait
