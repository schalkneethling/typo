import { DEFAULT_STATE, type AppState } from "./types.ts";

export type StateAction = { type: "patch"; patch: Partial<AppState> } | { type: "reset" };

export function reduce(state: AppState, action: StateAction): AppState {
  switch (action.type) {
    case "patch": {
      const patch = { ...action.patch };
      if (patch.fluidTypography === false) {
        patch.fluidCssFunction = false;
      }
      return { ...state, ...patch };
    }
    case "reset":
      return { ...DEFAULT_STATE };
  }
}
