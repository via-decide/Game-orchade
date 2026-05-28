# Zayvora Strategy Prototype

A source-only, browser-run game prototype evolving from an early canvas runner/farming experiment into an original mobile strategy/base-builder game. The current repository is still a lightweight HTML/CSS/JavaScript prototype: future changes should preserve the no-build, static-site workflow while replacing runner-centric language and mechanics with original base-building systems.

## Game Vision

Zayvora is planned as an original mobile-first strategy/base-builder about establishing and defending a frontier settlement on an unstable alien world. The target experience is short-session play with readable touch controls, persistent base progression, resource loops, map expansion, farming/production choices, environmental hazards, and lightweight enemy pressure. This is not intended to clone any existing game; mechanics, terminology, worldbuilding, and progression should remain original IP.

## Current Tech Stack

- Vanilla JavaScript ES modules running directly in the browser from `index.html` and `game.js`.
- HTML canvas rendering through the custom engine modules under `engine/`.
- Plain CSS in `style.css`; no framework, bundler, or generated build output is required for runtime.
- Local browser persistence through `src/save/saveManager.js`.
- Current gameplay scaffolding includes a tile world, player entity, farming interaction, score HUD, overlays, asset loader, physics/input/render/effects/debug engine modules, and launcher metadata in `mars.json` / `metadata.json`.
- `package.json` currently declares Puppeteer as a development/smoke-test dependency, but there are no npm scripts and the game itself does not require npm to run.

## Setup Instructions

1. Clone the repository.
2. From the repository root, run a simple static server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000` in a modern browser.
4. For a quick direct check, open `index.html`; if module loading is blocked by the browser, use the static server above.
5. Keep deployment static: no build command, no output directory, and no generated assets are required.

## Development Roadmap

### P0 — Stabilize the Prototype Foundation

- Keep the existing browser-only runtime stable while documenting the current engine, scene, entity, input, render, save, and UI responsibilities.
- Rename visible runner-era language toward Zayvora/base-builder terminology without breaking current gameplay.
- Verify canvas scaling, pause/restart flow, local save behavior, and basic keyboard interaction.
- Preserve static hosting compatibility and avoid introducing frameworks, bundlers, or generated build folders.

### P1 — Mobile-First Base Builder Core

- Add touch-friendly camera/player/base interactions and responsive HUD layouts.
- Define original resources, production tiles, storage, harvesting, and construction rules.
- Expand the tile world into buildable zones with clear placement feedback and save/load state.
- Introduce accessible onboarding for the first base loop: gather, build, produce, upgrade.

### P2 — Strategy Progression and World Pressure

- Add base upgrades, unlocks, timed production choices, and meaningful resource tradeoffs.
- Introduce environmental hazards and enemy pressure as original systems that interact with the settlement.
- Build mission/objective scaffolding for short mobile sessions and longer-term progression.
- Improve telemetry-free debug tools for balancing gameplay values in the browser.

### P3 — Polish, Content, and Launch Readiness

- Replace placeholder presentation with text-referenced asset plans and source-only manifests before any real asset pipeline is approved.
- Refine mobile performance, readability, accessibility, and offline-friendly persistence.
- Add more maps, events, mission arcs, balancing passes, and documented QA checklists.
- Prepare static-site deployment guidance for GitHub Pages/Vercel with no required build step.
