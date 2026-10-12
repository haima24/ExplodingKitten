import { useEffect, useId, useRef, type ReactNode } from 'react';
import { announcer } from '../../lib/announcer';
import { useStore } from '../../net/context';
import { Button } from './Button';
import s from './common.module.css';

interface ModalProps {
  title: string;
  children: ReactNode;
  /** Called on Escape, backdrop click, or a close control. */
  onClose?: () => void;
  /** Forced-choice dialogs (Exploding Kitten, re-insert, favour) are not dismissible. */
  dismissible?: boolean;
  /** Spoken assertively when the dialog opens. */
  announce?: string;
  narrow?: boolean;
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

/**
 * Native <dialog> opened with showModal(): the browser traps focus, Escape is
 * handled here, and focus returns to the invoking control on close.
 */
export function Modal({
  title,
  children,
  onClose,
  dismissible = true,
  announce,
  narrow,
  role = 'dialog',
  className,
}: ModalProps): JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);
  const { dispatch } = useStore();
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const invoker = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    const target = dialog.querySelector<HTMLElement>('[data-autofocus]');
    target?.focus();
    dispatch({ type: 'ui/overlay', delta: 1 });
    if (announce) announcer.announce(announce, { priority: 'assertive', key: `dialog:${title}` });
    return () => {
      dispatch({ type: 'ui/overlay', delta: -1 });
      if (dialog.open) dialog.close();
      if (invoker && invoker.isConnected) invoker.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={titleId}
      aria-modal="true"
      className={`${s['dialog']} ${narrow ? s['dialogNarrow'] : ''} ${className ?? ''}`}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) closeRef.current?.();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && dismissible) closeRef.current?.();
      }}
    >
      <div className={s['dialogBody']}>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

interface ConfirmDialogProps {
  title: string;
  body: string;
  safeLabel: string;
  dangerLabel: string;
  onSafe: () => void;
  onDanger: () => void;
}

/** The safe action is default-focused; Escape closes only this confirmation. */
export function ConfirmDialog({
  title,
  body,
  safeLabel,
  dangerLabel,
  onSafe,
  onDanger,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Modal title={title} onClose={onSafe} narrow role="alertdialog">
      <p>{body}</p>
      <div className={s['dialogActions']}>
        <Button variant="primary" onClick={onSafe} data-autofocus>
          {safeLabel}
        </Button>
        <Button variant="danger" onClick={onDanger}>
          {dangerLabel}
        </Button>
      </div>
    </Modal>
  );
}
