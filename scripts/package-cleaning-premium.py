"""Package exact finished files and verify each archived byte against its source."""
from pathlib import Path
import hashlib
import json
from zipfile import ZipFile, ZIP_STORED

root = Path(__file__).resolve().parent.parent
report = json.loads((root / 'data/cleaning-premium-export-report.json').read_text())
assert len(report['files']) == 2
assert report['actual_video_visual_review']['status'] == 'passed'
for item in report['files']:
    assert hashlib.sha256((root / item['file']).read_bytes()).hexdigest() == item['sha256']
names = [item['file'] for item in report['files']] + [
    'data/captions-cleaning-premium.srt', 'data/cleaning-premium-export-report.json', 'data/cleaning-premium-layout-check.json',
    'data/cleaning-premium-video-review.json',
]
target = root / 'previews/bridge-reel-cleaning-premium-originals-60fps.zip'
with ZipFile(target, 'w', compression=ZIP_STORED) as archive:
    for name in names:
        archive.write(root / name, arcname=Path(name).name)
    archive.writestr('README.txt',
        'Bridge Agency — Клінінг: преміальна версія\n\n'
        f"{report['duration_seconds']:g} с. Формат 9:16, справжні 60 fps. Українська озвучка та вбудовані субтитри.\n"
        'bridge-reel-cleaning-premium-hq-60fps.mp4 — 1080 × 1920, готовий вертикальний ролик.\n'
        'bridge-reel-cleaning-premium-master-4k-60fps.mp4 — 2160 × 3840, майстер із нативного рендера.\n'
        'Обидва MP4 збережено без перетворення або повторного стиснення.\n'
        'Оригінальну озвучку використано повністю, без обрізання, зміни темпу або висоти голосу.\n'
        'Фінальна сцена триває 3 секунди.\n'
        'Фінальна дія: написати «САЙТ» у приватні повідомлення.\n'
        'Приклад складу прибирання демонстраційний; це не умови конкретної клінінгової компанії.\n'
        'Контрольні суми й вимірювання — cleaning-premium-export-report.json.\n')
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == {Path(name).name for name in names} | {'README.txt'}
    for name in names:
        assert hashlib.sha256(archive.read(Path(name).name)).hexdigest() == hashlib.sha256((root / name).read_bytes()).hexdigest()
print(f'{target}: {target.stat().st_size:,} bytes; originals verified.')
