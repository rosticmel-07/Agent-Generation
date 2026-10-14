from pathlib import Path
import hashlib
import json
from zipfile import ZipFile, ZIP_STORED

root = Path(__file__).resolve().parent.parent
report = json.loads((root / 'data/two-offers-export-report.json').read_text())
names = [f['file'] for f in report['files']] + ['data/captions-two-offers.srt', 'data/two-offers-export-report.json', 'data/two-offers-centering-check.json']
target = root / 'previews/bridge-reel-two-offers-originals-60fps.zip'
with ZipFile(target, 'w', compression=ZIP_STORED) as archive:
    for name in names:
        archive.write(root / name, arcname=Path(name).name)
    archive.writestr('README.txt',
        'Bridge Agency — Лендінг $150 / сайт $300\n\n'
        '21 секунда, 9:16, справжні 60 fps. Українська озвучка та вбудовані субтитри.\n'
        'bridge-reel-two-offers-hq-60fps.mp4 — 1080 × 1920, для рекламного тесту Meta.\n'
        'bridge-reel-two-offers-master-4k-60fps.mp4 — 2160 × 3840, майстер.\n'
        'Обидва MP4 збережено в ZIP без перетворення або повторного стиснення.\n'
        'Контрольні суми та результати перевірок — two-offers-export-report.json.\n')
with ZipFile(target) as archive:
    assert archive.testzip() is None
    for name in names:
        assert hashlib.sha256(archive.read(Path(name).name)).hexdigest() == hashlib.sha256((root/name).read_bytes()).hexdigest()
print(f'{target}: {target.stat().st_size:,} bytes; originals verified.')
