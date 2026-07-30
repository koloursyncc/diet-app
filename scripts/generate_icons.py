"""Generates PWA icon assets for Daily Diet from vector shapes (no external art)."""
from PIL import Image, ImageDraw
import math
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT_DIR, exist_ok=True)

BG = (32, 41, 27)          # deep, near-black forest (dark ink) background for icon canvas
ACCENT = (140, 168, 122)   # sage leaf accent
CREAM = (251, 248, 242)    # warm ivory highlight


def rounded_square(size, radius_ratio, bg):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * radius_ratio)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=bg)
    return img, draw


def draw_leaf(draw, cx, cy, scale, color):
    """Two overlapping soft ellipses + a center vein line -> a simple leaf glyph."""
    w = scale * 0.62
    h = scale * 1.0
    # leaf body: a lens shape made of two circle intersections, approximated with a polygon
    points = []
    steps = 60
    for i in range(steps + 1):
        t = i / steps
        angle = math.pi * t
        x = cx - w / 2 * math.sin(angle)
        y = cy - h / 2 + h * t
        points.append((x, y))
    for i in range(steps + 1):
        t = i / steps
        angle = math.pi * t
        x = cx + w / 2 * math.sin(angle)
        y = cy + h / 2 - h * t
        points.append((x, y))
    draw.polygon(points, fill=color)

    # vein
    draw.line([(cx, cy - h / 2 + h * 0.08), (cx, cy + h / 2 - h * 0.10)], fill=BG, width=max(2, int(scale * 0.035)))


def make_icon(size, maskable=False, filename=None):
    safe_pad = 0.30 if maskable else 0.0
    canvas_radius_ratio = 0.5 if maskable else 0.22

    img, draw = rounded_square(size, canvas_radius_ratio, BG)

    cx, cy = size / 2, size / 2
    leaf_scale = size * (1 - safe_pad * 2) * 0.62
    draw_leaf(draw, cx, cy - leaf_scale * 0.02, leaf_scale, ACCENT)

    # small dot accent (echoes the progress-dot motif from the app)
    dot_r = max(2, size * 0.018)
    draw.ellipse(
        [cx - dot_r, cy + leaf_scale * 0.42 - dot_r, cx + dot_r, cy + leaf_scale * 0.42 + dot_r],
        fill=CREAM,
    )

    path = os.path.join(OUT_DIR, filename)
    img.save(path)
    print("wrote", path)


make_icon(192, maskable=False, filename="icon-192.png")
make_icon(512, maskable=False, filename="icon-512.png")
make_icon(192, maskable=True, filename="icon-maskable-192.png")
make_icon(512, maskable=True, filename="icon-maskable-512.png")
make_icon(180, maskable=False, filename="apple-touch-icon.png")
make_icon(32, maskable=False, filename="favicon-32.png")
make_icon(512, maskable=False, filename="splash-icon-512.png")
