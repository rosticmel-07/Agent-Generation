"""Measure and fully decode both delivered cleaning MP4s; preserve older campaigns."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PLAN = json.loads((ROOT / 'data/cleaning.json').read_text())
WORDS = json.loads((ROOT / 'data/words-cleaning.json').read_text())
FILES = [
    ('previews/bridge-reel-cleaning-master-4k-60fps.mp4', 2160, 3840),
    ('previews/bridge-reel-cleaning-hq-60fps.mp4', 1080, 1920),
]

assert PLAN['fps'] == 60
assert len(PLAN['scenes']) == 5
assert PLAN['scenes'][0]['start'] == 0 and PLAN['scenes'][-1]['end'] == PLAN['duration']
for index, scene in enumerate(PLAN['scenes']):
    assert scene['end'] > scene['start']
    if index:
        assert abs(scene['start'] - PLAN['scenes'][index - 1]['end']) < 1e-6
assert abs(PLAN['scenes'][-1]['end'] - PLAN['scenes'][-1]['start'] - 3) < 1e-6
assert 0 < PLAN['voice_end'] <= PLAN['duration']
assert all(0 <= word['start'] < word['end'] <= PLAN['duration'] for word in WORDS['words'])
captioned_ids = []
for cue in PLAN['captions']:
    assert 0 <= cue['start'] < cue['end'] <= PLAN['duration']
    assert cue.get('text') or cue.get('word_ids')
    for index in cue.get('word_ids', []):
        assert isinstance(index, int) and 0 <= index < len(WORDS['words'])
        word = WORDS['words'][index]
        assert cue['start'] - 1e-6 <= word['start'] < word['end'] <= cue['end'] + 1e-6
        captioned_ids.append(index)
assert hashlib.sha256((ROOT / 'public' / PLAN['original_voiceover']).read_bytes()).hexdigest() == WORDS['source_audio_sha256']

layout = json.loads((ROOT / 'data/cleaning-layout-check.json').read_text())
assert len(layout['frames']) == 8
for frame in layout['frames']:
    assert frame['oswald_loaded'] and frame['groups']
    for group in frame['groups']:
        assert abs(group['center_x'] - 540) <= .5
        assert group['left'] >= 159 and group['right'] <= 921 and group['bottom'] <= 1601
    for price in frame['prices']:
        assert price['width_px'] <= price['available_px'] + 1 and price['font'].startswith('Oswald')

report = {
    'source_audio_sha256': WORDS['source_audio_sha256'],
    'video_frames': round(PLAN['duration'] * PLAN['fps']), 'fps': PLAN['fps'],
    'duration_seconds': PLAN['duration'], 'final_scene_seconds': 3,
    'word_count': len(WORDS['words']), 'caption_cues': len(PLAN['captions']),
    'captioned_word_count': len(set(captioned_ids)),
    'caption_strategy': 'Short synchronous phrases complement the on-screen headings; full transcript coverage is not required.',
    'voice_time_stretch': False, 'voice_pitch_shift': False,
    'master_render_scale': 2, 'main_downsample': 'Lanczos 2160x3840 -> 1080x1920',
    'crf': 12, 'preset': 'slow', 'typography': 'Oswald 700 display / Manrope 700 body and captions',
    'illustration_context': 'Demonstration of a cleaning-service page; no fictional cleaning prices, testimonials or performance claims.',
    'files': [], 'checks': [],
}
for name, width, height in FILES:
    path = ROOT / name
    info = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)], text=True))
    video = next(stream for stream in info['streams'] if stream['codec_type'] == 'video')
    audio = next(stream for stream in info['streams'] if stream['codec_type'] == 'audio')
    assert (video['width'], video['height']) == (width, height)
    assert video['r_frame_rate'] == video['avg_frame_rate'] == '60/1'
    assert int(video['nb_frames']) == report['video_frames']
    assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p'
    assert all(video[key] == 'bt709' for key in ['color_space', 'color_transfer', 'color_primaries'])
    assert audio['codec_name'] == 'aac' and audio['channels'] == 2
    assert abs(float(info['format']['duration']) - PLAN['duration']) < .05
    subprocess.run(['ffmpeg', '-hide_banner', '-v', 'error', '-xerror', '-i', str(path),
                    '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-'], check=True)
    measured = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-vn',
                              '-af', 'loudnorm=I=-17:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'],
                              capture_output=True, text=True, check=True)
    measurement = json.loads(re.findall(r'\{[^{}]+\}', measured.stderr)[-1])
    assert float(measurement['input_tp']) < -1, measurement
    assert -19 <= float(measurement['input_i']) <= -15, measurement
    report['files'].append({
        'file': name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'size_bytes': path.stat().st_size, 'video_bitrate': int(video['bit_rate']),
        'profile': video['profile'], 'audio_bitrate': int(audio['bit_rate']),
        'container_duration': float(info['format']['duration']),
        'integrated_lufs': float(measurement['input_i']),
        'true_peak_dbtp': float(measurement['input_tp']), 'full_decode': 'passed',
    })
    print(f"Checked {name}: {width}x{height}, 60 fps, {video['nb_frames']} frames, "
          f"{measurement['input_i']} LUFS / {measurement['input_tp']} dBTP", flush=True)

previous_files = []
for campaign in ['landing-150', 'ad-click', 'direct-questions', 'two-offers', 'photos-choice']:
    old = json.loads((ROOT / f'data/{campaign}-export-report.json').read_text())
    for item in old['files']:
        digest = hashlib.sha256((ROOT / item['file']).read_bytes()).hexdigest()
        assert digest == item['sha256'], f"An earlier approved video changed: {item['file']}"
        previous_files.append({'file': item['file'], 'sha256': digest})
assert len(previous_files) == 10
report['previous_approved_files'] = previous_files
report['layout'] = {
    'expected_center_x': 540, 'sampled_frames': len(layout['frames']),
    'safe_area': layout['safe_area'],
    'max_center_error_px': max(abs(group['center_x'] - 540) for frame in layout['frames'] for group in frame['groups']),
}
report['checks'] = [
    'Full H.264/AAC decode passed for both actual delivered MP4s.',
    'Frame count, native master dimensions, 60 fps, BT.709 and stereo AAC metadata verified.',
    'Integrated loudness and true peak measured on each delivered file.',
    'Eight Chromium DOM samples passed center, platform-safe-area, loaded-font and price-width checks.',
    'Every referenced caption word is within its cue; short captions need not repeat complete headings.',
    f"Five contiguous scenes cover {PLAN['duration']} seconds; the final scene lasts exactly three seconds.",
    'Original provided MP3 and all ten previous approved MP4s verified byte-identical.',
]
(ROOT / 'data/cleaning-export-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
