import { getState, update } from "../app/store.ts";
import type { AppState } from "../app/types.ts";

const STATE_KEY = "data-state-key";

function findStateControl(root: HTMLElement, target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  const control = target.closest<HTMLElement>(`[${STATE_KEY}]`);
  if (!control || !root.contains(control)) return null;
  return control;
}

function parseNumberInput(input: HTMLInputElement): number | null {
  const parsed = Number.parseFloat(input.value);
  if (Number.isNaN(parsed)) return null;
  let value = parsed;
  if (input.min !== "") value = Math.max(Number.parseFloat(input.min), value);
  if (input.max !== "") value = Math.min(Number.parseFloat(input.max), value);
  return value;
}

function applyNumberInput(input: HTMLInputElement, key: keyof AppState): void {
  const value = parseNumberInput(input);
  if (value === null) {
    input.classList.add("field--invalid");
    return;
  }
  input.classList.remove("field--invalid");
  update({ [key]: value } as Partial<AppState>);
  input.value = String(getState()[key]);
}

function syncUnitToggle(root: HTMLElement): void {
  const unit = getState().displayUnit;
  for (const btn of root.querySelectorAll<HTMLButtonElement>('[data-state-key="displayUnit"]')) {
    btn.setAttribute("aria-pressed", String(btn.dataset.stateValue === unit));
  }
}

function handleStateEvent(root: HTMLElement, event: Event): void {
  const control = findStateControl(root, event.target);
  if (!control) return;

  const key = control.dataset.stateKey as keyof AppState | undefined;
  if (!key) return;

  if (control instanceof HTMLButtonElement && control.dataset.stateValue !== undefined) {
    if (event.type !== "click") return;
    update({ [key]: control.dataset.stateValue } as Partial<AppState>);
    syncUnitToggle(root);
    return;
  }

  if (control instanceof HTMLInputElement) {
    if (control.type === "number") {
      if (event.type !== "change" && event.type !== "blur") return;
      applyNumberInput(control, key);
      return;
    }
    if (control.type === "checkbox") {
      if (event.type !== "change") return;
      update({ [key]: control.checked } as Partial<AppState>);
      return;
    }
    if (control.type === "color") {
      if (event.type !== "input") return;
      update({ [key]: control.value } as Partial<AppState>);
      return;
    }
    if (control.type === "text") {
      if (event.type !== "change") return;
      update({ [key]: control.value } as Partial<AppState>);
      return;
    }
  }

  if (control instanceof HTMLSelectElement) {
    if (event.type !== "change") return;
    const value =
      control.dataset.stateParse === "int" ? Number.parseInt(control.value, 10) : control.value;
    update({ [key]: value } as Partial<AppState>);
  }
}

export function setStateKey(el: HTMLElement, key: keyof AppState): void {
  el.dataset.stateKey = key;
}

export function setStateButton(btn: HTMLButtonElement, key: keyof AppState, value: string): void {
  btn.dataset.stateKey = key;
  btn.dataset.stateValue = value;
}

export function bindSettingsDelegation(root: HTMLElement): void {
  if (root.dataset.stateDelegation === "true") return;
  root.dataset.stateDelegation = "true";

  const onEvent = (event: Event) => handleStateEvent(root, event);
  root.addEventListener("input", onEvent);
  root.addEventListener("change", onEvent);
  root.addEventListener("blur", onEvent, true);
  root.addEventListener("click", onEvent);
}
