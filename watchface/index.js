import { createWidget, widget, align, text_style, prop } from '@zos/ui'
import { Time } from '@zos/sensor'
import { setInterval, clearInterval } from '@zos/timer'

// ZeppOS week convention: 1=Monday … 6=Saturday, 7=Sunday
// Etymology: Moon-day, Mars-day (Tyr), Mercury-day (Woden),
//            Jupiter-day (Thor), Venus-day (Frigg), Saturn-day, Sun-day
const PLANET_BY_DAY = {
  1: { day: 'MON', file: 'moon.png' },
  2: { day: 'TUE', file: 'mars.png' },
  3: { day: 'WED', file: 'mercury.png' },
  4: { day: 'THU', file: 'jupiter.png' },
  5: { day: 'FRI', file: 'venus.png' },
  6: { day: 'SAT', file: 'saturn.png' },
  7: { day: 'SUN', file: 'sun.png' },
}

const W = 480
const H = 480
const CX = W / 2
const CY = H / 2

// Hour hand: 10 px wide, 90 px above center, 15 px tail  → image 10×105
const HOUR_W = 10, HOUR_LEN = 90, HOUR_TAIL = 15
// Minute hand: 6 px wide, 125 px above center, 15 px tail → image 6×140
const MIN_W = 6, MIN_LEN = 125, MIN_TAIL = 15

const time = new Time()
let timeText = null
let hourHand = null
let minuteHand = null
let timerId = null

function pad(n) {
  return String(n).padStart(2, '0')
}

function getTimeStr() {
  return `${pad(time.getHours())}:${pad(time.getMinutes())}`
}

function getDateStr() {
  return `${time.getFullYear()}/${pad(time.getMonth())}/${pad(time.getDate())}`
}

function getHourAngle() {
  return (time.getHours() % 12) * 30 + time.getMinutes() * 0.5
}

function getMinuteAngle() {
  return time.getMinutes() * 6
}

WatchFace({
  onInit() {
    const planet = PLANET_BY_DAY[time.getDay()] || PLANET_BY_DAY[7]

    // Full-screen planet photo
    createWidget(widget.IMG, {
      x: 0,
      y: 0,
      w: W,
      h: H,
      src: planet.file,
    })

    // Semi-transparent scrim at bottom for text legibility
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 330,
      w: W,
      h: 150,
      color: 0x000000,
      alpha: 180,
    })

    // Planet name — top of screen
    createWidget(widget.TEXT, {
      x: 0,
      y: 22,
      w: W,
      h: 46,
      color: 0xFFFFFF,
      text_size: 26,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: planet.day,
    })

    // Time — large, inside scrim
    timeText = createWidget(widget.TEXT, {
      x: 0,
      y: 340,
      w: W,
      h: 86,
      color: 0xFFFFFF,
      text_size: 68,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: getTimeStr(),
    })

    // Date — below time
    createWidget(widget.TEXT, {
      x: 0,
      y: 428,
      w: W,
      h: 36,
      color: 0xBBBBBB,
      text_size: 20,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: getDateStr(),
    })

    // Hour hand — rendered last so it sits above planet image
    hourHand = createWidget(widget.IMG, {
      x: 0, y: 0, w: W, h: H,
      pos_x: CX - HOUR_W / 2,
      pos_y: CY - HOUR_LEN,
      center_x: CX,
      center_y: CY,
      src: 'hour_hand.png',
      angle: getHourAngle(),
    })

    // Minute hand
    minuteHand = createWidget(widget.IMG, {
      x: 0, y: 0, w: W, h: H,
      pos_x: CX - MIN_W / 2,
      pos_y: CY - MIN_LEN,
      center_x: CX,
      center_y: CY,
      src: 'minute_hand.png',
      angle: getMinuteAngle(),
    })

    // Center cap
    createWidget(widget.IMG, {
      x: CX - 8,
      y: CY - 8,
      src: 'center_dot.png',
    })
  },

  onResume() {
    if (timeText) timeText.setProperty(prop.TEXT, getTimeStr())
    if (hourHand) hourHand.setProperty(prop.MORE, { angle: getHourAngle() })
    if (minuteHand) minuteHand.setProperty(prop.MORE, { angle: getMinuteAngle() })

    timerId = setInterval(() => {
      if (timeText) timeText.setProperty(prop.TEXT, getTimeStr())
      if (hourHand) hourHand.setProperty(prop.MORE, { angle: getHourAngle() })
      if (minuteHand) minuteHand.setProperty(prop.MORE, { angle: getMinuteAngle() })
    }, 60000)
  },

  onPause() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  },
})
