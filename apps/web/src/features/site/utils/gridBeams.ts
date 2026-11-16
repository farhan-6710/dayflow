import type { GridBeamsConfig } from "@/features/site/constants/heroBeams";

type Node = { col: number; row: number };
type Dir = { dc: number; dr: number };
type Turn = "left" | "right" | null;

type Beam = {
  state: "waiting" | "running" | "fading";
  /** Crossings visited, oldest first; the head is between the last one and the next along `dir`. */
  path: Node[];
  dir: Dir;
  lastTurn: Turn;
  /** Distance travelled along the current segment, in px. */
  progress: number;
  speed: number;
  trail: number;
  segmentsLeft: number;
  /** Opacity multiplier while fading out, 1 to 0. */
  fade: number;
  /** Time left before a waiting beam starts, in ms. */
  wait: number;
};

/** Where the grid's lines are inside the canvas: it is tiled from the horizontal centre and the top. */
type Grid = {
  width: number;
  height: number;
  originX: number;
  cell: number;
  cols: number;
  rows: number;
  /** Horizontal span beams may not enter, in px. */
  clear: { from: number; to: number };
};

const DIRS: Dir[] = [
  { dc: 1, dr: 0 },
  { dc: -1, dr: 0 },
  { dc: 0, dr: 1 },
  { dc: 0, dr: -1 },
];
/** Random tries at finding a start crossing outside the clear band before waiting for the next round. */
const SPAWN_TRIES = 24;
/** Longest frame step, so a background tab coming back doesn't teleport the beams. */
const MAX_FRAME_MS = 50;

