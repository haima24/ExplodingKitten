import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ADJECTIVES, AVATARS, NOUNS, type DisplayName } from '@wb/protocol/shared';
import { getLocale, t } from '../../copy';
import { displayName, wordLabel, type NameKind } from '../../copy/names';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Choice } from '../../components/common/Choice';
import f from '../../components/common/forms.module.css';
import r from './rooms.module.css';

/** Words in the viewer's language; Vietnamese is sorted with Vietnamese rules. */
function wordsFor(kind: NameKind, list: readonly string[]): string[] {
  if (getLocale() !== 'vi') return [...list];
  const collator = new Intl.Collator('vi');
  return [...list].sort((a, b) => collator.compare(wordLabel(kind, a), wordLabel(kind, b)));
}

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T;

interface IdentityStepProps {
  submitLabel: string;
  busy: boolean;
  error: string | null;
  /** Avatars already used in the room (disabled and labelled "taken"). */
  taken?: readonly string[];
  hint?: ReactNode;
  onSubmit: (name: DisplayName, avatarId: string) => void;
}

/** Name builder (curated words, no free text) plus avatar picker. Continue is always enabled. */
export function IdentityStep({
  submitLabel,
  busy,
  error,
  taken = [],
  hint,
  onSubmit,
}: IdentityStepProps): JSX.Element {
  const [adjective, setAdjective] = useState<string>(() => pick(ADJECTIVES));
  const [noun, setNoun] = useState<string>(() => pick(NOUNS));
  const [avatarId, setAvatarId] = useState<string>(() => pick(AVATARS));

  // If the chosen avatar turns out to be taken, move to a free one.
  useEffect(() => {
    if (taken.includes(avatarId)) {
      const free = AVATARS.find((a) => !taken.includes(a));
      if (free) setAvatarId(free);
    }
  }, [taken, avatarId]);

  const vietnamese = getLocale() === 'vi';
  const adjectiveList = (
    <fieldset className={f['fieldset']}>
      <legend className={f['label']}>{t('identity.adjective')}</legend>
      <div className={`${f['grid']} ${r['scroller']}`}>
        {wordsFor('adjective', ADJECTIVES).map((word) => (
          <Choice key={word} name="adjective" value={word} checked={adjective === word} onChange={setAdjective}>
            {wordLabel('adjective', word)}
          </Choice>
        ))}
      </div>
    </fieldset>
  );
  const nounList = (
    <fieldset className={f['fieldset']}>
      <legend className={f['label']}>{t('identity.noun')}</legend>
      <div className={`${f['grid']} ${r['scroller']}`}>
        {wordsFor('noun', NOUNS).map((word) => (
          <Choice key={word} name="noun" value={word} checked={noun === word} onChange={setNoun}>
            {wordLabel('noun', word)}
          </Choice>
        ))}
      </div>
    </fieldset>
  );

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    onSubmit({ adjective, noun }, avatarId);
  };

  return (
    <form onSubmit={submit} className={f['fieldset']} style={{ gap: 'var(--space-5)' }}>
      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('identity.name')}</legend>
        <p className={f['help']}>{t('identity.noRealNames')}</p>
        <p className={f['preview']} role="status">
          {t('identity.preview', { name: displayName({ adjective, noun }) })}
        </p>
        <Button
          compact
          onClick={() => {
            setAdjective(pick(ADJECTIVES));
            setNoun(pick(NOUNS));
          }}
        >
          🎲 {t('identity.shuffle')}
        </Button>

        {vietnamese ? nounList : adjectiveList}
        {vietnamese ? adjectiveList : nounList}
      </fieldset>

      <fieldset className={f['fieldset']}>
        <legend className={f['legend']}>{t('identity.avatar')}</legend>
        <div className={f['gridWide']}>
          {AVATARS.map((id) => {
            const isTaken = taken.includes(id);
            return (
              <Choice
                key={id}
                name="avatar"
                value={id}
                checked={avatarId === id}
                disabled={isTaken}
                onChange={setAvatarId}
                ariaLabel={isTaken ? `${t(`avatar.${id}` as const)}, ${t('identity.taken')}` : t(`avatar.${id}` as const)}
              >
                <span className={r['avatarRow']}>
                  <Avatar avatarId={id} size={40} />
                  <span>
                    {t(`avatar.${id}` as const)}
                    {isTaken ? ` (${t('identity.taken')})` : ''}
                  </span>
                </span>
              </Choice>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className={f['error']}>
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      ) : null}
      {hint ? <p className={f['help']}>{hint}</p> : null}
      <Button type="submit" variant="primary" block loading={busy}>
        {submitLabel}
      </Button>
    </form>
  );
}
