# UnFaced Final Version Structure

## Files and Responsibilities
- `index.html` – Boots p5.js and loads the module entry `sketch.js`.
- `sketch.js` – Main loop: creates layers, sets up `state.scenes`/`state.transitions`, renders the active scene each frame.
- `constants.js` – Static config (`sceneBounds`, `scrollingMaxSpd`, `transitionDuration`).
- `state.js` – Shared runtime state (current scroll, scenes, transitions, assets, sounds).
- `layers.js` – Creates p5 graphics layers (`maskLayer`, `envLayer`, `labyrinthLayer`, `tranEyeLayer`) and seeds reusable shapes/characters.
- `scenes.js` – `Scene` class plus all scene renderers (mask intro, room/door, chapter reveal, maze, factory, “WE” bounce) and `Transition` logic (blink/mirror/video).
- `classes/` – Reusable primitives (`Mask`, `Line`, `RectangleWithLine`, `Wall`, `Character`) used by scenes.
- `app/input.js` / `app/controls.js` – Mouse/keyboard routing: wheel drives scroll or transition time; click starts story or triggers door; keys move in the maze.
- `style.css`, `assets/` – Visual/audio assets.

## Runtime Flow
1) `preload` loads images, sounds, and ml5 facemesh; `setup` creates canvas, layers, and registers scenes/transitions.
2) `draw` checks `state.storyStarted`: if false, shows the default poster page; if true and `state.duringTransition`, renders the transition timeline; otherwise finds the active scene by `currentScrollingPosition` and renders it.
3) Input: mouse wheel updates scroll or transition progress; click starts the story or confirms end-of-transition; WASD/arrow keys move the player in the maze.
4) Scene-specific hooks: entering the maze resets the labyrinth; factory resets on entry; “WE” scene resets its physics grid.

## Scenes & Transitions
- Scene0 default page: poster shake on black background.
- Scene1 mask intro: animated mask vignette.
- Scene2 room framing: noisy room + walls + door scaffold.
- Scene3 door + red button: click to trigger Transition 1.
- Scene4 chapter reveal: title cover + map zoom.
- SceneEscape: maze with player/enemy collision and color gradient.
- SceneFactory: conveyor with spawned cargos tied to scroll.
- SceneFactoryEnd: focus zoom on factory image; auto-start Transition 3 at end.
- SceneMe: “W/E” bouncing physics on grid sampling; triggers final Transition 4.
- Transitions: blink → room zoom → mirror cover with heartbeat, then mosaic/video variants (1–4) using webcam and facemesh.

## Typical Workflow to Add/Change a Scene
1) Update `sceneBounds` in `constants.js` for timing; add a render function in `scenes.js`.
2) If new shapes/characters are needed, init them in `layers.js` or add a class under `classes/`.
3) Register the scene in `sketch.js` by pushing a `Scene` with bounds and renderer.
4) Add any transition triggers (e.g., click/scroll thresholds) inside the scene.
5) Test scroll ranges and transitions to ensure layering and state reset are correct.

## TODO
- Change `state.currentScrollingPosition = sceneBounds[2].end - 100;` into the real reset scene in `sketch.js` and `scenes.js`.
- Add sound effect polish and sequencing.
- Fix: pressing mouse before ml5.js loads can skip default page + first transition.
- Fix: entering Chapter 3 without pressing the red button.

## Flowchart
            [Default Page]
                 |
      click? ----+---- no
       yes            | loop
       |              |
       v              |
   [Transition 0] <---+
       |
       v
   (Ch1)[Scene 1: Mask]
       |scroll
       v
   (Ch1)[Scene 2: Room]
       |scroll
       v
   (Ch1)[Scene 3: Door + Red Button]
       |click red button
       v
   [Transition 1]
       |scroll & click
       v
   (Ch2)[Scene 4: Chapter2 Reveal]
       |scroll
       v
   (Ch2)[Scene Escape: Maze]
       | (reach bottom back Scene 4)
       | (reach top starts Transition 2)
       v
   [Transition 2]
       |scroll & click
       v
   (Ch3)[Scene Factory]
       |scroll
       v
   (Ch3)[Scene Factory End]
       |scroll
       v
   [Transition 3]
       |scroll & click
       v
   (Ch4)[Scene Me]
       |scroll
       v
   [Transition 4]
       |
       v
      End
