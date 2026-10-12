import type { EngineError, EngineErrorCode, EventType, GameEvent, GameState } from './types';

export function engineError(code: EngineErrorCode, message?: string): EngineError {
  return { code, message: message ?? code };
}

/** Appends a public event, or a private one when `to` is given. */
export function emit(
  state: GameState,
  events: GameEvent[],
  type: EventType,
  data: Record<string, unknown>,
  to?: string,
): void {
  state.seq += 1;
  events.push({
    seq: state.seq,
    type,
    visibility: to === undefined ? 'PUBLIC' : { to },
    data,
  });
}
