import type { Card, CardKind, GameEvent, OutReason, PlayerView } from '@wb/engine/types';
import type { RoomView } from '@wb/protocol/shared';
import { t, type CopyKey } from '../../copy';
import { cardName } from '../../copy/cards';
import type { LogEntry } from '../../net/state';
import { nameOf } from './selectors';
import type { SoundName } from '../../lib/audio';
import type { VoicePriority } from '../../lib/voice';

const MAX_LOG = 10;

/** A spoken line: the catalog id (`voice.<id>`) and how urgent it is. */
export interface VoiceCue {
  id: VoiceId;
  priority: VoicePriority;
}

export type VoiceId =
  | 'V01'
  | 'V03'
  | 'V04'
  | 'V05'
  | 'V05b'
  | 'V06'
  | 'V06a'
  | 'V07'
  | 'V08'
  | 'V09'
  | 'V10'
  | 'V11'
  | 'V12'
  | 'V13'
  | 'V14'
  | 'V15'
  | 'V16'
  | 'V17'
  | 'V18';

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
  /** Spoken lines for this player only; the catalog holds the words. */
  voice: VoiceCue[];
  /** Player to highlight for a moment (Attack). */
  flash: string | null;
}

/** Each card has its own sound (US-063). Cat cards are not playable today. */
const CARD_SOUND: Record<CardKind, SoundName> = {
  BOOM_CAT: 'boom',
  TREAT: 'defuse',
  HOP_OVER: 'skip',
  PEEK: 'future',
  SHAKE_UP: 'shuffle',
  COZY_CAT: 'cat',
  PASS_IT_ON: 'attack',
  ASK_A_FRIEND: 'favor',
  NOPE: 'nope',
};

