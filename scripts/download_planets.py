#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["Pillow", "requests"]
# ///
"""
Download and prepare NASA planet images for the Planetary Watch Face.
All images are NASA public domain works via Wikimedia Commons.

Usage:
    uv run scripts/download_planets.py
"""

import os
import sys
import requests
from PIL import Image, ImageDraw
from io import BytesIO

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', '480x480-amazfit-balance')
SIZE = (480, 480)

# Wikimedia Commons filenames — all NASA/ESA public domain images
PLANET_FILES = {
    'sun':     "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg",
    'moon':    'FullMoon2010.jpg',
    'mars':    'OSIRIS_Mars_true_color.jpg',
    'mercury': 'Mercury_in_color_-_Prockter07-edit1.jpg',
    'jupiter': 'Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    'venus':   'Venus-real_color.jpg',
    'saturn':  'Saturn_during_Equinox.jpg',
}


HEADERS = {'User-Agent': 'planetary-watchface/1.0 (taira.u.1009@gmail.com) requests/2'}


def get_commons_url(filename: str) -> str:
    """Resolve a Wikimedia Commons filename to its full-resolution direct URL."""
    r = requests.get(
        'https://en.wikipedia.org/w/api.php',
        params={
            'action': 'query',
            'prop': 'imageinfo',
            'iiprop': 'url',
            'titles': f'File:{filename}',
            'format': 'json',
        },
        headers=HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    pages = r.json()['query']['pages']
    page = next(iter(pages.values()))
    return page['imageinfo'][0]['url']


def download_and_resize(name: str, commons_filename: str) -> None:
    print(f'[{name}] resolving URL...')
    url = get_commons_url(commons_filename)

    print(f'[{name}] downloading...')
    r = requests.get(url, headers=HEADERS, timeout=120)
    r.raise_for_status()

    img = Image.open(BytesIO(r.content)).convert('RGB')

    # Center-crop to square, then resize to 480×480
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    img = img.resize(SIZE, Image.LANCZOS)

    out_path = os.path.join(OUT_DIR, f'{name}.png')
    img.save(out_path, 'PNG', optimize=True)
    print(f'[{name}] saved → {out_path}')


def generate_hand_images(out_dir: str) -> None:
    """Generate clock hand and center-dot PNGs locally (no network needed)."""
    # (filename, width_px, length_px, tail_px, alpha)
    hands = [
        ('hour_hand.png',   10, 90,  15, 230),
        ('minute_hand.png',  6, 125, 15, 210),
    ]
    for filename, w, length, tail, alpha in hands:
        img_h = length + tail
        img = Image.new('RGBA', (w, img_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([(0, 0), (w - 1, img_h - 1)], radius=w // 2,
                               fill=(255, 255, 255, alpha))
        img.save(os.path.join(out_dir, filename), 'PNG')
        print(f'[hands] generated {filename}')

    # Center dot — 16×16 white circle
    dot = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    ImageDraw.Draw(dot).ellipse([(0, 0), (15, 15)], fill=(255, 255, 255, 255))
    dot.save(os.path.join(out_dir, 'center_dot.png'), 'PNG')
    print('[hands] generated center_dot.png')


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    errors = []

    for planet, filename in PLANET_FILES.items():
        try:
            download_and_resize(planet, filename)
        except Exception as exc:
            print(f'[{planet}] ERROR: {exc}', file=sys.stderr)
            errors.append(planet)

    generate_hand_images(OUT_DIR)

    print()
    if errors:
        print(f'Failed: {", ".join(errors)}. Check your internet connection or replace those image filenames in the script.')
        sys.exit(1)
    else:
        print('All images ready. Run `npm run dev` to test the watch face.')
