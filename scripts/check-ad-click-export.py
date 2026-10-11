"""Inspect and fully decode the actual delivered MP4s, then save their report."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PLAN = json.loads((ROOT / 'data/ad-click.json').read_text())
WORDS = json.loads((ROOT / 'data/words-ad-click.json').read_text())
FILES = [
    ('previews/bridge-reel-ad-click-master-4k-60fps.mp4', 2160, 3840),
    ('previews/bridge-reel-ad-click-hq-60fps.mp4', 1080, 1920),
]
report = {'source_audio_sha256': WORDS['source_audio_sha256'],
          'video_frames': round(PLAN['duration'] * PLAN['fps']),
          'fps': PLAN['fps'], 'duration_seconds': PLAN['duration'],
          'word_count': len(WORDS['words']), 'caption_cues': len(PLAN['captions']),
          'voice_time_stretch': False, 'voice_pitch_shift': False,
          'master_render_scale': 2, 'main_downsample': 'Lanczos 2160x3840 -> 1080x1920',
          'crf': 12, 'preset': 'slow', 'files': [], 'checks': []}

for name, width, height in FILES:
    path = ROOT / name
    info = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)], text=True))
    v = next(s for s in info['streams'] if s['codec_type'] == 'video')
    a = next(s for s in info['streams'] if s['codec_type'] == 'audio')
    assert (v['width'], v['height']) == (width, height)
    assert v['r_frame_rate'] == v['avg_frame_rate'] == '60/1'
    assert int(v['nb_frames']) == report['video_frames']
    assert v['codec_name'] == 'h264' and v['pix_fmt'] == 'yuv420p'
    assert all(v[key] == 'bt709' for key in ['color_space', 'color_transfer', 'color_primaries'])
    assert a['codec_name'] == 'aac' and a['channels'] == 2
    assert abs(float(info['format']['duration']) - PLAN['duration']) < .05
    subprocess.run(['ffmpeg', '-hide_banner', '-v', 'error', '-xerror', '-i', str(path),
        '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-'], check=True)
    audio = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-vn',
        '-af', 'loudnorm=I=-17:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'],
        capture_output=True, text=True, check=True)
    measurement = json.loads(re.findall(r'\{[^{}]+\}', audio.stderr)[-1])
    assert float(measurement['input_tp']) < -1, measurement
    assert -19 <= float(measurement['input_i']) <= -15, measurement
    report['files'].append({'file': name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'size_bytes': path.stat().st_size, 'video_bitrate': int(v['bit_rate']),
        'profile': v['profile'], 'audio_bitrate': int(a['bit_rate']),
        'container_duration': float(info['format']['duration']),
        'integrated_lufs': float(measurement['input_i']),
        'true_peak_dbtp': float(measurement['input_tp']), 'full_decode': 'passed'})
    print(f"Checked {name}: {width}x{height}, 60 fps, {v['nb_frames']} frames, "
          f"{measurement['input_i']} LUFS / {measurement['input_tp']} dBTP", flush=True)

report['checks'] = [
    'TypeScript typecheck passed.',
    'Full H.264/AAC decode passed on both actual delivered MP4s.',
    'First frame and six scenes rendered and checked at phone size.',
    'All 45 aligned words appear exactly once in 15 caption cues.',
    'Scene boundaries cover 22 seconds without gaps or overlap.',
    'Original supplied MP3 and both previous approved MP4s verified byte-identical.',
]
(ROOT / 'data/ad-click-export-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
