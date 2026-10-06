"""Convert logo to transparent PNG, generate Expo icons, remux splash video to 9:16."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw
import imageio_ffmpeg
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SRC = ASSETS / "logo-game.jpg"
OUT_PNG = ASSETS / "logo-game.png"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def flood_transparent(img: Image.Image, threshold: int = 245) -> Image.Image:
    """Remove near-white background via flood fill from edges (keeps white inside logo)."""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    def is_bg(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        if a == 0:
            return False
        return r >= threshold and g >= threshold and b >= threshold

    visited = [[False] * h for _ in range(w)]
    stack: list[tuple[int, int]] = []

    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))

    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or visited[x][y]:
            continue
        visited[x][y] = True
        if not is_bg(x, y):
            continue
        pixels[x, y] = (0, 0, 0, 0)
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return rgba


def trim_alpha(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(img.width, r + pad)
    b = min(img.height, b + pad)
    return img.crop((l, t, r, b))


def fit_on_square(img: Image.Image, size: int, scale: float = 0.86) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target = int(size * scale)
    copy = img.copy()
    copy.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - copy.width) // 2
    y = (size - copy.height) // 2
    canvas.paste(copy, (x, y), copy)
    return canvas


def main() -> None:
    print("Loading", SRC)
    raw = Image.open(SRC)
    transparent = flood_transparent(raw, threshold=242)
    transparent = trim_alpha(transparent, pad=12)
    transparent.save(OUT_PNG, "PNG", optimize=True)
    print("Wrote", OUT_PNG, transparent.size)

    # Master high-res square for Expo icons
    icon_1024 = fit_on_square(transparent, 1024, scale=0.88)
    adaptive = fit_on_square(transparent, 1024, scale=0.72)  # safe zone for adaptive

    targets = {
        "icon.png": icon_1024,
        "adaptive-icon.png": adaptive,
        "splash-icon.png": fit_on_square(transparent, 512, scale=0.9),
        "snack-icon.png": fit_on_square(transparent, 512, scale=0.88),
        "favicon.png": fit_on_square(transparent, 48, scale=0.92),
    }
    for name, im in targets.items():
        path = ASSETS / name
        im.save(path, "PNG", optimize=True)
        print("Wrote", path, im.size)

    # Keep a backup jpg reference but UI should use png
    video_in = ASSETS / "splash-screen-video.mp4"
    video_out = ASSETS / "splash-screen-video-9x16.mp4"
    video_final = ASSETS / "splash-screen-video.mp4"
    backup = ASSETS / "splash-screen-video.original.mp4"

    if not backup.exists():
        shutil.copy2(video_in, backup)
        print("Backup video ->", backup)

    # Scale to fit inside 1080x1920, pad with brand navy
    vf = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0F2A52,"
        "setsar=1"
    )
    cmd = [
        FFMPEG,
        "-y",
        "-i",
        str(backup if backup.exists() else video_in),
        "-vf",
        vf,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "baseline",
        "-level",
        "3.1",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        str(video_out),
    ]
    print("Encoding video 1080x1920...")
    subprocess.run(cmd, check=True)
    shutil.move(str(video_out), str(video_final))
    print("Wrote", video_final)


if __name__ == "__main__":
    main()
