import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import s from './common.module.css';

type Variant = 'primary' | 'secondary' | 'danger';

interface BaseProps {
  variant?: Variant | undefined;
  compact?: boolean | undefined;
  block?: boolean | undefined;
}

const classes = (p: BaseProps & { soft?: boolean | undefined }): string =>
  [
    s['button'],
    p.variant === 'primary' && s['primary'],
    p.variant === 'danger' && s['danger'],
    p.compact && s['compact'],
    p.block && s['block'],
    p.soft && s['soft'],
  ]
    .filter(Boolean)
    .join(' ');

interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  /**
   * Looks disabled and ignores clicks but stays focusable, so the reason shown
   * next to it can be reached by keyboard and screen reader users.
   */
  softDisabled?: boolean;
  /** Called instead of onClick while softDisabled, e.g. to explain why. */
  onInactiveClick?: () => void;
}

export function Button({
  variant = 'secondary',
  compact,
  block,
  loading,
  softDisabled,
  onInactiveClick,
  onClick,
  children,
  type = 'button',
  ...rest
}: ButtonProps): JSX.Element {
  const inactive = softDisabled || loading;
  return (
    <button
      {...rest}
      type={type}
      className={`${classes({ variant, compact, block, soft: softDisabled })} ${rest.className ?? ''}`}
      aria-disabled={inactive ? true : undefined}
      aria-busy={loading ? true : undefined}
      onClick={(event) => {
        if (inactive) {
          event.preventDefault();
          if (softDisabled) onInactiveClick?.();
          return;
        }
        onClick?.(event);
      }}
    >
      {loading ? <span className={s['spinner']} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

interface LinkButtonProps extends BaseProps, Omit<LinkProps, 'className'> {
  children: ReactNode;
}

export function LinkButton({ variant = 'secondary', compact, block, ...rest }: LinkButtonProps): JSX.Element {
  return <Link {...rest} className={classes({ variant, compact, block })} />;
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  glyph: string;
  label: string;
  /** Show the text label on wide screens as well as for assistive tech. */
  showLabel?: boolean;
}

export function IconButton({ glyph, label, showLabel = true, ...rest }: IconButtonProps): JSX.Element {
  return (
    <button type="button" {...rest} className={s['iconButton']} aria-label={label}>
      <span className={s['iconGlyph']} aria-hidden="true">
        {glyph}
      </span>
      {showLabel ? (
        <span className={s['labelWide']} aria-hidden="true">
          {label}
        </span>
      ) : null}
    </button>
  );
}
