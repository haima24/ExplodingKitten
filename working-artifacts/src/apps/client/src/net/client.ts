import type { Dispatch } from 'react';
import type { ClientPayload, ClientType, GameActionPayload } from '@wb/protocol';
import {
  PROTOCOL_VERSION,
  type DisplayName,
  type ErrorCode,
  type RoomEndedReason,
  type ServerMessage,
  type ServerPayloads,
} from '@wb/protocol/shared';
import { t } from '../copy';
import { speechTag } from '../copy/locale';
import { displayName } from '../copy/names';
import { processGameUpdate, type Processed } from '../features/game/events';
import { announcer } from '../lib/announcer';
import { clearSession, saveSession } from '../lib/session';
import type { Action, State } from './state';

export class ServerError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly data?: { taken?: string[] },
  ) {
    super(code);
  }
}
export class ConnectionLost extends Error {}
export class AckTimeout extends Error {}

export type ActionResult = { ok: true } | { ok: false; code: ErrorCode | 'TIMEOUT' | 'OFFLINE' | 'BUSY' };

interface PendingRequest {
  resolve: (message: ServerMessage) => void;
  reject: (error: Error) => void;
  timer: number;
}

const ACK_TIMEOUT_MS = 5_000;
const HEARTBEAT_MS = 15_000;
const PONG_TIMEOUT_MS = 10_000;
const RECONNECT_WINDOW_MS = 70_000;
const BACKOFF_MS = [500, 1_000, 2_000, 4_000, 8_000];
const SEAT_LOST_CODES: readonly ErrorCode[] = ['BAD_TOKEN', 'ROOM_NOT_FOUND', 'ROOM_CLOSED', 'REMOVED'];

export type RejoinResult = 'ok' | 'none' | 'gone' | 'removed' | 'lost';

const randomId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

/**
 * Owns the WebSocket: connect, heartbeat, backoff, request/ack promises, rejoin,
 * and turning server messages into store actions. The server is the only source
 * of truth; nothing here edits game data locally.
 */
export class GameClient {
  private ws: WebSocket | null = null;
  private pending = new Map<string, PendingRequest>();
  private waiters: { resolve: () => void; reject: (e: Error) => void }[] = [];
  private seq = 0;
  private attempt = 0;
  private lostAt = 0;
  private retryTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private rejoining: Promise<RejoinResult> | null = null;
  private toastId = 0;

