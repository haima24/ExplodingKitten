import { resolve } from 'node:path';
import type { DeckProfileName } from '@wb/engine/types';

/** All defaults are proposals (see dev-specs README section 2.4). */
export interface Config {
  port: number;
  host: string;
  production: boolean;
  testMode: boolean;
  allowedOrigins: string[];
  trustedProxies: string[];
  staticDir: string | null;
  deckProfile: DeckProfileName;

  roomCapacity: number;
  minPlayers: number;
  heartbeatMs: number;
  deadAfterMs: number;
  reconnectWindowMs: number;
  hostAwayMs: number;
  idleLobbyMs: number;
  idleGameMs: number;
  finishedTtlMs: number;
  maxLifetimeMs: number;
  idleWarnMs: number;
  emptyRoomGraceMs: number;
  codeQuarantineMs: number;

  joinFailLimit: number;
  joinFailWindowMs: number;
  joinBlockMs: number;
  maxRoomsPerIp: number;
  maxRooms: number;
  maxMessageBytes: number;
  msgRate: number;
  msgBurst: number;
  actionDedupeWindow: number;
  /** How long a Nope response window stays open (the engine has no clock). */
  nopeWindowMs: number;
  connPerMinute: number;

  botMinDelayMs: number;
  botMaxDelayMs: number;
  /** Random delay on failed joins so timing does not leak (US-061). */
  failDelayMinMs: number;
  failDelayMaxMs: number;
}

const num = (env: NodeJS.ProcessEnv, key: string, fallback: number): number => {
  const raw = env[key];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid number for ${key}`);
  return n;
};

const list = (raw: string | undefined): string[] =>
  (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const production = env['NODE_ENV'] === 'production';
  const testMode = env['TEST_MODE'] === '1';
  if (testMode && production) {
    throw new Error('Refusing to start: TEST_MODE must not be set when NODE_ENV=production');
  }
  const profile = env['DECK_PROFILE'] ?? 'mvp+should';
  if (profile !== 'mvp' && profile !== 'mvp+should') {
    throw new Error('DECK_PROFILE must be "mvp" or "mvp+should"');
  }

  const t = testMode;
  return {
    port: num(env, 'PORT', 3001),
    host: env['HOST'] ?? '0.0.0.0',
    production,
    testMode,
    allowedOrigins: list(env['ALLOWED_ORIGINS']),
    trustedProxies: list(env['TRUSTED_PROXIES']),
    // Relative paths resolve from where the command was run (pnpm sets INIT_CWD).
    staticDir: env['STATIC_DIR'] ? resolve(env['INIT_CWD'] ?? process.cwd(), env['STATIC_DIR']) : null,
    deckProfile: profile,

    roomCapacity: num(env, 'ROOM_CAPACITY', 4),
    minPlayers: num(env, 'MIN_PLAYERS', 2),
    heartbeatMs: num(env, 'HEARTBEAT_MS', 15_000),
    deadAfterMs: num(env, 'DEAD_AFTER_MS', 35_000),
    reconnectWindowMs: num(env, 'RECONNECT_WINDOW_MS', t ? 2_000 : 60_000),
    hostAwayMs: num(env, 'HOST_AWAY_MS', t ? 2_000 : 60_000),
    idleLobbyMs: num(env, 'IDLE_LOBBY_MS', t ? 60_000 : 1_800_000),
    idleGameMs: num(env, 'IDLE_GAME_MS', t ? 60_000 : 1_800_000),
    finishedTtlMs: num(env, 'FINISHED_TTL_MS', t ? 60_000 : 900_000),
    maxLifetimeMs: num(env, 'MAX_LIFETIME_MS', 10_800_000),
    idleWarnMs: num(env, 'IDLE_WARN_MS', t ? 10_000 : 120_000),
    emptyRoomGraceMs: num(env, 'EMPTY_ROOM_GRACE_MS', t ? 5_000 : 60_000),
    codeQuarantineMs: num(env, 'CODE_QUARANTINE_MS', 86_400_000),

    joinFailLimit: num(env, 'JOIN_FAIL_LIMIT', 10),
    joinFailWindowMs: num(env, 'JOIN_FAIL_WINDOW_MS', 60_000),
    joinBlockMs: num(env, 'JOIN_BLOCK_MS', 60_000),
    maxRoomsPerIp: num(env, 'MAX_ROOMS_PER_IP', 5),
    maxRooms: num(env, 'MAX_ROOMS', 500),
    maxMessageBytes: num(env, 'MAX_MESSAGE_BYTES', 4096),
    msgRate: num(env, 'MSG_RATE', 20),
    msgBurst: num(env, 'MSG_BURST', 40),
    actionDedupeWindow: num(env, 'ACTION_DEDUPE_WINDOW', 64),
    nopeWindowMs: num(env, 'NOPE_WINDOW_MS', t ? 1_500 : 8_000),
    connPerMinute: num(env, 'CONN_PER_MINUTE', t ? 10_000 : 30),

    botMinDelayMs: t ? 20 : 800,
    botMaxDelayMs: t ? 60 : 1_500,
    failDelayMinMs: t ? 0 : 100,
    failDelayMaxMs: t ? 0 : 200,
  };
}
