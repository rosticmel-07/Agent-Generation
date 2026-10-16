from pathlib import Path
import hashlib
import json
from zipfile import ZipFile, ZIP_STORED

root = Path(__file__).resolve().parent.parent
report = json.loads((root / 'data/photos-choice-export-report.json').read_text())
names = [f['file'] for f in report['files']] + ['data/captions-photos-choice.srt', 'data/photos-choice-export-report.json', 'data/photos-choice-centering-check.json']
target = root / 'previews/bridge-reel-photos-choice-originals-60fps.zip'
with ZipFile(target, 'w', compression=ZIP_STORED) as archive:
    for name in names:
        archive.write(root / name, arcname=Path(name).name)
    archive.writestr('README.txt',
        'Bridge Agency — Фото є. А що обрати?\n\n'
        '22 секунди, 9:16, справжні 60 fps. Українська озвучка та вбудовані субтитри.\n'
        'bridge-reel-photos-choice-hq-60fps.mp4 — 1080 × 1920, для рекламного тесту Meta.\n'
        'bridge-reel-photos-choice-master-4k-60fps.mp4 — 2160 × 3840, майстер.\n'
        'Обидва MP4 збережено в ZIP без перетворення або повторного стиснення.\n'
        'Контрольні суми та результати перевірок — photos-choice-export-report.json.\n')
with ZipFile(target) as archive:
    assert archive.testzip() is None
    for name in names:
        assert hashlib.sha256(archive.read(Path(name).name)).hexdigest() == hashlib.sha256((root/name).read_bytes()).hexdigest()
print(f'{target}: {target.stat().st_size:,} bytes; originals verified.')
