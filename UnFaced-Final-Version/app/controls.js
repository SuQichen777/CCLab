import { state } from "../state.js";
import { sceneBounds } from "../constants.js";
import { characterMe, labyrinthWalls } from "../layers.js";

// Track horizontal input for the Chapter 2 escape scene.
export const escapeKeyState = {
  left: false,
  right: false,
};

export function resetEscapeKeys() {
  escapeKeyState.left = false;
  escapeKeyState.right = false;
}

export function handleSceneEscapeKeyboardMovement() {
  if (!state.storyStarted || state.duringTransition) return;
  let dx = 0;
  let dy = 0;
  if (escapeKeyState.left) {
    dx -= 1;
  }
  if (escapeKeyState.right) {
    dx += 1;
  }
  if (dx === 0 && dy === 0) return;
  characterMe.update(dx, dy, labyrinthWalls);
  if (characterMe.y < 0) {
    const transition = state.transitions[2];
    if (transition && !state.duringTransition) {
      transition.startTransition();
    }
  } else if (characterMe.y > 575) {
    state.currentScrollingPosition = sceneBounds[4].end - 100;
  }
}
