import { reduce, type StateAction } from "./state-machine.ts";
import { DEFAULT_STATE, type AppState } from "./types.ts";

const STORAGE_KEY = "typo:v1";
export const STATE_CHANGE = "typo:statechange";

let state: AppState = { ...DEFAULT_STATE };

export function getState(): AppState {
  return state;
}

export function dispatch(action: StateAction): void {
  state = reduce(state, action);
  persist();
  document.dispatchEvent(new CustomEvent<AppState>(STATE_CHANGE, { detail: state }));
}

export function update(patch: Partial<AppState>): void {
  dispatch({ type: "patch", patch });
}

export function onStateChange(listener: (state: AppState) => void): () => void {
  const handler = (event: Event) => {
    listener((event as CustomEvent<AppState>).detail);
  };
  document.addEventListener(STATE_CHANGE, handler);
  return () => document.removeEventListener(STATE_CHANGE, handler);
}

export function loadFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<AppState> & {
      responsive?: boolean;
      minBaseFontSizePx?: number;
      maxBaseFontSizePx?: number;
    };
    if (parsed.responsive !== undefined && parsed.fluidTypography === undefined) {
      parsed.fluidTypography = parsed.responsive;
    }
    delete parsed.responsive;
    delete parsed.minBaseFontSizePx;
    delete parsed.maxBaseFontSizePx;
    state = reduce(DEFAULT_STATE, { type: "patch", patch: parsed });
  } catch {
    state = { ...DEFAULT_STATE };
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
  }
}
