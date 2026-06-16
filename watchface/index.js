import { createWidget, widget, align, text_style, prop } from "@zos/ui";
import { Time, Battery } from "@zos/sensor";
import { setInterval, clearInterval } from "@zos/timer";

// ZeppOS week convention: 1=Monday … 6=Saturday, 7=Sunday
const PLANET_BY_DAY = {
  1: { day: "MON", file: "moon.png" },
  2: { day: "TUE", file: "mars.png" },
  3: { day: "WED", file: "mercury.png" },
  4: { day: "THU", file: "jupiter.png" },
  5: { day: "FRI", file: "venus.png" },
  6: { day: "SAT", file: "saturn.png" },
  7: { day: "SUN", file: "sun.png" },
};

const W = 480;
const H = 480;
const RIGHT_X = 400; // Right alignment boundary for the right-triangle layout

const time = new Time();
const battery = new Battery();

let bgWidget = null;
let currentPlanetFile = "";
let batteryOutline = null;
let batteryMask = null;
let batteryCap = null;
let batteryLevelRect = null;
let batteryText = null;
let dateDayText = null;
let timeText = null;
let timerId = null;

function pad(n) {
  return String(n).padStart(2, "0");
}

function getPlanet() {
  return PLANET_BY_DAY[time.getDay()] || PLANET_BY_DAY[7];
}

function getTimeStr() {
  return `${pad(time.getHours())}:${pad(time.getMinutes())}`;
}

function getDateDayStr() {
  const planet = getPlanet()
  return `${pad(time.getMonth())}/${pad(time.getDate())} ${planet.day}`
}

function updateWatchFace() {
  const planet = getPlanet();
  if (bgWidget && currentPlanetFile !== planet.file) {
    bgWidget.setProperty(prop.MORE, { src: planet.file });
    currentPlanetFile = planet.file;
  }

  if (timeText) {
    timeText.setProperty(prop.TEXT, getTimeStr());
  }
  if (dateDayText) {
    dateDayText.setProperty(prop.TEXT, getDateDayStr());
  }

  const pct = battery.getCurrent();
  const pctStr = `${pct}%`;
  if (batteryText) {
    batteryText.setProperty(prop.TEXT, pctStr);
  }

  if (batteryOutline && batteryMask && batteryCap && batteryLevelRect) {
    const charWidth = 12;
    const textWidth = pctStr.length * charWidth;
    const iconX = RIGHT_X - textWidth - 36; // 20px battery width + 16px gap

    batteryOutline.setProperty(prop.MORE, { x: iconX });
    batteryMask.setProperty(prop.MORE, { x: iconX + 2 });
    batteryCap.setProperty(prop.MORE, { x: iconX + 18 });

    const maxBarWidth = 14;
    const barWidth = Math.round(maxBarWidth * (pct / 100));
    const finalBarWidth = pct > 0 ? Math.max(1, barWidth) : 0;

    let barColor = 0x34c759; // Green
    if (pct <= 20) {
      barColor = 0xff3b30; // Red
    } else if (pct <= 50) {
      barColor = 0xff9500; // Orange
    }

    batteryLevelRect.setProperty(prop.MORE, {
      x: iconX + 2,
      w: finalBarWidth,
      color: barColor,
    });
  }
}

WatchFace({
  onInit() {
    const planet = getPlanet();
    currentPlanetFile = planet.file;

    // Full-screen planet photo
    bgWidget = createWidget(widget.IMG, {
      x: 0,
      y: 0,
      w: W,
      h: H,
      src: planet.file,
    });

    // Gradient overlay from top-left (transparent) to bottom-right (black)
    createWidget(widget.IMG, {
      x: 0,
      y: 0,
      w: W,
      h: H,
      src: "gradient_overlay.png",
    });

    // Line 1: Battery Outline Frame (Grey rectangle)
    batteryOutline = createWidget(widget.FILL_RECT, {
      x: RIGHT_X - 62,
      y: 286,
      w: 18,
      h: 12,
      radius: 2,
      color: 0xaaaaaa,
    });

    // Line 1: Battery Inner Mask
    batteryMask = createWidget(widget.FILL_RECT, {
      x: RIGHT_X - 60,
      y: 288,
      w: 14,
      h: 8,
      color: 0x000000,
    });

    // Line 1: Battery Terminal Cap
    batteryCap = createWidget(widget.FILL_RECT, {
      x: RIGHT_X - 44,
      y: 289,
      w: 2,
      h: 6,
      radius: 1,
      color: 0xaaaaaa,
    });

    // Line 1: Battery Level Fill Gauge
    batteryLevelRect = createWidget(widget.FILL_RECT, {
      x: RIGHT_X - 60,
      y: 288,
      w: 14,
      h: 8,
      color: 0x34c759,
    });

    // Line 1: Battery percent text (right-aligned to RIGHT_X)
    batteryText = createWidget(widget.TEXT, {
      x: RIGHT_X - 200,
      y: 280,
      w: 200,
      h: 24,
      color: 0xffffff,
      text_size: 20,
      font: "JetBrainsMono-Regular.ttf",
      align_h: align.RIGHT,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `${battery.getCurrent()}%`,
    });

    // Line 2: mm/dd  day (right-aligned to RIGHT_X)
    dateDayText = createWidget(widget.TEXT, {
      x: RIGHT_X - 200,
      y: 312,
      w: 200,
      h: 30,
      color: 0xffffff,
      text_size: 24,
      font: "JetBrainsMono-Regular.ttf",
      align_h: align.RIGHT,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: getDateDayStr(),
    });

    // Line 3: hh:mm (large, right-aligned to RIGHT_X)
    timeText = createWidget(widget.TEXT, {
      x: RIGHT_X - 200,
      y: 350,
      w: 200,
      h: 65,
      color: 0xffffff,
      text_size: 64,
      font: "JetBrainsMono-Regular.ttf",
      align_h: align.RIGHT,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: getTimeStr(),
    });
  },

  onResume() {
    updateWatchFace();

    timerId = setInterval(() => {
      updateWatchFace();
    }, 60000);
  },

  onPause() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  },
});
