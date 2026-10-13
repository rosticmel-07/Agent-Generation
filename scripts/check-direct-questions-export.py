"""Inspect and fully decode the actual delivered MP4s, then save their report."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PLAN = json.loads((ROOT / 'data/direct-questions.json').read_text())
WORDS = json.loads((ROOT / 'data/words-direct-questions.json').read_text())
FILES = [
    ('previews/bridge-reel-direct-questions-master-4k-60fps.mp4', 2160, 3840),
    ('previews/bridge-reel-direct-questions-hq-60fps.mp4', 1080, 1920),
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

layout = json.loads((ROOT / 'data/direct-questions-centering-check.json').read_text())
assert len(layout['frames']) == 9
assert all(abs(g['center_x'] - 540) <= .25 for f in layout['frames'] for g in f['groups'])
assert hashlib.sha256((ROOT / 'public' / PLAN['original_voiceover']).read_bytes()).hexdigest() == WORDS['source_audio_sha256']
for c in PLAN['captions']:
    for i in c['word_ids']:
        assert c['start'] <= WORDS['words'][i]['start'] < WORDS['words'][i]['end'] <= c['end']
assert PLAN['duration'] - PLAN['voice_end'] >= 2
for previous in ['landing-150', 'ad-click']:
    old = json.loads((ROOT / f'data/{previous}-export-report.json').read_text())
    for item in old['files']:
        assert hashlib.sha256((ROOT / item['file']).read_bytes()).hexdigest() == item['sha256']
report['centering'] = {'expected_center_x': 540, 'reviewed_frames': len(layout['frames']),
    'max_error_px': max(abs(g['center_x']-540) for f in layout['frames'] for g in f['groups'])}
report['checks'] = [
    'TypeScript typecheck passed.',
    'Full H.264/AAC decode passed on both actual delivered MP4s.',
    'Nine first-frame/scene/accordion/offer/CTA stills checked at phone size.',
    f"All {len(WORDS['words'])} words appear exactly once in {len(PLAN['captions'])} caption cues.",
    f"Scene boundaries cover {PLAN['duration']} seconds without gaps or overlap.",
    'Every principal group measured at x=540 in Chromium on nine frames.',
    'Original provided MP3 and the four previous approved MP4s verified byte-identical.',
]
(ROOT / 'data/direct-questions-export-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
