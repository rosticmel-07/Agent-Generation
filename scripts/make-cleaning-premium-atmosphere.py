"""Original quiet stereo pad and short interface sounds; Python stdlib only.

The approved voiceover is never read or rewritten. The generated WAV is a
separate layer, so its volume can be changed or muted in the composition.
"""
from array import array
import argparse
import json
from pathlib import Path
import math
import random
import wave

RATE = 48000
plan=json.loads((Path(__file__).resolve().parent.parent/'data/cleaning-premium.json').read_text())
DURATION = plan['duration'] if plan else 25
COUNT = round(RATE * DURATION)
left = array('f', [0.0]) * COUNT
right = array('f', [0.0]) * COUNT
rng = random.Random(37)

def ramp(value):
    return .5 - .5 * math.cos(math.pi * max(0, min(1, value)))

# Slow chord changes, no lead melody or percussion under the narration.
sections = [
    (0, 10.0, [110.0, 164.81, 246.94, 261.63]),
    (8.26, 19.5, [87.31, 130.81, 164.81, 196.0]),
    (17.04, 25.0, [130.81, 196.0, 246.94, 293.66]),
]
sections=[(0,7.0,[110.,164.81,220.,293.66]),(5.8,14.0,[98.,146.83,196.,261.63]),(12.0,DURATION,[130.81,196.,246.94,329.63])]
for start, end, notes in sections:
    for frequency in notes:
        phase_offset = rng.uniform(0, math.tau)
        for i in range(round(start * RATE), min(COUNT, round(end * RATE))):
            t = i / RATE
            envelope = ramp((t - start) / 1.6) * ramp((end - t) / 1.5)
            envelope *= (.93 + .07 * math.sin(math.tau * .09 * t)) / len(notes)
            phase = math.tau * frequency * t + phase_offset
            side = math.tau * (frequency + .17) * t + phase_offset + .2
            left[i] += envelope * (math.sin(phase) + .12 * math.sin(2 * phase))
            right[i] += envelope * (math.sin(side) + .12 * math.sin(2 * side))

rms = math.sqrt(sum(a * a + b * b for a, b in zip(left, right)) / (2 * COUNT))
gain = .009 / rms
for i in range(COUNT):
    left[i] *= gain
    right[i] *= gain

# Light taps on the three answers, form opening and final CTA.
landing_taps=[.7,1.6,3.65,4.05,4.45,4.95,6.65,8.5,10.8,17.1]
for at in (landing_taps if plan else [9.84, 11.16, 12.34, 16.24, 19.36]):
    start = round(at * RATE)
    for j in range(round(.09 * RATE)):
        if start + j >= COUNT:
            break
        t = j / RATE
        value = .015 * math.exp(-t * 70) * (math.sin(math.tau * 780 * t) + .15 * rng.uniform(-1, 1))
        left[start + j] += value
        right[start + j] += value

# A soft, filtered sweep as the cards become a website.
start = round((plan['scenes'][2]['start'] if plan else 13.66) * RATE)
noise = 0.0
for j in range(round(.35 * RATE)):
    noise = .87 * noise + .13 * rng.uniform(-1, 1)
    value = .025 * noise * math.sin(math.pi * j / (.35 * RATE)) ** 2
    left[start + j] += value
    right[start + j] += value

samples = array('h')
peak = 0.0
for a, b in zip(left, right):
    peak = max(peak, abs(a), abs(b))
    samples.extend([round(max(-1, min(1, a)) * 32767), round(max(-1, min(1, b)) * 32767)])
assert peak < .06, peak
filename='atmosphere-cleaning-premium.wav'
target = Path(__file__).resolve().parent.parent / 'public/audio' / filename
with wave.open(str(target), 'wb') as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(samples.tobytes())
print(f'{target}: {DURATION}s, peak {20 * math.log10(peak):.1f} dBFS')
