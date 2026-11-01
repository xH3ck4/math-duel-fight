"""Brand assets from assets/logo-game.jpg (circular badge on a dark background).

- logo-game.png: badge cut out as a circle with a soft edge, transparent outside.
- icon.png: full square artwork (opaque, required for iOS app icons).
- adaptive-icon.png / splash-icon.png / snack-icon.png / favicon.png: from the cut-out badge.

Usage:
    npm run generate:brand            # images only
    py -3 scripts/process-brand-assets.py --video   # also re-encode splash video to 1080x1920
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SRC = ASSETS / "logo-game.jpg"
OUT_PNG = ASSETS / "logo-game.png"

# Badge geometry as a fraction of the source size, measured from the ring edges.
CENTER_X = 0.508
CENTER_Y = 0.49
RADIUS = 0.462
FEATHER = 0.006


def cut_circle(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    cx, cy, r = CENTER_X * w, CENTER_Y * h, RADIUS * min(w, h)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(FEATHER * min(w, h)))
    rgba.putalpha(mask)
    box = (int(cx - r - 4), int(cy - r - 4), int(cx + r + 4), int(cy + r + 4))
    return rgba.crop(box)


def fit_on_square(img: Image.Image, size: int, scale: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    copy = img.copy()
    target = int(size * scale)
    copy.thumbnail((target, target), Image.Resampling.LANCZOS)
    canvas.paste(copy, ((size - copy.width) // 2, (size - copy.height) // 2), copy)
    return canvas


def edge_color(img: Image.Image) -> str:
    """Average colour just outside the badge, for splash/adaptive backgrounds."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    samples = [rgb.getpixel((x, y)) for x, y in [(8, h // 2), (w - 8, h // 2), (w // 2, h - 8), (8, 8), (w - 8, h - 8)]]
    r, g, b = (sum(c[i] for c in samples) // len(samples) for i in range(3))
    return f"#{r:02X}{g:02X}{b:02X}"


def encode_video() -> None:
    import imageio_ffmpeg

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    backup = ASSETS / "splash-screen-video.original.mp4"
    final = ASSETS / "splash-screen-video.mp4"
    tmp = ASSETS / "splash-screen-video-9x16.mp4"
    if not backup.exists():
        shutil.copy2(final, backup)
    vf = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0F2A52,setsar=1"
    )
    subprocess.run(
        [ffmpeg, "-y", "-i", str(backup), "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(tmp)],
        check=True,
    )
    shutil.move(str(tmp), str(final))
    print("Wrote", final)


def main() -> None:
    raw = Image.open(SRC)
    print("Source", SRC, raw.size, "edge colour", edge_color(raw))

    badge = cut_circle(raw)
    display = badge.resize((1024, 1024), Image.Resampling.LANCZOS)
    display.save(OUT_PNG, "PNG", optimize=True)
    print("Wrote", OUT_PNG, display.size)

    square = raw.convert("RGB").resize((1024, 1024), Image.Resampling.LANCZOS)
    square.save(ASSETS / "icon.png", "PNG", optimize=True)
    print("Wrote", ASSETS / "icon.png", square.size)

    targets = {
        # Android masks adaptive icons to ~66% of the canvas; keep the badge inside that.
        "adaptive-icon.png": fit_on_square(badge, 1024, 0.66),
        "splash-icon.png": fit_on_square(badge, 512, 0.94),
        "snack-icon.png": fit_on_square(badge, 512, 0.94),
        "favicon.png": fit_on_square(badge, 64, 0.98),
    }
    for name, im in targets.items():
        im.save(ASSETS / name, "PNG", optimize=True)
        print("Wrote", ASSETS / name, im.size)

    if "--video" in sys.argv:
        encode_video()


if __name__ == "__main__":
    main()
