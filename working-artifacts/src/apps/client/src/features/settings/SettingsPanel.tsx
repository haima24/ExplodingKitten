import { useEffect, useState } from 'react';
import { t } from '../../copy';
import { LANGUAGES, speechTag, type Language } from '../../copy/locale';
import { Button } from '../../components/common/Button';
import { Choice } from '../../components/common/Choice';
import f from '../../components/common/forms.module.css';
import s from '../../components/common/common.module.css';
import { Modal } from '../../components/common/Modal';
import type { MotionPref, TextScale } from '../../lib/settings';
import { useStore } from '../../net/context';

const languageName = (language: Language): string => (language === 'vi' ? 'Tiếng Việt' : 'English');

const MOTION: MotionPref[] = ['system', 'on', 'off'];
const SCALES: TextScale[] = [100, 125, 150];

/** Used by the /settings route and as a dialog from the game menu. Changes apply immediately. */
export function SettingsPanel(): JSX.Element {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const [tipsReset, setTipsReset] = useState(false);

  const set = (patch: Partial<typeof settings>): void =>
    dispatch({ type: 'settings/patch', patch });

  const toggleSound = async (on: boolean): Promise<void> => {
    if (on) {
      // Audio code is only loaded after an explicit user gesture.
      const audio = await import('../../lib/audio');
      audio.setVolume(settings.volume);
      // Do not wait for the browser: it may hold the audio context until a tap, and the toggle must still switch.
      void audio.unlockAudio().then(() => audio.playSound('play'));
    }
    set({ sound: on });
  };

  const changeVolume = (volume: number): void => {
    set({ volume });
    if (settings.sound) void import('../../lib/audio').then((audio) => audio.setVolume(volume));
  };
  const previewVolume = (): void => {
    if (settings.sound) void import('../../lib/audio').then((audio) => audio.playSound('attack'));
  };

  const [noVoice, setNoVoice] = useState(false);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  // Voices can load a moment after the page; look again when the list changes.
  useEffect(() => {
    if (!settings.voice) {
      setNoVoice(false);
      return undefined;
    }
    let cancelled = false;
    const check = (): void => {
      void import('../../lib/voice').then((speech) => {
        if (cancelled) return;
        setNoVoice(!speech.voiceSupported());
        setVoiceName(speech.voiceLabelFor(speechTag(settings.language)));
      });
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [settings.voice, settings.language]);

  const toggleVoice = async (on: boolean): Promise<void> => {
    if (on) {
      const speech = await import('../../lib/voice');
      speech.configureVoice({ lang: speechTag(settings.language), volume: settings.voiceVolume });
      speech.enqueueVoice([{ id: 'sample', text: t('voice.sample'), priority: 1 }]);
    } else {
      void import('../../lib/voice').then((speech) => speech.stopVoice());
    }
    set({ voice: on });
  };

  return (
    <div className={s['stack']} style={{ gap: 'var(--space-5)' }}>
      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.language')}</legend>
        <div className={f['stackChoices']}>
          {LANGUAGES.map((language) => (
            <Choice
              key={language}
              name="language"
              value={language}
              checked={settings.language === language}
              onChange={() => set({ language })}
            >
              <span lang={language}>{languageName(language)}</span>
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.motion')}</legend>
        <div className={f['stackChoices']}>
          {MOTION.map((m) => (
            <Choice
              key={m}
              name="motion"
              value={m}
              checked={settings.motion === m}
              onChange={() => set({ motion: m })}
            >
              {t(`settings.motion.${m}` as const)}
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.sound')}</legend>
        <div className={f['stackChoices']}>
          <Choice
            name="sound"
            value="off"
            checked={!settings.sound}
            onChange={() => void toggleSound(false)}
          >
            {t('settings.sound.off')}
          </Choice>
          <Choice
            name="sound"
            value="on"
            checked={settings.sound}
            onChange={() => void toggleSound(true)}
          >
            {t('settings.sound.on')}
          </Choice>
        </div>
        <label className={f['range']}>
          <span>
            {t('settings.volume')}: <output>{settings.volume}%</output>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.volume}
            disabled={!settings.sound}
            onChange={(e) => changeVolume(Number(e.target.value))}
            onPointerUp={previewVolume}
            onKeyUp={previewVolume}
          />
        </label>
        <p className={f['help']}>{t('settings.sound.note')}</p>
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.voice')}</legend>
        <div className={f['stackChoices']}>
          <Choice name="voice" value="off" checked={!settings.voice} onChange={() => void toggleVoice(false)}>
            {t('settings.voice.off')}
          </Choice>
          <Choice name="voice" value="on" checked={settings.voice} onChange={() => void toggleVoice(true)}>
            {t('settings.voice.on')}
          </Choice>
        </div>
        <label className={f['range']}>
          <span>
            {t('settings.voiceVolume')}: <output>{settings.voiceVolume}%</output>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.voiceVolume}
            disabled={!settings.voice}
            onChange={(e) => set({ voiceVolume: Number(e.target.value) })}
          />
        </label>
        <p className={f['help']}>{t('settings.voice.note')}</p>
        {settings.voice && voiceName ? (
          <p className={f['help']}>{t('settings.voice.using', { name: voiceName })}</p>
        ) : null}
        {noVoice ? (
          <p className={f['help']} role="status">
            {t('settings.voice.unavailable')}
          </p>
        ) : null}
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.toasts')}</legend>
        <div className={f['stackChoices']}>
          <Choice name="toasts" value="on" checked={settings.toasts} onChange={() => set({ toasts: true })}>
            {t('settings.toasts.on')}
          </Choice>
          <Choice name="toasts" value="off" checked={!settings.toasts} onChange={() => set({ toasts: false })}>
            {t('settings.toasts.off')}
          </Choice>
        </div>
        <p className={f['help']}>{t('settings.toasts.note')}</p>
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('settings.textSize')}</legend>
        <div className={f['stackChoices']}>
          {SCALES.map((scale) => (
            <Choice
              key={scale}
              name="textSize"
              value={String(scale)}
              checked={settings.textScale === scale}
              onChange={() => set({ textScale: scale })}
              hint={<span style={{ fontSize: `${scale / settings.textScale}em` }}>{t('settings.textSize.sample')}</span>}
            >
              {t(`settings.textSize.${scale}` as const)}
            </Choice>
          ))}
        </div>
      </fieldset>

      <div className={s['stack']}>
        <Button
          onClick={() => {
            dispatch({ type: 'tips/reset' });
            setTipsReset(true);
          }}
        >
          {t('settings.tips')}
        </Button>
        {tipsReset ? <p role="status">{t('settings.tips.done')}</p> : null}
      </div>

      <p className={f['help']}>{t('settings.device')}</p>
    </div>
  );
}

export function SettingsDialog({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <Modal title={t('settings.title')} onClose={onClose}>
      <SettingsPanel />
      <div className={s['dialogActions']}>
        <Button variant="primary" onClick={onClose} data-autofocus>
          {t('settings.close')}
        </Button>
      </div>
    </Modal>
  );
}

export function SettingsPage(): JSX.Element {
  return (
    <div className={s['page']}>
      <h1>{t('settings.title')}</h1>
      <SettingsPanel />
    </div>
  );
}
