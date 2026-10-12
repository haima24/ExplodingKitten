import type { ReactNode } from 'react';
import f from './forms.module.css';

interface ChoiceProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  hint?: ReactNode;
  /** Accessible name when it differs from the visible content. */
  ariaLabel?: string;
}

/**
 * Large radio option. A real radio input (native arrow-key behaviour, grouped by
 * `name`) with a visible mark and thick outline, so "selected" is never colour alone.
 */
export function Choice({
  name,
  value,
  checked,
  onChange,
  disabled,
  children,
  hint,
  ariaLabel,
}: ChoiceProps): JSX.Element {
  return (
    <label
      className={[f['choice'], checked && f['choiceChecked'], disabled && f['choiceDisabled']]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={() => onChange(value)}
      />
      <span className={f['mark']} aria-hidden="true">
        {checked ? '✓' : ''}
      </span>
      <span className={f['choiceBody']}>
        <span>{children}</span>
        {hint ? <span className={f['choiceHint']}>{hint}</span> : null}
      </span>
    </label>
  );
}