  constructor(
    private readonly dispatch: Dispatch<Action>,
    private readonly getState: () => State,
  ) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.retryNow();
    });
    window.addEventListener('online', () => this.retryNow());
  }

  // --------------------------------------------------------------- connection

  private url(): string {
    // Split deployments (static client on Vercel, server elsewhere) set VITE_WS_URL at build time.
    const configured = import.meta.env.VITE_WS_URL as string | undefined;
    if (configured) return configured;
    const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${scheme}//${location.host}/ws`;
  }

  private setStatus(status: State['connection']['status']): void {
    this.dispatch({ type: 'conn/status', status });
  }

  private open(): void {
    if (this.ws) return;
    const ws = new WebSocket(this.url());
    this.ws = ws;
    if (this.lostAt === 0) this.setStatus('connecting');

    ws.onopen = () => {
      if (this.ws !== ws) return;
      this.attempt = 0;
      this.lostAt = 0;
      this.setStatus('online');
      this.startHeartbeat();
      for (const w of this.waiters.splice(0)) w.resolve();
      if (this.getState().session) void this.rejoin();
    };
    ws.onmessage = (event) => {
      if (typeof event.data === 'string') this.onMessage(event.data);
    };
    ws.onerror = () => {
      /* a close event always follows */
    };
    ws.onclose = () => this.onClose(ws);
  }

  private onClose(ws: WebSocket): void {
    if (this.ws !== ws) return;
    this.ws = null;
    this.stopHeartbeat();
    this.rejoining = null;
    for (const [id, p] of this.pending) {
      window.clearTimeout(p.timer);
      p.reject(new ConnectionLost());
      this.pending.delete(id);
    }

    const wantReconnect = this.getState().session !== null;
    if (!wantReconnect) {
      this.lostAt = 0;
      this.setStatus('idle');
      for (const w of this.waiters.splice(0)) w.reject(new ConnectionLost());
      return;
    }
    if (this.lostAt === 0) this.lostAt = Date.now();
    if (Date.now() - this.lostAt > RECONNECT_WINDOW_MS) {
      this.setStatus('offline');
      return;
    }
    this.setStatus('reconnecting');
    const base = BACKOFF_MS[Math.min(this.attempt, BACKOFF_MS.length - 1)] ?? 8_000;
    this.attempt += 1;
    const jittered = base * (0.75 + Math.random() * 0.5);
    this.retryTimer = window.setTimeout(() => {
      this.retryTimer = null;
      this.open();
    }, jittered);
  }

  /** Try right away (tab became visible, network came back, or the user pressed Try again). */
  retryNow(): void {
    const { status } = this.getState().connection;
    if (this.ws || (status !== 'reconnecting' && status !== 'offline')) return;
    if (status === 'offline') this.lostAt = Date.now();
    if (this.retryTimer !== null) window.clearTimeout(this.retryTimer);
    this.retryTimer = null;
    this.open();
  }

  /** Resolves once the socket is open; rejects after `timeoutMs`. */
  ensureConnected(timeoutMs = 5_000): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        const at = this.waiters.indexOf(waiter);
        if (at >= 0) this.waiters.splice(at, 1);
        reject(new Error('timeout'));
      }, timeoutMs);
      const waiter = {
        resolve: () => {
          window.clearTimeout(timer);
          resolve();
        },
        reject: (e: Error) => {
          window.clearTimeout(timer);
          reject(e);
        },
      };
      this.waiters.push(waiter);
      if (this.retryTimer !== null) {
        window.clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
      this.open();
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      this.request('ping', { t: Date.now() }, PONG_TIMEOUT_MS).catch(() => this.ws?.close());
    }, HEARTBEAT_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) window.clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  // ----------------------------------------------------------------- requests

  request<T extends ClientType>(
    type: T,
    payload: ClientPayload<T>,
    timeoutMs = ACK_TIMEOUT_MS,
  ): Promise<ServerMessage> {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return Promise.reject(new ConnectionLost());
    const id = String(++this.seq);
    return new Promise<ServerMessage>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(id);
        reject(new AckTimeout());
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ v: PROTOCOL_VERSION, t: type, id, p: payload }));
    });
  }

  private onMessage(text: string): void {
    let message: ServerMessage;
    try {
      message = JSON.parse(text) as ServerMessage;
    } catch {
      return;
    }
    if (!message || typeof message.t !== 'string') return;

    if (message.id !== undefined) {
      const p = this.pending.get(message.id);
      if (p) {
        this.pending.delete(message.id);
        window.clearTimeout(p.timer);
        if (message.t === 'error') {
          const payload = message.p as ServerPayloads['error'];
          p.reject(new ServerError(payload.code, payload.data));
        } else {
          p.resolve(message);
        }
      }
    }

    switch (message.t) {
      case 'hello':
        this.dispatch({
          type: 'conn/offset',
          offset: (message.p as ServerPayloads['hello']).serverTime - Date.now(),
        });
        break;
      case 'room.joined':
        this.onJoined(message.p as ServerPayloads['room.joined']);
        break;
      case 'room.update':
        this.onRoomUpdate(message.p as ServerPayloads['room.update']);
        break;
      case 'game.update':
        this.onGameUpdate(message.p as ServerPayloads['game.update']);
        break;
      case 'game.hover': {
        const hover = message.p as ServerPayloads['game.hover'];
        this.dispatch({ type: 'game/hover', hover: hover.position === null ? null : hover });
        break;
      }
      case 'absent.update':
        this.dispatch({ type: 'absent/set', absent: (message.p as ServerPayloads['absent.update']).absent });
        break;
      case 'room.ended':
        this.endRoom((message.p as ServerPayloads['room.ended']).reason);
        break;
      default:
        break;
    }
  }

  // ------------------------------------------------------- server -> store

  private onJoined(p: ServerPayloads['room.joined']): void {
    const existing = this.getState().session;
    const token = p.token || (existing?.code === p.room.code ? existing.token : '');
    const session = { code: p.room.code, token, playerId: p.playerId };
    saveSession(session);
    this.dispatch({ type: 'session/set', session });
    this.dispatch({ type: 'room/view', view: p.room });
  }

  private onRoomUpdate(p: ServerPayloads['room.update']): void {
    const state = this.getState();
    if (!state.session) return;
    this.dispatch({ type: 'room/view', view: p.room });
    // A rematch or "end game" sends everyone back to the lobby: drop the old game.
    if (p.room.phase === 'LOBBY' && state.game.view) this.dispatch({ type: 'game/clear' });
    for (const notice of p.notices ?? []) {
      const text = t(`notice.${notice.kind}` as const, { name: notice.who ? displayName(notice.who) : notice.name });
      announcer.announce(text);
      if (notice.kind === 'NEW_HOST' || notice.kind === 'LOST_CONNECTION') this.toast(text);
    }
  }

  private onGameUpdate(p: ServerPayloads['game.update']): void {
    const state = this.getState();
    const current = state.game.view;
    if (current && p.view.version < current.version) return; // stale snapshot
    const result = processGameUpdate({
      events: p.events,
      view: p.view,
      room: state.room.view,
      previousLog: state.game.log,
      previousPlayedThisTurn: state.game.playedThisTurn,
      firstUpdate: current === null,
    });
    this.dispatch({
      type: 'game/update',
      view: p.view,
      log: result.log,
      playedThisTurn: result.playedThisTurn,
    });
    for (const text of result.announcements) announcer.announce(text);
    if (result.toast) this.toast(result.toast);
    if (result.peek) this.dispatch({ type: 'ui/peek', cards: result.peek });
    if (result.nap) this.dispatch({ type: 'ui/nap', on: true });
    if (result.reveal) this.dispatch({ type: 'ui/reveal', card: result.reveal });
    for (const tip of result.tips) this.dispatch({ type: 'tips/trigger', tip });
    if (result.flash) this.dispatch({ type: 'ui/flash', flash: { playerId: result.flash, id: ++this.toastId } });
    this.feedback(result.sounds, result.voice);
  }

  /** Sound effects first, then the spoken line, each only if the player turned it on. */
  feedback(sounds: Processed['sounds'], voice: Processed['voice']): void {
    const { settings } = this.getState();
    let soundSeconds = 0;
    const effects =
      settings.sound && sounds.length > 0
        ? import('../lib/audio').then((audio) => {
            audio.setVolume(settings.volume);
            soundSeconds = audio.playSequence(sounds);
          })
        : Promise.resolve();
    if (settings.voice && voice.length > 0) {
      void Promise.all([effects, import('../lib/voice')]).then(([, speech]) => {
        speech.configureVoice({ lang: speechTag(settings.language), volume: settings.voiceVolume });
        speech.enqueueVoice(
          voice.map((cue) => ({ id: cue.id, text: t(`voice.${cue.id}` as const), priority: cue.priority })),
          Math.min(1500, Math.round(soundSeconds * 1000)),
        );
      });
    } else {
      void effects;
    }
  }

  private endRoom(reason: RoomEndedReason): void {
    clearSession();
    this.dispatch({ type: 'room/ended', reason });
  }

  // ------------------------------------------------------------------ helpers

  toast(text: string): void {
    this.dispatch({ type: 'ui/toast', message: { id: ++this.toastId, text } });
  }

  inline(text: string): void {
    this.dispatch({ type: 'ui/inline', message: { id: ++this.toastId, text } });
  }

  // --------------------------------------------------------------- operations

  /** Rebuilds state from a fresh server snapshot using the stored token. */
  rejoin(): Promise<RejoinResult> {
    if (this.rejoining) return this.rejoining;
    const session = this.getState().session;
    if (!session) return Promise.resolve('none');
    const run = (async (): Promise<RejoinResult> => {
      try {
        await this.ensureConnected();
        await this.request('room.rejoin', { code: session.code, token: session.token });
        return 'ok';
      } catch (error) {
        if (error instanceof ServerError && SEAT_LOST_CODES.includes(error.code)) {
          clearSession();
          const removed = error.code === 'REMOVED';
          this.dispatch({ type: 'room/ended', reason: removed ? 'REMOVED' : 'NO_SEAT' });
          return removed ? 'removed' : 'gone';
        }
        return 'lost';
      } finally {
        this.rejoining = null;
      }
    })();
    this.rejoining = run;
    return run;
  }

  /** Forget the stored seat without telling the server (used by "Forget it"). */
  forgetSession(): void {
    clearSession();
    this.dispatch({ type: 'session/set', session: null });
    this.dispatch({ type: 'room/reset' });
  }

  async createRoom(name: DisplayName, avatarId: string): Promise<string> {
    await this.ensureConnected();
    const reply = await this.request('room.create', { name: { adjective: name.adjective, noun: name.noun }, avatarId });
    return (reply.p as ServerPayloads['room.joined']).room.code;
  }

  async joinRoom(code: string, name: DisplayName, avatarId: string): Promise<string> {
    await this.ensureConnected();
    const reply = await this.request('room.join', {
      code,
      name: { adjective: name.adjective, noun: name.noun },
      avatarId,
    });
    return (reply.p as ServerPayloads['room.joined']).room.code;
  }

  /** Leave on purpose; the local seat is cleared even if the server cannot be reached. */
  async leaveRoom(): Promise<void> {
    try {
      await this.request('room.leave', {});
    } catch {
      /* the seat is forgotten locally either way */
    }
    this.forgetSession();
  }

  async command(type: 'room.close' | 'room.start' | 'room.rematch' | 'room.addBot' | 'game.end' | 'room.keepAlive'): Promise<void> {
    await this.request(type, {});
  }

  /** Host only, in the lobby: seconds per turn, 0 = Off (US-063). */
  async setTurnTimer(turnTimerSec: 0 | 15 | 30 | 60): Promise<void> {
    await this.request('room.settings', { turnTimerSec });
  }

  async kick(playerId: string): Promise<void> {
    await this.request('room.kick', { playerId });
  }

  async skipAbsent(playerId: string, decision: 'WAIT' | 'SKIP'): Promise<void> {
    await this.request('game.skipAbsent', { playerId, decision });
  }

  /** Sends a message that needs no answer (the taker's finger position, US-066). */
  fire<T extends ClientType>(type: T, payload: ClientPayload<T>): void {
    const ws = this.ws;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ v: PROTOCOL_VERSION, t: type, p: payload }));
  }

  /** One in-flight game action at a time; the next snapshot is the truth. */
  async sendAction(action: GameActionPayload): Promise<ActionResult> {
    if (this.getState().ui.pendingActionId) return { ok: false, code: 'BUSY' };
    const actionId = randomId();
    this.dispatch({ type: 'ui/pending', id: actionId });
    try {
      await this.request('game.action', { actionId, action });
      return { ok: true };
    } catch (error) {
      if (error instanceof ServerError) return { ok: false, code: error.code };
      if (error instanceof AckTimeout) return { ok: false, code: 'TIMEOUT' };
      return { ok: false, code: 'OFFLINE' };
    } finally {
      this.dispatch({ type: 'ui/pending', id: null });
    }
  }
}