const between = (range: { min: number; max: number }) => range.min + Math.random() * (range.max - range.min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function makeGrid(width: number, height: number, config: GridBeamsConfig): Grid {
  const cell = config.cellSize;
  // A centred background tile starts half a tile left of the middle; the lines are each tile's left edge.
  const originX = ((((width - cell) / 2) % cell) + cell) % cell;
  const clear = { from: (width - config.clearWidth) / 2, to: (width + config.clearWidth) / 2 };
  return { width, height, originX, cell, cols: Math.floor((width - originX) / cell), rows: Math.floor(height / cell), clear };
}

/** Pixel centre of a crossing; the 1px lines are drawn from each tile's edge, so their middle is +0.5. */
const pointOf = (grid: Grid, node: Node) => ({ x: grid.originX + node.col * grid.cell + 0.5, y: node.row * grid.cell + 0.5 });
/** A crossing a beam may use: on the grid and outside the clear band down the middle. */
function inside(grid: Grid, node: Node) {
  if (node.col < 0 || node.col > grid.cols || node.row < 0 || node.row > grid.rows) return false;
  const x = grid.originX + node.col * grid.cell;
  return x < grid.clear.from || x > grid.clear.to;
}
const step = (node: Node, dir: Dir): Node => ({ col: node.col + dir.dc, row: node.row + dir.dr });
const turnOf = (dir: Dir, turn: "left" | "right"): Dir => (turn === "left" ? { dc: dir.dr, dr: -dir.dc } : { dc: -dir.dr, dr: dir.dc });

function waiting(config: GridBeamsConfig, first = false): Beam {
  const delay = between(config.respawnDelay);
  return {
    state: "waiting",
    path: [],
    dir: DIRS[0],
    lastTurn: null,
    progress: 0,
    speed: 0,
    trail: 0,
    segmentsLeft: 0,
    fade: 1,
    // On the first frame, spread the starts so the beams don't all appear together.
    wait: first ? Math.random() * delay * 2 : delay,
  };
}

function randomStart(grid: Grid, config: GridBeamsConfig): Node | null {
  const topRow = Math.floor(grid.rows * config.spawnRows.top);
  const bottomRow = Math.max(topRow, Math.floor(grid.rows * config.spawnRows.bottom));
  for (let attempt = 0; attempt < SPAWN_TRIES; attempt += 1) {
    const node = { col: Math.floor(Math.random() * (grid.cols + 1)), row: topRow + Math.floor(Math.random() * (bottomRow - topRow + 1)) };
    if (inside(grid, node)) return node;
  }
  return null;
}

function spawn(grid: Grid, config: GridBeamsConfig): Beam {
  const node = randomStart(grid, config);
  // No room beside the clear band (a narrow screen): try again after the usual pause.
  if (!node) return waiting(config);
  const options = DIRS.filter((dir) => inside(grid, step(node, dir)));
  return {
    state: "running",
    path: [node],
    dir: options.length ? pick(options) : DIRS[0],
    lastTurn: null,
    progress: 0,
    speed: between(config.speed),
    trail: between(config.trailLength),
    segmentsLeft: Math.round(between(config.segments)),
    fade: 1,
    wait: 0,
  };
}

/** At a crossing: carry on, or turn, preferring the opposite turn to the last one for a zigzag. */
function chooseDirection(grid: Grid, config: GridBeamsConfig, at: Node, dir: Dir, lastTurn: Turn): { dir: Dir; lastTurn: Turn } {
  const valid = (next: Dir) => inside(grid, step(at, next));
  const turns = (["left", "right"] as const).filter((turn) => valid(turnOf(dir, turn)));
  const straight = valid(dir);

  if (turns.length && (!straight || Math.random() < config.turnChance)) {
    const zig = lastTurn === "left" ? "right" : lastTurn === "right" ? "left" : null;
    const turn = zig && turns.includes(zig) && Math.random() < config.zigzag ? zig : pick(turns);
    return { dir: turnOf(dir, turn), lastTurn: turn };
  }
  if (straight) return { dir, lastTurn };
  return { dir: { dc: -dir.dc, dr: -dir.dr }, lastTurn: null };
}

function advance(beam: Beam, grid: Grid, config: GridBeamsConfig, ms: number): Beam {
  if (beam.state === "waiting") {
    const wait = beam.wait - ms;
    return wait > 0 ? { ...beam, wait } : spawn(grid, config);
  }

  const fade = beam.state === "fading" ? beam.fade - ms / config.fadeMs : beam.fade;
  if (fade <= 0) return waiting(config);

  let { path, dir, lastTurn, segmentsLeft, state } = beam;
  let progress = beam.progress + (beam.speed * ms) / 1000;
  const keep = Math.ceil(beam.trail / grid.cell) + 2;

  while (progress >= grid.cell) {
    progress -= grid.cell;
    const reached = step(path[path.length - 1], dir);
    path = [...path, reached].slice(-keep);
    segmentsLeft -= 1;
    if (segmentsLeft <= 0) state = "fading";
    ({ dir, lastTurn } = chooseDirection(grid, config, reached, dir, lastTurn));
  }
  return { ...beam, path, dir, lastTurn, progress, segmentsLeft, state, fade };
}

function draw(ctx: CanvasRenderingContext2D, beam: Beam, grid: Grid, config: GridBeamsConfig, rgb: string) {
  if (beam.state === "waiting" || !beam.path.length) return;
  const last = pointOf(grid, beam.path[beam.path.length - 1]);
  const head = { x: last.x + beam.dir.dc * beam.progress, y: last.y + beam.dir.dr * beam.progress };
  const peak = config.opacity * beam.fade;
  const alphaAt = (distance: number) => peak * Math.max(0, 1 - distance / beam.trail) ** 1.4;

  // Walk back from the head along the visited crossings, one stroke per segment, fading with distance.
  let from = head;
  let distance = 0;
  for (let index = beam.path.length - 1; index >= 0 && distance < beam.trail; index -= 1) {
    const to = pointOf(grid, beam.path[index]);
    const length = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
    const reach = Math.min(length, beam.trail - distance);
    if (reach > 0) {
      const end = { x: from.x + ((to.x - from.x) / length) * reach, y: from.y + ((to.y - from.y) / length) * reach };
      const gradient = ctx.createLinearGradient(from.x, from.y, end.x, end.y);
      gradient.addColorStop(0, `rgba(${rgb}, ${alphaAt(distance)})`);
      gradient.addColorStop(1, `rgba(${rgb}, ${alphaAt(distance + reach)})`);
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    distance += reach;
    from = to;
  }

  ctx.fillStyle = `rgba(${rgb}, ${peak})`;
  ctx.beginPath();
  ctx.arc(head.x, head.y, config.headRadius, 0, Math.PI * 2);
  ctx.fill();
}

/** Resolves a CSS colour (hex or named) to "r, g, b" through the canvas, which normalises it to hex. */
function toRgb(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  const hex = String(ctx.fillStyle);
  if (!hex.startsWith("#") || hex.length !== 7) return "242, 106, 75";
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(", ");
}

/**
 * Runs the beams on `canvas` until the returned cleanup is called. Follows the canvas's size and pixel
 * ratio, pauses while it is off screen, and colours the beams with the `--chart-1` token.
 */
export function startGridBeams(canvas: HTMLCanvasElement, config: GridBeamsConfig): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;

  const rgb = toRgb(ctx, getComputedStyle(canvas).getPropertyValue("--chart-1").trim());
  let grid = makeGrid(1, 1, config);
  let beams = Array.from({ length: config.count }, () => waiting(config, true));
  let frame = 0;
  let last = 0;
  let visible = true;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    grid = makeGrid(width, height, config);
    // Beams on the old grid may sit outside the new one: start them again.
    beams = beams.map(() => waiting(config, true));
  };

  const tick = (time: number) => {
    const ms = last ? Math.min(time - last, MAX_FRAME_MS) : 0;
    last = time;
    beams = beams.map((beam) => advance(beam, grid, config, ms));
    ctx.clearRect(0, 0, grid.width, grid.height);
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = "round";
    ctx.shadowBlur = config.glow;
    ctx.shadowColor = `rgba(${rgb}, 0.9)`;
    beams.forEach((beam) => draw(ctx, beam, grid, config, rgb));
    frame = visible ? requestAnimationFrame(tick) : 0;
  };

  const resizer = new ResizeObserver(resize);
  resizer.observe(canvas);
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  });
  watcher.observe(canvas);
  resize();
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    watcher.disconnect();
  };
}
