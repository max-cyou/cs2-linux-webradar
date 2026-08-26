# CS2 Linux WebRadar

Browser-based radar for Counter-Strike 2 on Linux. Reads game memory via `process_vm_readv` and streams player positions over WebSocket to a React frontend.

Ported from [clauadv/cs2_webradar](https://github.com/clauadv/cs2_webradar) (Windows).

## Requirements

- Linux (tested on Arch Linux)
- GCC with C++23 support
- CMake >= 3.20
- Node.js + npm
- CS2 running

### C++ dependencies

```
nlohmann-json
ixwebsocket
```

## Quick start

```bash
./run.sh
```

This will:
- Check and install dependencies if needed
- Build the binary if missing
- Start the WebSocket relay, Vite dev server, and usermode binary
- Open `http://localhost:5173` in your browser

## Manual build

```bash
# usermode
cd usermode
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build

# webapp
cd webapp
npm install
npm run dev
```

## How it works

```
CS2 memory → cs2_webradar (C++) → ws://localhost:22006 → Vite/React (port 5173)
```

The C++ binary reads CS2 game data every 100ms and sends it to a WebSocket relay server. The React frontend connects to the relay and renders a live radar overlay.

## License

GPL-3.0 — see [LICENSE](LICENSE)
