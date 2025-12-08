# UnFaced Final Version Structure

## Files and Responsibilities
- `index.html` – Loads p5 and the module entry `sketch.js`.
- `sketch.js` – the entry point of the whole canvas: creates layers, sets up `state.scenes` in Setup, and renders the active scene each frame in Draw.
- `constants.js` – Static configuration, including scrolling speed and scene bound (start and end).
- `state.js` – Shared runtime state including `currentScrollingPosition` and the `scenes` array.
- `layers.js` – Creates graphics layers (`maskLayer`, `envLayer`, `handLayer`), and initializes and export instances drawn on those layers (hand, mask, room, walls, door).
- `scenes.js` – `Scene` class and scene render functions (`scene1`, `scene2`, `scene3`, `scene4`) that dynamically updates using exports from `layers` and `state`.
- `classes/` – Reusable primitives (`Mask`, `Hand`, `Line`, `RectangleWithLine`), importing shared state/constants when needed.

## Typical Workflow to Add/Change a Scene
1) Add or update scene timing in `constants.js` (`sceneBounds` entry, scroll speed if needed).
2) If new primitives or graphics are required, add/extend classes in `classes/` or initialize new layer elements in `layers.js` and export them.
3) Implement the scene render function in `scenes.js` (read/update exported layer instances and `state`).
4) Register the new scene in `sketch.js` by pushing a `Scene` instance into `state.scenes`, using the bounds from `constants.js` and your render function.
5) Run and verify that `draw` picks up the scene at the expected scroll range.

## TODO:
- Change `state.currentScrollingPosition = sceneBounds[2].end - 100;`into the real reset scene in `sketch.js` and `scenes.js`
- Link Default Page and the First Scene
- Add Sound Effect