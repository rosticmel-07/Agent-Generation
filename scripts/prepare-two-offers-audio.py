"""Preserve the source MP3; create a separate mix WAV with unchanged timing."""
from pathlib import Path
import json
import re
import subprocess

root = Path(__file__).resolve().parent.parent
source = root / 'public/audio/voiceover-two-offers.mp3'
target = root / 'public/audio/voiceover-two-offers-mix.wav'
measure = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(source),
    '-af', 'loudnorm=I=-17:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'],
    capture_output=True, text=True, check=True)
stats = json.loads(re.findall(r'\{[^{}]+\}', measure.stderr)[-1])
filter_value = ('loudnorm=I=-17:TP=-2:LRA=11:'
    f"measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:"
    f"measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:"
    f"offset={stats['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
    '-af', filter_value, '-ar', '48000', '-c:a', 'pcm_s24le', str(target)], check=True)
(root / 'data/two-offers-audio-processing.json').write_text(json.dumps({
    'source': str(source.relative_to(root)), 'output': str(target.relative_to(root)),
    'method': 'FFmpeg two-pass loudnorm; separate 24-bit/48 kHz mono WAV',
    'voice_time_stretch': False, 'voice_pitch_shift': False,
    'source_measurements': stats, 'filter': filter_value,
}, ensure_ascii=False, indent=2) + '\n')
print(f"Prepared mix voice: source {stats['input_i']} LUFS / {stats['input_tp']} dBTP", flush=True)
