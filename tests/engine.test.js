import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { Engine } from "../engine/core/engine.js";
import { Scene } from "../engine/core/scene.js";
import { Entity } from "../engine/core/entity.js";
import { Rigidbody, intersects } from "../engine/physics/physics.js";

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, handler) {
      listeners.set(type, [...(listeners.get(type) ?? []), handler]);
    },
    removeEventListener(type, handler) {
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((h) => h !== handler),
      );
    },
  };
}

function createCanvasMock() {
  const gradient = { addColorStop() {} };
  const ctx = {
    canvas: null,
    save() {},
    restore() {},
    setTransform() {},
    translate() {},
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    rect() {},
    arc() {},
    fill() {},
    stroke() {},
    fillText() {},
    createRadialGradient: () => gradient,
  };
  const canvas = { width: 320, height: 180, getContext: () => ctx };
  ctx.canvas = canvas;
  return canvas;
}

class SmokeScene extends Scene {
  init() {
    this.mover = this.add(new Entity({ x: 0, y: 0, width: 10, height: 10 }));
    this.mover.velocityX = 60;
    this.mover.addComponent(new Rigidbody({ mass: 1 }));
  }
  update() {
    this.updated = true;
  }
}

export async function runEngineSmokeTests() {
  const target = createEventTarget();
  let frameCallback;
  globalThis.window = target;
  globalThis.requestAnimationFrame = (cb) => {
    frameCallback = cb;
    return 1;
  };
  globalThis.cancelAnimationFrame = () => {};
  globalThis.performance = { now: () => 0 };

  const engine = new Engine({
    canvas: createCanvasMock(),
    physics: true,
    inputTarget: target,
  });
  const scene = await engine.loadScene(new SmokeScene("smoke"));
  assert.equal(scene.started, true);
  assert.doesNotThrow(() => engine.start());
  frameCallback(16);
  assert.equal(scene.updated, true);
  assert.ok(scene.mover.x > 0);
  engine.stop();
  assert.equal(engine.running, false);

  assert.equal(
    intersects(
      { x: 0, y: 0, width: 5, height: 5 },
      { x: 4, y: 4, width: 5, height: 5 },
    ),
    true,
  );
  assert.equal(
    intersects(
      { x: 0, y: 0, width: 5, height: 5 },
      { x: 6, y: 6, width: 5, height: 5 },
    ),
    false,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runEngineSmokeTests();
  console.log("engine smoke tests passed");
}
