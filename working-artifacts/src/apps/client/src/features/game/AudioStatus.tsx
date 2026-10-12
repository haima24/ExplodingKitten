import { useEffect, useState } from 'react';
import { t } from '../../copy';
import { useShell } from '../../components/common/AppShell';
import { Button, IconButton } from '../../components/common/Button';
import { useStore } from '../../net/context';
import g from './game.module.css';

/**
 * The always-visible "Sound off" cue (US-063): an icon in the game header, with its
 * text on wide screens. Tapping it opens Settings. Shown only while sound is off.
 */
export function SoundOffButton(): JSX.Element | null {
  const { state } = useStore();
  const shell = useShell();
  if (state.settings.sound) return null;
  return (
    <IconButton
      glyph="🔇"
      label={t('sound.off')}
      title={t('sound.offOpen')}
      data-testid="sound-off"
      onClick={() => shell.openSettings()}
    />
  );
}

/**
 * Small notices in the game banner (US-063, US-064): "Tap to turn on sound" when the
 * browser blocks audio, and a replay button for the last spoken line. Neither blocks play.
 */
export function AudioStatus(): JSX.Element | null {
  const { state } = useStore();
  const { sound, voice } = state.settings;
  const [blocked, setBlocked] = useState(false);
  const [canReplay, setCanReplay] = useState(false);

  // While sound is on, watch whether the browser lets audio run, and unlock it on the next tap.
  useEffect(() => {
    if (!sound) {
      setBlocked(false);
      return undefined;
    }
    let stop: (() => void) | undefined;
    let cancelled = false;
    void import('../../lib/audio').then((audio) => {
      if (cancelled) return;
      stop = audio.watchAudio(setBlocked);
    });
    const unlock = (): void => {
      void import('../../lib/audio').then((audio) => audio.unlockAudio());
    };
    document.addEventListener('pointerdown', unlock, { once: true });
    return () => {
      cancelled = true;
      stop?.();
      document.removeEventListener('pointerdown', unlock);
    };
  }, [sound]);

  // The replay button needs a line to repeat; ask the voice module after each game update.
  const version = state.game.view?.version;
  useEffect(() => {
    if (!voice) {
      setCanReplay(false);
      return;
    }
    void import('../../lib/voice').then((speech) => setCanReplay(speech.hasLastVoice()));
  }, [voice, version]);

  if (sound && !blocked && !(voice && canReplay)) return null;
  return (
    <span className={g['audioStatus']}>
      {sound && blocked ? (
        <Button
          compact
          variant="primary"
          onClick={() => void import('../../lib/audio').then((audio) => audio.unlockAudio())}
        >
          <span aria-hidden="true">🔊 </span>
          {t('sound.blocked')}
        </Button>
      ) : null}
      {voice && canReplay ? (
        <Button compact onClick={() => void import('../../lib/voice').then((speech) => speech.replayLastVoice())}>
          <span aria-hidden="true">↻ </span>
          {t('voice.replay')}
        </Button>
      ) : null}
    </span>
  );
}
