"""Renders the spoken lines (US-064) to small MP3 files, one per line and language.

    pip install edge-tts
    python apps/client/scripts/generate-voice.py

Reads `voice.V..` and `voice.sample` from src/copy/en.ts and src/copy/vi.ts and
writes public/voice/<lang>/<id>.mp3. Files are committed, so the game needs no
speech engine and sounds the same in every browser. Re-run after changing a line.

The voices are Microsoft neural voices reached through the `edge-tts` package.
Check Microsoft's terms before a commercial release, or replace the files with
recordings or licensed audio: the game only needs the same file names.
"""
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
COPY = ROOT / "src" / "copy"
OUT = ROOT / "public" / "voice"
VOICES = {"en": "en-US-JennyNeural", "vi": "vi-VN-HoaiMyNeural"}
# A little slower than normal speech so short lines stay clear for children.
RATE = "-8%"


def lines(file: str) -> dict[str, str]:
    text = (COPY / file).read_text(encoding="utf8")
    found = {}
    key = re.compile(r"^\s+'voice\.(V\d+[a-z]?|sample)':\s*", re.M)
    for match in key.finditer(text):
        quote = text[match.end()]
        end = match.end() + 1
        while text[end] != quote:
            end += 2 if text[end] == "\\" else 1
        found[match.group(1)] = text[match.end() + 1 : end].replace("\\" + quote, quote)
    return found


async def main() -> int:
    total = 0
    for lang, voice in VOICES.items():
        folder = OUT / lang
        folder.mkdir(parents=True, exist_ok=True)
        for line_id, text in lines(f"{lang}.ts").items():
            target = folder / f"{line_id}.mp3"
            for attempt in range(5):  # the service sometimes returns no audio; try again
                try:
                    await edge_tts.Communicate(text, voice, rate=RATE).save(str(target))
                    if target.stat().st_size > 0:
                        break
                except edge_tts.exceptions.NoAudioReceived:
                    pass
                await asyncio.sleep(1 + attempt)
            else:
                raise RuntimeError(f"no audio for {lang}/{line_id}")
            total += 1
            print(f"{lang}/{line_id}.mp3  {text}")
    print(f"{total} files written to {OUT}")
    return 0


sys.stdout.reconfigure(encoding="utf8")
sys.exit(asyncio.run(main()))
