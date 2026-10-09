"""Original quiet stereo pad and short interface sounds; Python stdlib only.

The approved voiceover is never read or rewritten. The generated WAV is a
separate layer, so its volume can be changed or muted in the composition.
"""
from array import array
import argparse
from pathlib import Path
import math
import random
import wave

parser = argparse.ArgumentParser()
parser.add_argument('--landing-150', action='store_true')
args = parser.parse_args()
RATE = 48000
DURATION = 22 if args.landing_150 else 25
COUNT = RATE * DURATION
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
if args.landing_150:
    sections = [(0, 8.0, [110.0, 164.81, 246.94, 261.63]),
                (6.0, 16.0, [87.31, 130.81, 164.81, 196.0]),
                (14.0, 22.0, [130.81, 196.0, 246.94, 293.66])]
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
for at in ([6.3, 6.47, 6.63, 6.8, 18.0] if args.landing_150 else [9.84, 11.16, 12.34, 16.24, 19.36]):
    start = round(at * RATE)
    for j in range(round(.09 * RATE)):
        if start + j >= COUNT:
            break
        t = j / RATE
        value = .015 * math.exp(-t * 70) * (math.sin(math.tau * 780 * t) + .15 * rng.uniform(-1, 1))
        left[start + j] += value
        right[start + j] += value

# A soft, filtered sweep as the cards become a website.
start = round((6.0 if args.landing_150 else 13.66) * RATE)
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
target = Path(__file__).resolve().parent.parent / 'public/audio' / ('atmosphere-150.wav' if args.landing_150 else 'atmosphere-v2.wav')
with wave.open(str(target), 'wb') as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(samples.tobytes())
print(f'{target}: {DURATION}s, peak {20 * math.log10(peak):.1f} dBFS')
