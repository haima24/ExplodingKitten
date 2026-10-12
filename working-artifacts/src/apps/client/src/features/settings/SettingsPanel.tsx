import { useState } from 'react';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import { Choice } from '../../components/common/Choice';
import f from '../../components/common/forms.module.css';
import s from '../../components/common/common.module.css';
import { Modal } from '../../components/common/Modal';
import type { MotionPref, TextScale } from '../../lib/settings';
import { useStore } from '../../net/context';

const MOTION: MotionPref[] = ['system', 'on', 'off'];
const SCALES: TextScale[] = [100, 125, 150];

/** Used by the /settings route and as a dialog from the game menu. Changes apply immediately. */
export function SettingsPanel(): JSX.Element {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const [tipsReset, setTipsReset] = useState(false);

  const set = (patch: Partial<typeof settings>): void =>
    dispatch({ type: 'settings/set', settings: { ...settings, ...patch } });

  const toggleSound = async (on: boolean): Promise<void> => {
    if (on) {
      // Audio code is only loaded after an explicit user gesture.
      const audio = await import('../../lib/audio');
      await audio.unlockAudio();
      audio.playSound('play');
    }
    set({ sound: on });
  };

  return (
    <div className={s['stack']} style={{ gap: 'var(--space-5)' }}>
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
        <p className={f['help']}>{t('settings.sound.note')}</p>
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
