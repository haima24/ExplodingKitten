import { CARD_CATALOG } from '@wb/engine/cards';
import type { Card, CardKind, GameEvent, OutReason, PlayerView } from '@wb/engine/types';
import type { RoomView } from '@wb/protocol/shared';
import { t } from '../../copy';
import type { LogEntry } from '../../net/state';
import { nameOf } from './selectors';
import type { SoundName } from '../../lib/audio';

const MAX_LOG = 10;

export interface Processed {
  log: LogEntry[];
  playedThisTurn: boolean;
  /** Spoken politely for everyone. */
  announcements: string[];
  toast: string | null;
  peek: Card[] | null;
  nap: boolean;
  /** Tips to trigger (indexes into the coach-mark list). */
  tips: number[];
  sounds: SoundName[];
}

const cardName = (kind: CardKind): string => CARD_CATALOG[kind].name;

/**
 * Turns the events of one `game.update` into log entries, announcements, and
 * private UI results. Private events never create log entries.
 */
export function processGameUpdate(input: {
  events: GameEvent[];
  view: PlayerView;
  room: RoomView | null;
  previousLog: LogEntry[];
  previousPlayedThisTurn: boolean;
  firstUpdate: boolean;
}): Processed {
  const { events, view, room, firstUpdate } = input;
  const me = view.you.id;
  const name = (id: unknown): string => nameOf(room, typeof id === 'string' ? id : undefined);

  const entries: LogEntry[] = [];
  const out: Processed = {
    log: input.previousLog,
    playedThisTurn: input.previousPlayedThisTurn,
    announcements: [],
    toast: null,
    peek: null,
    nap: false,
    tips: firstUpdate ? [0] : [],
    sounds: [],
  };
  const log = (seq: number, text: string): void => void entries.push({ seq, text });

  for (const e of [...events].sort((a, b) => a.seq - b.seq)) {
    const d = e.data;
    switch (e.type) {
      case 'TURN_STARTED': {
        out.playedThisTurn = false;
        const who = d['playerId'];
        if (who === me) {
          out.announcements.push(t('turn.announceMine'));
          out.tips.push(1);
        } else {
          out.announcements.push(t('turn.announceOther', { name: name(who) }));
        }
        if (firstUpdate) out.toast = t('turn.firstGoes', { name: name(who) });
        break;
      }
      case 'CARD_PLAYED': {
        const kind = d['kind'] as CardKind;
        log(e.seq, t('log.played', { name: name(d['playerId']), card: cardName(kind) }));
        out.sounds.push('play');
        if (d['playerId'] === me && (kind === 'PEEK' || kind === 'SHAKE_UP')) {
          out.playedThisTurn = true;
        }
        out.announcements.push(t('log.played', { name: name(d['playerId']), card: cardName(kind) }));
        break;
      }
      case 'EFFECT_APPLIED': {
        // Shown when the card really takes effect (it may have been stopped by a Nope).
        const kind = d['kind'] as CardKind;
        if (kind === 'HOP_OVER') {
          out.toast = t('log.hopOver', { name: name(d['playerId']) });
          out.announcements.push(out.toast);
        } else if (kind === 'PASS_IT_ON') {
          out.toast = t('log.passItOn', { name: name(d['playerId']) });
          out.announcements.push(out.toast);
        }
        break;
      }
      case 'NOPE_PLAYED': {
        const text = t('log.nope', { name: name(d['playerId']) });
        log(e.seq, text);
        out.toast = text;
        out.announcements.push(text);
        out.sounds.push('play');
        break;
      }
      case 'NOPE_RESOLVED': {
        if (d['cancelled'] === true) {
          const text = t('log.stopped', { name: name(d['playerId']), card: cardName(d['kind'] as CardKind) });
          log(e.seq, text);
          out.toast = text;
          out.announcements.push(text);
        }
        break;
      }
      case 'CARD_DRAWN': {
        const text = t('log.drew', { name: name(d['playerId']) });
        log(e.seq, text);
        out.announcements.push(text);
        break;
      }
      case 'PEEKED': {
        const text = t('log.peeked', { name: name(d['playerId']) });
        log(e.seq, text);
        out.announcements.push(text);
        break;
      }
      case 'DECK_SHUFFLED': {
        const text = t('log.shuffled');
        log(e.seq, t('log.shuffled'));
        out.toast = text;
        out.announcements.push(text);
        break;
      }
      case 'TREAT_USED': {
        const text = t('log.treat', { name: name(d['playerId']) });
        log(e.seq, text);
        out.announcements.push(text);
        break;
      }
      case 'BOOM_TUCKED': {
        log(e.seq, t('log.tucked'));
        out.announcements.push(t('log.tucked'));
        break;
      }
      case 'PLAYER_OUT': {
        const reason = (d['reason'] as OutReason | undefined) ?? 'BOOM';
        const text = t(`log.out.${reason}` as const, { name: name(d['playerId']) });
        log(e.seq, text);
        out.announcements.push(text);
        out.sounds.push('nap');
        break;
      }
      case 'FAVOR_REQUESTED':
        log(e.seq, t('log.favorAsked', { from: name(d['requesterId']), to: name(d['targetId']) }));
        break;
      case 'FAVOR_GIVEN': {
        const text = t('log.favorGiven', { from: name(d['fromId']), to: name(d['toId']) });
        log(e.seq, text);
        out.announcements.push(text);
        break;
      }
      case 'GAME_FINISHED': {
        const text = t('log.wins', { name: name(d['winnerId']) });
        log(e.seq, text);
        out.announcements.push(text);
        out.sounds.push('win');
        break;
      }
      // ---- private events: never logged
      case 'DRAWN_CARD': {
        const kind = (d['card'] as Card).kind;
        out.toast = t('draw.got', { card: cardName(kind) });
        out.sounds.push('draw');
        break;
      }
      case 'PEEK_RESULT':
        out.peek = (d['cards'] as Card[]).map((c) => ({ ...c }));
        break;
      case 'BOOM_DRAWN':
        out.sounds.push('boom');
        if (d['hasTreat'] === false) out.nap = true;
        else out.tips.push(3);
        break;
      case 'FAVOR_RECEIVED':
        out.toast = t('favor.got', { card: cardName((d['card'] as Card).kind) });
        break;
    }
  }

  out.log = [...entries.reverse(), ...input.previousLog].slice(0, MAX_LOG);
  return out;
}
