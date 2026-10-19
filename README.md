# Bridge Agency — рекламні ролики

Поточний ролик **«Ти під авто. Клієнт чекає?»** — для власників автосервісу. Повідомлення про ціну й запис переходять у сайт, Telegram-бот і зрозумілий маршрут звернення. Чотири послуги Bridge подані як інструменти під задачу. Фінальна дія: **«Напиши “СТО” у приватні повідомлення»**.

**26 секунд · 9:16 · 60 fps · 1560 кадрів.** Повний запис користувача використано без обрізання, прискорення чи зміни висоти голосу. Фінальний екран — рівно 3 секунди. Субтитри показуються завершеними фразами; головні діалоги й CTA замінюють тотожні нижні написи.

- [Готовий MP4 — 1080 × 1920 / 60 fps](previews/bridge-reel-auto-service-hq-60fps.mp4)
- [Нативний майстер — 2160 × 3840 / 60 fps](previews/bridge-reel-auto-service-master-4k-60fps.mp4)
- [Оригінали одним ZIP](previews/bridge-reel-auto-service-originals-60fps.zip)
- [Перегляд відео й кадрів](previews/index.html)
- [Сценарій, джерела та відтворення](docs/auto-service.md)

Технічні перевірки пройдені для обох MP4: повне декодування H.264/AAC, 60 fps, BT.709, гучність −17,12 LUFS / −4,72 dBTP. Переглянуто 55 вибраних кадрів готового 1080p у масштабі телефона та один повнорозмірний кадр. Оригінал і нормалізований WAV мають однакові 1 236 324 семпли при 48 kHz; попередні 14 MP4 не змінені. Звіти: [експорт](data/auto-service-export-report.json), [перегляд кадрів](data/auto-service-video-review.json), [шрифти й композиція](data/auto-service-layout-check.json).

У скляному блоці використано справжній наявний знак Bridge з PDF, кадрований у CSS без спотворень. Точна нова іконка з inline-повідомлення не доступна як локальний оригінал PNG/SVG; її можна підставити через `plan.icon`. Зображення авто згенеровано для ролика; це демонстраційний макет, не реальний кейс клієнта. Послуги прийняті користувачем через наданий запис; актуальну повноту живого сайта не підтверджено через 403 мережевого шлюзу. Цін і гарантій клієнтів у ролику немає.

## Відтворення

Node.js 22+ (у хмарі 24), npm, Chromium, FFmpeg і ffprobe. Залежності зафіксовані в `package-lock.json`.

```sh
npm ci --no-audit --no-fund
npm run typecheck
node scripts/render-auto-service.mjs --stills
node scripts/render-auto-service.mjs --master
node scripts/export-auto-service-from-master.mjs
python3 scripts/check-auto-service-export.py
python3 scripts/review-auto-service-video.py
# Після перегляду кадрів і фіксації actual_video_visual_review:
python3 scripts/package-auto-service.py
```

Композиція — `BridgeAutoService`. `npm start` відкриває Remotion Studio локально. Рендер за замовчуванням через `npm run render` досі належить старій кампанії: для поточного ролика використовуйте окремий скрипт вище. Нормалізовану копію голосу та власну синтезовану атмосферу відтворюють `prepare-auto-service-audio.py` і `make-auto-service-atmosphere.py`; вони не змінюють вихідний MP3.

Основні файли: `src/BridgeAutoService.tsx`, `data/auto-service.json`, `data/words-auto-service.json`, `data/captions-auto-service.srt`, `public/audio/voiceover-auto-service.mp3`. Попередній [макет без озвучки](previews/auto-service-layout/index.html) збережено окремо.

## Попередні ролики

| Ролик | 1080p / 60 fps | Майстер 4K / 60 fps | Опис |
| --- | --- | --- | --- |
| Клінінг — преміальна версія | [MP4](previews/bridge-reel-cleaning-premium-hq-60fps.mp4) | [MP4](previews/bridge-reel-cleaning-premium-master-4k-60fps.mp4) | [Документ](docs/cleaning-premium.md) |
| Клінінг — перша редакція | [MP4](previews/bridge-reel-cleaning-hq-60fps.mp4) | [MP4](previews/bridge-reel-cleaning-master-4k-60fps.mp4) | [Документ](docs/cleaning.md) |
| Фото є. А що обрати? | [MP4](previews/bridge-reel-photos-choice-hq-60fps.mp4) | [MP4](previews/bridge-reel-photos-choice-master-4k-60fps.mp4) | [Документ](docs/photos-choice.md) |
| Сайт для бізнесу: $150 / $300 | [MP4](previews/bridge-reel-two-offers-hq-60fps.mp4) | [MP4](previews/bridge-reel-two-offers-master-4k-60fps.mp4) | [Документ](docs/two-offers.md) |
| Знову ті самі питання? | [MP4](previews/bridge-reel-direct-questions-hq-60fps.mp4) | [MP4](previews/bridge-reel-direct-questions-master-4k-60fps.mp4) | [Документ](docs/direct-questions.md) |
| Купив клік. А що далі? | [MP4](previews/bridge-reel-ad-click-hq-60fps.mp4) | [MP4](previews/bridge-reel-ad-click-master-4k-60fps.mp4) | [Документ](docs/ad-click.md) |
| Лендінг за $150 | [MP4](previews/bridge-reel-150-hq-60fps.mp4) | [MP4](previews/bridge-reel-150-master-4k-60fps.mp4) | [Документ](docs/landing-150.md) |

[Попередня галерея клінінгу](previews/cleaning-premium.html). ZIP кожної попередньої кампанії залишається в `previews/bridge-reel-<назва>-originals-60fps.zip`. Для відтворення попередніх кампаній обирайте їхні композиції та скрипти, зазначені у відповідних документах; не перезаписуйте схвалені файли.

Архіви 30 fps: [V1](previews/bridge-reel-v1.mp4), [V2](previews/bridge-reel-v2.mp4), [план екранів](docs/screen-plan.md), [таймкоди](docs/timecodes.md). Архівний макет пропозиції: [лендінг за $150](previews/bridge-reel-150-layout.mp4).

[Контент-план на 14 днів](docs/content-plan-14-days.md) · [Наступні сценарії](docs/video-scripts-next.md).

У поточному ролику застосовано локальні Oswald і Manrope з ліцензіями OFL. Логотип узято з PDF користувача. Генерована ілюстрація й музичний шар описані в документі кампанії; чуже відео, озвучку або бренд із референса не використано.
