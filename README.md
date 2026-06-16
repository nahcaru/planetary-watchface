# Planetary Watch Face for Zepp OS 🪐

A minimalist, high-contrast digital watch face for **Zepp OS 2.x** devices, designed specifically for the **Amazfit Balance** (480×480 screen resolution). 

The watch face features the **Planet of the Day** (or celestial body) as its background, cycling dynamically based on the day of the week, with sleek modern typography and custom-rendered widgets.

---

## Features

- 🌌 **Planet of the Day**: A different celestial body as the background for every day of the week.
- 🕒 **Digital Clock**: Large, highly-readable time in 24-hour format (`hh:mm`).
- 📅 **Date & Day Indicator**: Clean display of current month, day, and day-of-week abbreviation (e.g., `06/16 TUE`).
- 🔋 **Color-Coded Battery Gauge**:
  - Dynamically updates with battery percentage text.
  - Features a custom battery icon filled with a color-coded level bar:
    - 🟩 **Green** (>50%)
    - 🟧 **Orange** (21%–50%)
    - 🟥 **Red** (≤20%)
- 🎭 **Diagonal Gradient Overlay**: A custom-drawn gradient transparency overlay ensures text remains fully readable against bright background planet imagery.
- ⚡ **Auto-Refresh**: Time, date, and battery status update automatically every 60 seconds with low-energy state support when paused/inactive.

---

## Celestial Body Schedule

The background image changes automatically depending on the day of the week, roughly aligned with classical planet/day-of-week associations:

| Day of Week | Celestial Body | Asset Name | Source Description |
| :--- | :--- | :--- | :--- |
| **Monday** | Moon 🌙 | `moon.png` | Wikimedia / NASA Full Moon |
| **Tuesday** | Mars 🔴 | `mars.png` | Wikimedia / NASA True Color Mars |
| **Wednesday** | Mercury 🪨 | `mercury.png` | Wikimedia / NASA Messenger spacecraft edit |
| **Thursday** | Jupiter 🪐 | `jupiter.png` | Wikimedia / NASA Hubble Space Telescope |
| **Friday** | Venus 🌫️ | `venus.png` | Wikimedia / NASA Mariner 10 real color |
| **Saturday** | Saturn 🪐 | `saturn.png` | Wikimedia / NASA Cassini equinox view |
| **Sunday** | Sun ☀️ | `sun.png` | Wikimedia / NASA Solar Dynamics Observatory |

---

## Directory Structure

```filepath
planetary-watchface/
├── assets/
│   └── 480x480-amazfit-balance/    # Device assets (images and fonts)
│       ├── battery_icon.png        # Icon template
│       ├── gradient_overlay.png    # Diagonal dark overlay
│       ├── JetBrainsMono-Regular.ttf
│       ├── Orbitron.ttf
│       └── [planets].png           # Pre-rendered 480x480 planet images
├── scripts/
│   ├── download_planets.py         # Downloads planet images from Wikimedia API
│   ├── generate_battery_icon.py    # Draws the battery icon outline
│   ├── generate_gradient_overlay.py# Computes & generates diagonal transparency mask
│   └── generate_steps_icon.py      # Draws steps footprint icon
├── watchface/
│   └── index.js                    # Core logic and widget creation
├── app.js                          # Entry point (standard boilerplate)
├── app.json                        # Watch face configuration and permissions
├── CLAUDE.md                       # LLM developer guidelines & commands
├── package.json                    # Dev scripts and dependencies
└── README.md                       # This file!
```

---

## Prerequisites

- **Node.js** or **Bun** for running the Zeus CLI and managing packages.
- **Python 3.9+** and **uv** (recommended Python package installer/runner) for asset generation scripts.

---

## Getting Started

### 1. Install Dependencies

Clone this repository, then install developer dependencies:

```bash
# Using Bun (preferred)
bun install

# Or using npm
npm install
```

### 2. Download and Generate Assets

To download all high-resolution planet images from NASA via Wikimedia Commons, and to build the auxiliary graphics (gradient overlays, clock hands), run:

```bash
npm run download-assets
```
> [!NOTE]
> This command uses `uv` under the hood (`uv run scripts/download_planets.py`) to run the asset preparation script, resolving image URLs from the Wikipedia/Wikimedia API, center-cropping, and resizing them to `480×480` using Pillow.

### 3. Run Development Server (Hot-Reload)

To run the live preview and sideload the watch face to your Zepp OS Simulator or watch device, run:

```bash
npm run dev
```

This starts the Zeus CLI dev server, which will automatically bundle the watch face and reload when file changes are detected.

### 4. Build for Release

To package the watch face for distribution (generates a `.bin` file inside the `dist/` directory):

```bash
npm run build
```

---

## Zepp OS API Details

- **Widget API**: Built using coordinates in absolute pixels. Elements are aligned relative to a bounding box at `X = 400` (right margin).
- **Life Cycle**:
  - `onInit`: Renders static widgets, background images, and font mappings.
  - `onResume`: Performs immediate content updates and initiates a 60-second polling interval via `setInterval`.
  - `onPause`: Clears the time polling interval to prevent background battery drain.
- **Fonts**: Embeds and utilizes custom font file `JetBrainsMono-Regular.ttf` for high readability.

---

## License & Attributions

- All planetary images are downloaded from **NASA/ESA** public domain archives available on **Wikimedia Commons**.
- Developed under the Zepp OS SDK guidelines.
