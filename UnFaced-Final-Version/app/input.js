import { state } from "../state.js";
import { sceneBounds, scrollingMaxSpd } from "../constants.js";
import { characterMe, labyrinthWalls } from "../layers.js";
import {
  scene3,
  scene4,
  sceneEscape,
  sceneMe,
  isScene3RedButtonHit,
  handleSceneMeScroll,
} from "../scenes.js";
import { escapeKeyState } from "./controls.js";

export function mouseWheel(event) {
  // don't move the whole page
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  if (state.storyStarted) {
    // get current mouse scrolling extent
    let mouseScrollingExtent = constrain(
      event.delta,
      -scrollingMaxSpd,
      scrollingMaxSpd
    );
    if (state.duringTransition) {
      // In Transition
      if (state.currentTransitionStartingPage == -1) return;
      // get current transition and 
      // change this trnasition's scrolling position
      let currentTransition =
        state.transitions[state.currentTransitionStartingPage];
      currentTransition.currentPosition += mouseScrollingExtent;
    } else {
      // not in transition & story started 
      // so find the current scene
      let activeScene = state.scenes.find((scene) =>
        scene.contains(state.currentScrollingPosition)
      );
      // current scrolling position is out of bound
      // roll back to the final scene
      if (!activeScene) {
        const betweenFactoryEndAndSceneMe =
          state.currentScrollingPosition >= sceneBounds[7].end &&
          state.currentScrollingPosition < sceneBounds[8].start;
        // edge case control
        if (
          betweenFactoryEndAndSceneMe &&
          !state.duringTransition &&
          state.transitions[3]
        ) {
          state.transitions[3].startTransition();
          return false;
        }
        state.currentScrollingPosition += mouseScrollingExtent;
        return false;
      }
      // sceneMe
      if (activeScene && activeScene.render === sceneMe) {
        handleSceneMeScroll(event); // go to the specific bouncing game
        return false;
      }
      // if current scene is not sceneMe nor sceneEscape
      if (activeScene && activeScene.render != sceneEscape) {
        // calculate next scroll to prevant overflow
        let nextScroll = state.currentScrollingPosition + mouseScrollingExtent;
        // not allowing scrolling to scene4 in scene3 (need transition)
        if (activeScene.render === scene3) {
          if (
            nextScroll >= activeScene.end &&
            state.transitions[1] &&
            !state.duringTransition
          ) {
            return false;
          }
          nextScroll = min(nextScroll, activeScene.end);
        } else if (activeScene.render === scene4) {
          // not allowing scrolling back to scene3 in scene4
          nextScroll = max(nextScroll, activeScene.start);
        }
        state.currentScrollingPosition = nextScroll;
      } else if (activeScene) {
        // in sceneEscape: change my position on the map
        let dx = constrain(-event.deltaX, -1, 1);
        let dy = constrain(-event.deltaY, -1, 1);
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
    }
  }
  return false;
}

export function mousePressed() {
  // in transition
  if (state.duringTransition) {
    const currentTransition =
      state.transitions[state.currentTransitionStartingPage];
    if (
      // only allow go to next scene after looking into the mirror
      currentTransition &&
      (currentTransition.transitionCode == 0 || currentTransition.videoContentShown)
    ) {
      currentTransition.allowEnd = true;
    }
  } else if (!state.storyStarted) {
    // in default page, click to start
    state.storyStarted = true;
    state.transitions[0].startTransition();
  } else if (isScene3RedButtonHit(mouseX, mouseY)) {
    // in scene 3, click the red button to open the door
    // and start transition 1
    if (state.doorOpenSound && !state.s3DoorSoundPlayed) {
      state.doorOpenSound.play();
      state.s3DoorSoundPlayed = true;
    }
    const transition = state.transitions[1];
    if (transition) {
      transition.startTransition();
    }
  }
}

export function keyPressed() {
  if (!state.storyStarted || state.duringTransition) return;
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    escapeKeyState.left = true;
    return false;
  }
  if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    escapeKeyState.right = true;
    return false;
  }
}

export function keyReleased() {
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    escapeKeyState.left = false;
    return false;
  }
  if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    escapeKeyState.right = false;
    return false;
  }
}
