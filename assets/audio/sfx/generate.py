#!/usr/bin/env python3
"""Reusable Juara Silat UI and telestrator one-shots, based on Azrul's mixer."""
import os
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

LIB = Path(os.environ.get('LEMO_OPUSCAR', Path.home() / 'lemo-opuscar'))
sys.path.insert(0, str(LIB))
from core.audio.sfx import SR, bp, noise, t_, norm, pop, click, thump  # noqa: E402

OUT = Path(__file__).resolve().parent
np.random.seed(3)


def swish(d=.22, lo=1800, hi=7000, up=True):
    t = t_(d)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6
    sweep = t / d if up else 1 - t / d
    return (norm(bp(noise(d), lo, hi) * env * (.55 + .45 * sweep)) * .5).astype(np.float32)


def shimmer(d=.75):
    t = t_(d)
    f = 2200 + 2600 * (t / d) ** 1.5
    phase = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(phase) * (.5 + .5 * np.sin(2 * np.pi * 18 * t)) * np.sin(np.pi * t / d) ** 2
    y += bp(noise(d), 4000, 9000) * .3 * np.sin(np.pi * t / d)
    return (norm(y) * .25).astype(np.float32)


def chime(d=1.1, gap=.09):
    notes = (1318.5, 1975.5)
    y = np.zeros(int((d + gap * len(notes)) * SR), np.float32)
    for i, f in enumerate(notes):
        t = t_(d)
        b = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .12)) * np.exp(-t / .32)
        start = int(i * gap * SR)
        y[start:start + len(b)] += (b * (.9 if i else .7)).astype(np.float32)
    return (norm(y) * .5).astype(np.float32)


def marker(d=.3):
    t = t_(d)
    y = bp(noise(d), 900, 3800) * (1 + .35 * np.sin(2 * np.pi * 31 * t))
    env = np.minimum(1, t / .03) * np.minimum(1, (d - t) / .08)
    return (norm(y * env) * .45).astype(np.float32)


def save(name, signal):
    sf.write(OUT / name, np.asarray(signal, dtype=np.float32) * .7, SR, subtype='PCM_24')


save('cta-avatar-swish.wav', swish(.32, 900, 5000) * .45)
save('cta-avatar-pop.wav', pop(.8) * .5)
save('cta-ring-shimmer.wav', shimmer(.75) * .55)
save('cta-button-pop.wav', pop(.6) * .38)
save('cta-badge-pop.wav', pop(.9) * .35)
save('cta-chip-swish.wav', swish(.18, 3000, 9000) * .3)
save('cta-chip-click.wav', click(2.4, .4) * .2)
tap_click = click(2.2, .9) * .6
tap_thump = thump(.5, 120) * .3
tap = np.zeros(max(len(tap_click), len(tap_thump)), np.float32)
tap[:len(tap_click)] += tap_click
tap[:len(tap_thump)] += tap_thump
save('cta-follow-tap.wav', tap)
save('cta-following-chime.wav', chime() * .7)
save('marker-stroke.wav', marker(.3) * .5)
save('freeze-thump.wav', thump(.7, 58) * .45)
print('wrote reusable one-shots to', OUT)
