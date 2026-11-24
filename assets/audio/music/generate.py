#!/usr/bin/env python3
"""Create a quiet, seamless 16-second dark D-minor bed for technique chapters."""
from pathlib import Path
import numpy as np
import soundfile as sf

sr, duration = 48000, 16
t = np.arange(sr * duration, dtype=np.float64) / sr
# Integer cycles over 16 seconds keep the endpoints phase-aligned for looping.
notes = [(73.4375, .0060), (110.0, .0036), (146.8125, .0025), (174.625, .0017)]
breath = .82 + .18 * np.cos(2 * np.pi * .125 * t)
pad = sum(amp * np.sin(2 * np.pi * hz * t) for hz, amp in notes) * breath
pad += .0008 * np.sin(2 * np.pi * 55 * t) * (1 + np.cos(2 * np.pi * .5 * t)) / 2
left = pad.astype(np.float32)
right = np.roll(left, 240)
out = np.stack([left, right], 1)
sf.write(Path(__file__).with_name('bed-teknik-dm-loop-16s.wav'), out, sr, subtype='PCM_24')
print('created 16-second seamless Juara Silat technique bed')