/**
 * Turns the events of one `game.update` into log entries, announcements, sounds,
 * voice cues, and private UI results. Private events never create log entries.
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
    voice: [],
    flash: null,
  };
  const log = (
    seq: number,
    key: CopyKey,
    params?: Record<string, string | number>,
    cards?: Record<string, CardKind>,
  ): string => {
    const entry: LogEntry = { seq, key, ...(params ? { params } : {}), ...(cards ? { cards } : {}) };
    entries.push(entry);
    const filled: Record<string, string | number> = { ...params };
    for (const [k, kind] of Object.entries(cards ?? {})) filled[k] = cardName(kind);
    return t(key, filled);
  };
  const say = (id: VoiceId, priority: VoicePriority = 0): void => void out.voice.push({ id, priority });

  const opensNopeWindow = events.some((e) => e.type === 'CARD_PLAYED' || e.type === 'NOPE_PLAYED');

  for (const e of [...events].sort((a, b) => a.seq - b.seq)) {
    const d = e.data;
    switch (e.type) {
      case 'TURN_STARTED': {
        out.playedThisTurn = false;
        const who = d['playerId'];
        if (who === me) {
          out.announcements.push(t('turn.announceMine'));
          out.tips.push(1);
          say('V01', 1);
        } else {
          out.announcements.push(t('turn.announceOther', { name: name(who) }));
        }
        if (firstUpdate) out.toast = t('turn.firstGoes', { name: name(who) });
        break;
      }
      case 'CARD_PLAYED': {
        const kind = d['kind'] as CardKind;
        const text = log(e.seq, 'log.played', { name: name(d['playerId']) }, { card: kind });
        out.sounds.push(CARD_SOUND[kind]);
        if (d['playerId'] === me && (kind === 'PEEK' || kind === 'SHAKE_UP')) {
          out.playedThisTurn = true;
        }
        out.announcements.push(text);
        break;
      }
      case 'EFFECT_APPLIED': {
        // Shown when the card really takes effect (it may have been stopped by a Nope).
        const kind = d['kind'] as CardKind;
        if (kind === 'HOP_OVER') {
          out.toast = t('log.hopOver', { name: name(d['playerId']) });
          out.announcements.push(out.toast);
          say('V07');
        } else if (kind === 'PASS_IT_ON') {
          out.toast = t('log.passItOn', { name: name(d['playerId']) });
          out.announcements.push(out.toast);
          out.flash = view.currentPlayerId;
          say(view.currentPlayerId === me ? 'V06a' : 'V06', 1);
        }
        break;
      }
      case 'NOPE_PLAYED': {
        const text = log(e.seq, 'log.nope', { name: name(d['playerId']) });
        out.toast = text;
        out.announcements.push(text);
        out.sounds.push('nope');
        break;
      }
      case 'NOPE_RESOLVED': {
        if (d['cancelled'] === true) {
          const text = log(e.seq, 'log.stopped', { name: name(d['playerId']) }, { card: d['kind'] as CardKind });
          out.toast = text;
          out.announcements.push(text);
          out.sounds.push('fizzle');
          say('V11');
        }
        break;
      }
      case 'TURN_TIMEOUT': {
        const text = log(e.seq, 'log.timeout', { name: name(d['playerId']) });
        out.toast = text;
        out.announcements.push(text);
        out.sounds.push('timeout');
        if (d['playerId'] === me) say(d['step'] === 'TURN' ? 'V05' : 'V05b', 2);
        break;
      }
      case 'CARD_DRAWN': {
        const text = log(e.seq, 'log.drew', { name: name(d['playerId']) });
        out.announcements.push(text);
        break;
      }
      case 'PEEKED': {
        const text = log(e.seq, 'log.peeked', { name: name(d['playerId']) });
        out.announcements.push(text);
        if (d['playerId'] === me) say('V08');
        break;
      }
      case 'DECK_SHUFFLED': {
        const text = log(e.seq, 'log.shuffled');
        out.toast = text;
        out.announcements.push(text);
        say('V09');
        break;
      }
      case 'TREAT_USED': {
        const text = log(e.seq, 'log.treat', { name: name(d['playerId']) });
        out.announcements.push(text);
        // The drawer heard the Exploding Kitten when they drew it; everyone else hears it now.
        if (d['playerId'] !== me) out.sounds.push('boom');
        out.sounds.push('defuse');
        say('V14');
        break;
      }
      case 'BOOM_TUCKED': {
        log(e.seq, 'log.tucked');
        out.announcements.push(t('log.tucked'));
        break;
      }
      case 'PLAYER_OUT': {
        const reason = (d['reason'] as OutReason | undefined) ?? 'BOOM';
        const text = log(e.seq, `log.out.${reason}` as const, { name: name(d['playerId']) });
        out.announcements.push(text);
        if (reason === 'BOOM' && d['playerId'] !== me) out.sounds.push('boom');
        out.sounds.push('nap');
        say(d['playerId'] === me ? 'V15' : 'V16', d['playerId'] === me ? 2 : 0);
        break;
      }
      case 'FAVOR_REQUESTED':
        log(e.seq, 'log.favorAsked', { from: name(d['requesterId']), to: name(d['targetId']) });
        if (d['targetId'] === me) say('V10', 1);
        break;
      case 'FAVOR_GIVEN': {
        const text = log(e.seq, 'log.favorGiven', { from: name(d['fromId']), to: name(d['toId']) });
        out.announcements.push(text);
        break;
      }
      case 'GAME_FINISHED': {
        const text = log(e.seq, 'log.wins', { name: name(d['winnerId']) });
        out.announcements.push(text);
        out.sounds.push('win');
        say(d['winnerId'] === me ? 'V17' : 'V18', 2);
        break;
      }
      // ---- private events: never logged
      case 'DRAWN_CARD': {
        const kind = (d['card'] as Card).kind;
        out.toast = t('draw.got', { card: cardName(kind) });
        out.sounds.push('draw');
        say('V03');
        break;
      }
      case 'PEEK_RESULT':
        out.peek = (d['cards'] as Card[]).map((c) => ({ ...c }));
        break;
      case 'BOOM_DRAWN':
        out.sounds.push('boom');
        if (d['hasTreat'] === false) out.nap = true;
        else {
          out.tips.push(3);
          say('V13', 1);
        }
        break;
      case 'FAVOR_RECEIVED':
        out.toast = t('favor.got', { card: cardName((d['card'] as Card).kind) });
        break;
    }
  }

  // A player who holds a Nope is asked whether to play it.
  if (opensNopeWindow && view.decision?.kind === 'NOPE_WINDOW') say('V12');

  out.log = [...entries.reverse(), ...input.previousLog].slice(0, MAX_LOG);
  return out;
}
