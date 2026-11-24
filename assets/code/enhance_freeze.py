#!/usr/bin/env python3
"""Reusable mild denoise/upscale/sharpen for a selected teaching frame."""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
args.output.parent.mkdir(parents=True, exist_ok=True)
subprocess.run([
    'ffmpeg', '-y', '-loglevel', 'error', '-i', str(args.source),
    '-vf', 'hqdn3d=1.2:1.2:3:3,scale=iw*2:ih*2:flags=lanczos,'
           'cas=strength=0.35,unsharp=5:5:0.45:3:3:0,scale=iw/2:ih/2:flags=lanczos',
    '-frames:v', '1', str(args.output),
], check=True)
