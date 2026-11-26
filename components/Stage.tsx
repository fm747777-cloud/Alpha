"use client";

import { useEffect, useRef } from "react";
import { LOGO_PATH, LOGO_VIEWBOX, WOLF_PATH } from "@/lib/logoPath";
import { getProjectName, onProjectName } from "@/lib/projectName";

/**
 * The 3D stage: one fixed canvas behind the whole page.
 *
 * - The ALPHA mark is extruded from its vector path into a solid, lit object,
 *   coloured with the logo's own blue gradient.
 * - The wolf inside it is its own white, inset relief, and its eye glows.
 * - A pack of small marks follows it wherever it goes: follow the Alpha.
 * - Beside it is the visitor's own project: a sheet of paper that is sketched,
 *   designed, built and launched as they scroll, with the name they typed on it.
 * - Both stand on a floor of dark triangles.
 * - Every element with `data-stage="name"` is a scene. As you scroll, the logo
 *   travels from one scene's pose to the next (position, rotation, scale, finish).
 *
 * three.js is loaded on demand, after first paint. Without a GPU, or with
 * reduced motion, nothing loads and the static poster image stays.
 */

/**
 * A pose is a flat set of numbers, so two scenes can be blended key by key.
 *  x y z rx ry s   the Alpha (the 3D mark)
 *  mat             its finish: 0 enamel, 1 polished metal, 2 satin with a glow
 *  pack            1 = the followers are with it, 0 = it stands alone
 *  trail           0 = the pack stands in a wedge behind it, 1 = single file
 *  orbit           1 = the pack circles the project instead (they are building it)
 *  eye             size of the glow on the wolf's eye
 *  px py pz prx pry prz ps   the visitor's project: a sheet of paper that becomes a phone
 *  jp              where the project is in its life cycle, 0 (a blank sheet) to 7:
 *                  idea, planning, design, development, testing, launch, support
 */
type Pose = Record<string, number>;
const BASE: Pose = {
  x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1, mat: 0, pack: 1, trail: 0, orbit: 0, eye: 1,
  px: 0, py: 0, pz: 0, prx: 0, pry: 0, prz: 0, ps: 0, jp: 0,
};
// These are mirrored for right-to-left pages.
const MIRRORED = ["x", "ry", "px", "pry", "prz"];
export const JOURNEY_STEPS = 7;

function poseFor(name: string, p: number, mobile: boolean): Pose {
  const turn = Math.PI * 2;
  const pose = (o: Pose): Pose => ({ ...BASE, ...o });
  switch (name) {
    case "hero":
      // The Alpha, and beside it a blank sheet: the visitor's idea.
      return mobile
        ? pose({ y: 1.38, rx: 0.02, ry: -0.3, s: 0.6 })
        : pose({ x: 2.25, y: 0.3, rx: 0.02, ry: -0.2, s: 1.34, px: 1.02, py: -0.62, pz: 1.7, pry: 0.45, prz: -0.08, ps: 0.46 });
    case "journey": {
      // The life cycle, one stage per step. Each plays in the first part of its step, then holds.
      const raw = p * JOURNEY_STEPS;
      const stage = Math.min(JOURNEY_STEPS - 1, Math.floor(raw));
      const local = Math.min(1, (raw - stage) / 0.62);
      const e = local * local * (3 - 2 * local);
      const jp = stage + e;
      const building = stage === 3 ? 1 : 0; // development: the pack circles the project
      const thinking = stage === 6 ? 3.6 : 1; // support and growth: the wolf's eye lights up
      const launch = stage === 5 ? e : stage > 5 ? 1 : 0;
      const pry = -0.42 + Math.sin(jp * 1.3) * 0.16 + launch * turn;
      return mobile
        ? pose({ x: 1.0, y: 2.0, z: -1, ry: -0.5, s: 0.2, pack: building, orbit: building, eye: thinking, px: 0, py: 0.95 + launch * 0.2, pry, prx: 0.03, ps: 0.6, jp })
        : pose({ x: 3.55, y: 1.3, z: -1.8, ry: -0.55, s: 0.52, pack: building, orbit: building, eye: thinking, px: 1.7, py: -0.05 + launch * 0.35, pz: 0.6, pry, prx: 0.03 - launch * 0.12, ps: 1.1, jp });
    }
    case "services":
      return mobile
        ? pose({ y: 1.55, rx: 0.1, ry: 0.5 + p * turn, s: 0.42, pack: 0, jp: 7 })
        : pose({ x: -2.55, rx: 0.12, ry: 0.5 + p * turn, s: 1.12, pack: 0, jp: 7 });
    case "work":
      return pose({ y: 0.2, z: -6, ry: Math.PI, s: 0.001, mat: 1, jp: 7 });
    case "about":
      // close on the wolf
      return mobile
        ? pose({ y: 1.5, rx: 0.15, ry: -0.6 + p * 1.2, s: 0.44, mat: 2, pack: 0, jp: 7 })
        : pose({ y: -0.48, rx: 0.04, ry: -0.35 + p * 0.7, s: 1.06, mat: 2, pack: 0, jp: 7 });
    case "quiet":
      return pose({ y: -0.2, z: -6, s: 0.001, mat: 2, jp: 7 });
    case "outro":
      // The Alpha and the finished project, side by side on the floor.
      return mobile
        ? pose({ x: -0.5, y: -0.8, ry: -0.25 + p * 0.5, s: 0.5, px: 0.7, py: -0.92, pz: 0.4, pry: -0.3, ps: 0.3, jp: 7 })
        : pose({ x: -0.75, y: -0.92, ry: -0.3 + p * 0.6, s: 0.56, px: 0.95, py: -1.02, pz: 0.5, pry: -0.35, ps: 0.38, jp: 7 });
    default:
      return pose({});
  }
}

const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const out: Pose = {};
  for (const key in BASE) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
};

// ---- The project's screen: drawn on a 2D canvas, used as the texture of the 3D object ----
const SW = 512;
const SH = 1112;
type Labels = { idea: string; live: string; fallback: string };
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function drawScreen(ctx: CanvasRenderingContext2D, jp: number, name: string, labels: Labels, rtl: boolean) {
  const idea = clamp01(jp); // the idea is noted down
  const sketch = clamp01(jp - 1); // planning: the wireframe draws itself
  const design = clamp01(jp - 2); // paper becomes interface
  const built = clamp01(jp - 3); // development: content fills in
  const tested = clamp01(jp - 4); // every part is checked
  const live = clamp01(jp - 5); // launched
  const smart = clamp01(jp - 6); // support and growth: the assistant arrives
  const title = name || labels.fallback;
  const font = (weight: number, size: number) => `${weight} ${size}px Alexandria, "Plex Arabic", system-ui, sans-serif`;
  const box = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, SW, SH);
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  box(0, 0, SW, SH, 46);
  ctx.clip();

  // --- Paper: the idea and its sketch
  ctx.fillStyle = "#f5f8ff";
  ctx.fillRect(0, 0, SW, SH);
  ctx.fillStyle = "rgba(21,88,234,0.12)";
  for (let y = 40; y < SH; y += 36) for (let x = 40; x < SW; x += 36) ctx.fillRect(x, y, 2, 2);
  ctx.fillStyle = "#6b83b5";
  ctx.font = font(500, 24);
  ctx.fillText(labels.idea, SW / 2, 96);
  ctx.fillStyle = "#1558ea";
  ctx.font = font(700, title.length > 16 ? 34 : 44);
  ctx.fillText(title, SW / 2, 160, SW - 70);

  // Idea: the name is underlined and a light bulb is doodled, then fades as planning starts.
  ctx.strokeStyle = "#2f6fe0";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([300 * clamp01(idea * 2), 600]);
  ctx.beginPath();
  ctx.moveTo(SW / 2 - 150, 200);
  ctx.quadraticCurveTo(SW / 2, 214, SW / 2 + 150, 198);
  ctx.stroke();
  const bulb = clamp01(idea * 2 - 0.6) * (1 - sketch);
  if (bulb > 0) {
    ctx.globalAlpha = 1 - sketch;
    ctx.setLineDash([900 * bulb, 1800]);
    ctx.beginPath();
    ctx.arc(SW / 2, 560, 90, Math.PI * 0.75, Math.PI * 2.25);
    ctx.lineTo(SW / 2 + 40, 700);
    ctx.lineTo(SW / 2 - 40, 700);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    if (bulb > 0.8) {
      ctx.beginPath();
      ctx.moveTo(SW / 2 - 34, 728);
      ctx.lineTo(SW / 2 + 34, 728);
      ctx.moveTo(SW / 2 - 22, 752);
      ctx.lineTo(SW / 2 + 22, 752);
      for (let k = 0; k < 5; k++) {
        const ang = Math.PI * (1.1 + k * 0.2);
        ctx.moveTo(SW / 2 + Math.cos(ang) * 124, 560 + Math.sin(ang) * 124);
        ctx.lineTo(SW / 2 + Math.cos(ang) * 156, 560 + Math.sin(ang) * 156);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  const strokes: Array<[number, (c: CanvasRenderingContext2D) => void]> = [
    [1160, () => box(40, 230, 432, 150, 18)],
    [220, () => { ctx.beginPath(); ctx.arc(104, 305, 34, 0, Math.PI * 2); }],
    [240, () => { ctx.beginPath(); ctx.moveTo(164, 286); ctx.lineTo(404, 286); }],
    [180, () => { ctx.beginPath(); ctx.moveTo(164, 326); ctx.lineTo(344, 326); }],
    [800, () => box(40, 410, 206, 200, 16)],
    [800, () => box(266, 410, 206, 200, 16)],
    [1050, () => box(40, 640, 432, 92, 14)],
    [1050, () => box(40, 752, 432, 92, 14)],
    [1050, () => box(40, 864, 432, 92, 14)],
    [440, () => { ctx.beginPath(); ctx.moveTo(40, 1000); ctx.lineTo(472, 1000); }],
    [90, () => { ctx.beginPath(); ctx.arc(136, 1050, 14, 0, Math.PI * 2); }],
    [90, () => { ctx.beginPath(); ctx.arc(256, 1050, 14, 0, Math.PI * 2); }],
    [90, () => { ctx.beginPath(); ctx.arc(376, 1050, 14, 0, Math.PI * 2); }],
  ];
  ctx.strokeStyle = "#2f6fe0";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const reach = sketch * strokes.length;
  strokes.forEach(([length, path], i) => {
    const part = clamp01(reach - i);
    if (part <= 0) return;
    ctx.setLineDash([length * part, length * 2]);
    path(ctx);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // --- Interface: wipes down over the paper
  if (design > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, SW, SH * design);
    ctx.clip();
    const bg = ctx.createLinearGradient(0, 0, 0, SH);
    bg.addColorStop(0, "#040b20");
    bg.addColorStop(1, "#071a44");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SW, SH);

    ctx.fillStyle = "#ffffff";
    ctx.font = font(700, title.length > 16 ? 34 : 44);
    ctx.fillText(title, SW / 2, 160, SW - 70);

    const hero = ctx.createLinearGradient(0, 230, 0, 380);
    hero.addColorStop(0, "#2e9bff");
    hero.addColorStop(1, "#0a45d8");
    ctx.fillStyle = hero;
    box(40, 230, 432, 150, 18);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(104, 305, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    box(164, 276, 240, 18, 9);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    box(164, 318, 180, 14, 7);
    ctx.fill();

    // two cards with small charts that grow as the product is built
    [40, 266].forEach((x, c) => {
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      box(x, 410, 206, 200, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(120,165,255,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
      for (let b = 0; b < 4; b++) {
        const full = [0.45, 0.8, 0.6, 1][(b + c) % 4] * 120;
        const h = 14 + full * built * (0.75 + 0.25 * smart);
        ctx.fillStyle = b === 3 - c ? "#2e9bff" : "rgba(120,165,255,0.5)";
        box(x + 30 + b * 40, 580 - h, 24, h, 6);
        ctx.fill();
      }
    });

    // rows arrive one after another
    for (let r = 0; r < 3; r++) {
      const a = clamp01(built * 3 - r);
      if (a <= 0) continue;
      const y = 640 + r * 112 + (1 - a) * 30;
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      box(40, y, 432, 92, 14);
      ctx.fill();
      ctx.fillStyle = "#1c6fff";
      box(rtl ? 404 : 58, y + 22, 48, 48, 12);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      box(rtl ? 180 : 124, y + 28, 208, 14, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      box(rtl ? 248 : 124, y + 54, 140, 12, 6);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Testing: each part gets its tick, under a scan line.
    if (tested > 0) {
      const tick = (cx: number, cy: number, a: number) => {
        if (a <= 0) return;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1463f0";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx - 2, cy + 7);
        ctx.lineTo(cx + 9, cy - 7);
        ctx.stroke();
        ctx.globalAlpha = 1;
      };
      tick(226, 430, clamp01(tested * 5));
      tick(452, 430, clamp01(tested * 5 - 0.8));
      for (let r = 0; r < 3; r++) tick(rtl ? 78 : 434, 686 + r * 112, clamp01(tested * 5 - 1.6 - r * 0.8));
      if (tested < 1) {
        const y = 220 + tested * 800;
        const beam = ctx.createLinearGradient(0, y - 70, 0, y);
        beam.addColorStop(0, "rgba(46,155,255,0)");
        beam.addColorStop(1, "rgba(46,155,255,0.45)");
        ctx.fillStyle = beam;
        ctx.fillRect(0, y - 70, SW, 70);
        ctx.fillStyle = "#8fd0ff";
        ctx.fillRect(0, y, SW, 3);
      }
    }

    // tab bar
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, 1000, SW, SH - 1000);
    [136, 256, 376].forEach((x, i) => {
      ctx.fillStyle = i === 1 ? "#2e9bff" : "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(x, 1050, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // build progress
    if (built > 0 && built < 1) {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      box(40, 202, 432, 6, 3);
      ctx.fill();
      ctx.fillStyle = "#2e9bff";
      box(40, 202, 432 * built, 6, 3);
      ctx.fill();
    }

    // the assistant
    if (smart > 0) {
      const y = 860 + (1 - smart) * 60;
      ctx.globalAlpha = smart;
      ctx.shadowColor = "rgba(46,155,255,0.9)";
      ctx.shadowBlur = 40;
      const glow = ctx.createLinearGradient(60, y, 452, y + 120);
      glow.addColorStop(0, "#1a5cf0");
      glow.addColorStop(1, "#38a8ff");
      ctx.fillStyle = glow;
      box(52, y, 408, 120, 26);
      ctx.fill();
      ctx.shadowBlur = 0;
      // a four-point spark
      const sx = rtl ? 410 : 102;
      const sy = y + 60;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const rad = k % 2 === 0 ? 26 : 8;
        const ang = (k * Math.PI) / 4 - Math.PI / 2;
        ctx.lineTo(sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      box(rtl ? 120 : 148, y + 38, 240, 14, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      box(rtl ? 200 : 148, y + 68, 160, 12, 6);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // live
    if (live > 0) {
      ctx.globalAlpha = live;
      ctx.font = font(600, 24);
      const w = ctx.measureText(labels.live).width + 74;
      ctx.fillStyle = "#ffffff";
      box(SW / 2 - w / 2, 72, w, 48, 24);
      ctx.fill();
      ctx.fillStyle = "#1463f0";
      ctx.beginPath();
      ctx.arc(rtl ? SW / 2 + w / 2 - 26 : SW / 2 - w / 2 + 26, 96, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#06102b";
      ctx.fillText(labels.live, SW / 2 + (rtl ? -12 : 12), 97);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  ctx.restore();
}

const FINISH = [
  { tint: 1.0, metal: 0.12, rough: 0.3, env: 0.55, glow: 0.0 },
  { tint: 0.85, metal: 1.0, rough: 0.16, env: 1.7, glow: 0.0 },
  { tint: 1.0, metal: 0.35, rough: 0.46, env: 0.6, glow: 0.22 },
];

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!document.querySelector("[data-stage]")) return;
    const force = new URLSearchParams(window.location.search).get("gl") === "force";

    // Probe before downloading three.js: no GPU, no stage.
    if (!force) {
      const probe = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
      if (!probe) return;
      const info = probe.getExtension("WEBGL_debug_renderer_info");
      const name = info ? String(probe.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      probe.getExtension("WEBGL_lose_context")?.loseContext();
      if (/swiftshader|llvmpipe|software|basic render/i.test(name)) return;
    }

    let disposed = false;
    let cleanup = () => {};

    const boot = async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const root = document.documentElement;
      const rtl = root.dir === "rtl";
      const side = rtl ? -1 : 1;
      let mobile = window.innerWidth < 900;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x03060d, 9, 21);
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 1;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      camera.position.set(0, 0.55, 10);
      camera.lookAt(0, 0, 0);

      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(-3, 5, 6);
      scene.add(key);
      const rim = new THREE.PointLight(0x2f86ff, 110, 30);
      rim.position.set(3.5 * side, 1.5, -3.5);
      scene.add(rim);
      const hemi = new THREE.HemisphereLight(0xffffff, 0xd9eef9, 0);
      scene.add(hemi);

      // ---- The mark, extruded -------------------------------------------
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}"><path fill-rule="evenodd" d="${LOGO_PATH}"/></svg>`;
      const toShapes = (markup: string) => new SVGLoader().parse(markup).paths.flatMap((path) => SVGLoader.createShapes(path));
      const shapes = toShapes(svg);
      const wolfShapes = toShapes(svg.replace(LOGO_PATH, WOLF_PATH));
      const unit = 2 / LOGO_VIEWBOX.h;

      const TOP = new THREE.Color(0x2e9bff);
      const BOTTOM = new THREE.Color(0x0a45d8);
      const WHITE = new THREE.Color(0xf2f6ff);
      const ICE = new THREE.Color(0xb9d2ff);
      // front: how far the front face sits from the centre plane (the wolf is inset behind the A's face)
      const buildGeometry = (depth: number, bevel: number, curves: number, wolf = false, front = depth / 2) => {
        const g = new THREE.ExtrudeGeometry(wolf ? wolfShapes : shapes, {
          depth,
          curveSegments: curves,
          bevelEnabled: bevel > 0,
          bevelThickness: bevel,
          bevelSize: bevel * 0.7,
          bevelSegments: bevel > 0 ? 4 : 0,
        });
        g.translate(-LOGO_VIEWBOX.w / 2, -LOGO_VIEWBOX.h / 2, front - depth);
        // the logo's own gradient: light blue at the peak, deep blue at the feet
        const pos = g.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        const c = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
          const t = Math.min(1, Math.max(0, pos.getY(i) / LOGO_VIEWBOX.h + 0.5));
          if (wolf) c.copy(WHITE).lerp(ICE, t);
          else c.copy(TOP).lerp(BOTTOM, t);
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return g;
      };

      const logoMat = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        emissive: 0x1d6bff,
        emissiveIntensity: 0,
      });
      const logoMesh = new THREE.Mesh(buildGeometry(250, 16, 10), logoMat);
      logoMesh.scale.set(unit, -unit, unit);
      // The wolf: a white relief set into the A
      const wolfMat = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.38,
        metalness: 0,
        clearcoat: 0.35,
        emissive: 0x9fc4ff,
        emissiveIntensity: 0.1,
      });
      const wolfMesh = new THREE.Mesh(buildGeometry(190, 6, 10, true, 78), wolfMat);
      wolfMesh.scale.set(unit, -unit, unit);

      // The eye: a soft light sitting on the wolf's eye
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 128;
      const gctx = glowCanvas.getContext("2d")!;
      const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.2, "rgba(120,190,255,0.75)");
      grad.addColorStop(0.5, "rgba(47,134,255,0.2)");
      grad.addColorStop(1, "rgba(47,134,255,0)");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 128, 128);
      const eye = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(glowCanvas),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        }),
      );
      const EYE = { x: 1103, y: 911 };
      eye.position.set((EYE.x - LOGO_VIEWBOX.w / 2) * unit, -(EYE.y - LOGO_VIEWBOX.h / 2) * unit, 150 * unit);

      const logo = new THREE.Group();
      logo.add(logoMesh, wolfMesh, eye);
      scene.add(logo);

      // ---- The pack that follows ------------------------------------------
      const packCount = mobile ? 8 : 14;
      const packMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.3, roughness: 0.42, envMapIntensity: 0.5 });
      packMat.color.setScalar(0.8);
      const pack = new THREE.InstancedMesh(buildGeometry(210, 0, 4), packMat, packCount);
      pack.frustumCulled = false;
      const packWolfMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0, roughness: 0.5, envMapIntensity: 0.5 });
      packWolfMat.color.setScalar(0.85);
      const packWolves = new THREE.InstancedMesh(buildGeometry(150, 0, 4, true, 70), packWolfMat, packCount);
      packWolves.frustumCulled = false;
      scene.add(pack, packWolves);
      const followers = Array.from({ length: packCount }, (_, i) => {
        const row = Math.floor(i / 2) + 1;
        const wing = i % 2 === 0 ? -1 : 1;
        return {
          ox: wing * 0.5 * row,
          oz: -0.62 * row,
          // single file: behind the wolf's tail, slightly staggered in depth
          tx: -(0.62 + 0.4 * i),
          tz: wing * 0.22,
          row,
          x: 0,
          y: -3,
          z: -4,
          ry: 0,
          phase: i * 1.7,
        };
      });
      const packDummy = new THREE.Object3D();

      // ---- The floor: futuristic RAM-inspired rectangular modules & circuit traces ----
      const sq = new THREE.Shape();
      const s2 = 0.45;
      const r2 = 0.032;
      sq.moveTo(-s2 + r2, -s2);
      sq.lineTo(s2 - r2, -s2);
      sq.quadraticCurveTo(s2, -s2, s2, -s2 + r2);
      sq.lineTo(s2, s2 - r2);
      sq.quadraticCurveTo(s2, s2, s2 - r2, s2);
      sq.lineTo(-s2 + r2, s2);
      sq.quadraticCurveTo(-s2, s2, -s2, s2 - r2);
      sq.lineTo(-s2, -s2 + r2);
      sq.quadraticCurveTo(-s2, -s2, -s2 + r2, -s2);
      sq.closePath();

      const tileGeo = new THREE.ExtrudeGeometry(sq, {
        depth: 0.24,
        bevelEnabled: true,
        bevelThickness: 0.024,
        bevelSize: 0.022,
        bevelSegments: 3,
        curveSegments: 6,
      });

      // Procedural brushed silicon / memory chip bump texture
      const chipCanvas = document.createElement("canvas");
      chipCanvas.width = 256;
      chipCanvas.height = 256;
      const cctx = chipCanvas.getContext("2d")!;
      cctx.fillStyle = "#808080";
      cctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 2) {
        const v = 112 + Math.floor(((y * 17) % 29));
        cctx.fillStyle = `rgb(${v},${v},${v})`;
        cctx.fillRect(0, y, 256, 1);
      }
      cctx.strokeStyle = "#525252";
      cctx.lineWidth = 4;
      cctx.strokeRect(14, 14, 228, 228);
      const chipBump = new THREE.CanvasTexture(chipCanvas);
      chipBump.wrapS = THREE.RepeatWrapping;
      chipBump.wrapT = THREE.RepeatWrapping;
      chipBump.repeat.set(2, 2);

      const tileMat = new THREE.MeshPhysicalMaterial({
        metalness: 0.84,
        roughness: 0.28,
        clearcoat: 0.42,
        clearcoatRoughness: 0.24,
        bumpMap: chipBump,
        bumpScale: 0.008,
        envMapIntensity: 0.68,
      });

      const cols = mobile ? 20 : 38;
      const rows = mobile ? 14 : 18;
      const spanX = 22.8;
      const spanZ = 16.2;

      const xLines = new Float32Array(cols + 1);
      const zLines = new Float32Array(rows + 1);
      let seed = 17;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };

      let accX = 0;
      for (let c = 0; c <= cols; c++) {
        xLines[c] = accX;
        accX += 0.65 + (c % 3 === 0 ? 0.55 : c % 2 === 0 ? 0.28 : 0.08) + rand() * 0.22;
      }
      for (let c = 0; c <= cols; c++) {
        xLines[c] = (xLines[c] / xLines[cols] - 0.5) * spanX;
      }

      let accZ = 0;
      for (let r = 0; r <= rows; r++) {
        zLines[r] = accZ;
        accZ += 0.68 + (r % 3 === 1 ? 0.48 : r % 2 === 0 ? 0.24 : 0.1) + rand() * 0.2;
      }
      for (let r = 0; r <= rows; r++) {
        zLines[r] = 4.0 - (zLines[r] / zLines[rows]) * spanZ;
      }

      type ModuleCell = {
        cx: number;
        cz: number;
        w: number;
        d: number;
        h: number;
        shade: number;
        detail: number; // 0: brushed slab, 1: pin matrix, 2: dash LEDs, 3: < > socket, 4: recessed frame
      };

      const used = new Uint8Array(cols * rows);
      const cells: ModuleCell[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (used[r * cols + c]) continue;
          let cs = 1;
          let rs = 1;
          const p = rand();
          if (p > 0.76 && c + 1 < cols && !used[r * cols + (c + 1)]) cs = 2;
          if (p > 0.89 && c + 2 < cols && cs === 2 && !used[r * cols + (c + 2)]) cs = 3;
          const pr = rand();
          if (pr > 0.74 && r + 1 < rows) {
            let ok = true;
            for (let dc = 0; dc < cs; dc++) if (used[(r + 1) * cols + (c + dc)]) ok = false;
            if (ok) rs = 2;
          }
          for (let dr = 0; dr < rs; dr++) {
            for (let dc = 0; dc < cs; dc++) {
              used[(r + dr) * cols + (c + dc)] = 1;
            }
          }

          const x0 = xLines[c];
          const x1 = xLines[c + cs];
          const z0 = zLines[r];
          const z1 = zLines[r + rs];
          const gap = 0.052;
          const w = Math.max(0.24, Math.abs(x1 - x0) - gap);
          const d = Math.max(0.24, Math.abs(z0 - z1) - gap);
          const cx = (x0 + x1) / 2;
          const cz = (z0 + z1) / 2;

          const area = w * d;
          const tier = rand();
          const h = area > 1.35
            ? 0.65 + tier * 0.45
            : tier > 0.82
              ? 1.15 + rand() * 0.55
              : 0.48 + tier * 0.62;

          let detail = 0;
          const drand = rand();
          if (area > 1.25 && drand > 0.42) detail = drand > 0.72 ? 3 : 1;
          else if (w > d * 1.25 && drand > 0.48) detail = 2;
          else if (drand > 0.84) detail = 3;
          else if (drand > 0.68) detail = 1;
          else if (drand > 0.54) detail = 4;

          cells.push({
            cx,
            cz,
            w,
            d,
            h,
            shade: rand(),
            detail,
          });
        }
      }

      const tiles = new THREE.InstancedMesh(tileGeo, tileMat, cells.length);
      const dummy = new THREE.Object3D();
      const tint = new THREE.Color();

      for (let i = 0; i < cells.length; i++) {
        const m = cells[i];
        dummy.position.set(m.cx, 0, m.cz);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(m.w / 0.9, m.d / 0.9, m.h);
        dummy.updateMatrix();
        tiles.setMatrixAt(i, dummy.matrix);
      }
      tiles.instanceMatrix.needsUpdate = true;

      // ---- High-resolution procedural circuit trace & module markings overlay ----
      const traceCanvas = document.createElement("canvas");
      traceCanvas.width = mobile ? 1024 : 2048;
      traceCanvas.height = mobile ? 1024 : 2048;
      const tctx = traceCanvas.getContext("2d")!;
      const traceTex = new THREE.CanvasTexture(traceCanvas);
      traceTex.colorSpace = THREE.SRGBColorSpace;
      traceTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const worldToUV = (wx: number, wz: number): [number, number] => {
        const u = (wx / spanX + 0.5) * traceCanvas.width;
        const v = ((4.0 - wz) / spanZ) * traceCanvas.height;
        return [u, v];
      };

      const paintCircuitOverlay = (light: boolean) => {
        const W = traceCanvas.width;
        const H = traceCanvas.height;
        tctx.clearRect(0, 0, W, H);

        const cyan = light ? "#055FD9" : "#1D91F9";
        const brightCyan = light ? "#1D91F9" : "#00CFFF";
        const deepBlue = light ? "rgba(175, 193, 216, 0.85)" : "rgba(5, 95, 217, 0.34)";
        const glowColor = light ? "rgba(0, 207, 255, 0.55)" : "rgba(0, 207, 255, 0.68)";

        // 1. Subtle inter-module seam glow and recessed chip frames
        for (let i = 0; i < cells.length; i++) {
          const m = cells[i];
          const [ux, uz] = worldToUV(m.cx, m.cz);
          const pw = (m.w / spanX) * W;
          const pd = (m.d / spanZ) * H;

          // Subtle edge bevel highlight on modules
          tctx.strokeStyle = light ? "rgba(175, 193, 216, 0.62)" : "rgba(70, 155, 255, 0.16)";
          tctx.lineWidth = Math.max(1, W / 1024);
          tctx.strokeRect(ux - pw * 0.46, uz - pd * 0.46, pw * 0.92, pd * 0.92);

          if (m.detail === 4 || m.detail === 3) {
            // Recessed inner memory chip die frame
            tctx.fillStyle = light ? "rgba(217, 238, 249, 0.65)" : "rgba(2, 6, 16, 0.55)";
            tctx.fillRect(ux - pw * 0.34, uz - pd * 0.34, pw * 0.68, pd * 0.68);
            tctx.strokeStyle = deepBlue;
            tctx.lineWidth = Math.max(1.2, W / 900);
            tctx.strokeRect(ux - pw * 0.34, uz - pd * 0.34, pw * 0.68, pd * 0.68);
          }

          if (m.detail === 1 && pw > 24 && pd > 18) {
            // Memory pin / micro-LED contact grid (2x4 or 2x5 cyan dots)
            const colsPin = pw > 64 ? 5 : 4;
            const rowsPin = 2;
            const stepX = (pw * 0.56) / Math.max(1, colsPin - 1);
            const stepY = (pd * 0.36) / Math.max(1, rowsPin - 1);
            const rDot = Math.max(1.6, W / 680);

            tctx.save();
            tctx.shadowColor = glowColor;
            tctx.shadowBlur = 6;
            for (let r = 0; r < rowsPin; r++) {
              for (let c = 0; c < colsPin; c++) {
                const px = ux - pw * 0.28 + c * stepX;
                const py = uz - pd * 0.18 + r * stepY;
                tctx.fillStyle = (c + r) % 3 === 0 ? brightCyan : cyan;
                tctx.beginPath();
                tctx.arc(px, py, rDot, 0, Math.PI * 2);
                tctx.fill();
              }
            }
            tctx.restore();
          } else if (m.detail === 2 && pw > 26) {
            // Three precision horizontal status dashes (---)
            const dashCount = 3;
            const totalW = pw * 0.52;
            const dashW = totalW / (dashCount * 1.45);
            const dashH = Math.max(2, W / 640);
            const startX = ux - totalW / 2;

            tctx.save();
            tctx.shadowColor = glowColor;
            tctx.shadowBlur = 7;
            tctx.fillStyle = brightCyan;
            for (let d = 0; d < dashCount; d++) {
              const dx = startX + d * (dashW * 1.65);
              tctx.fillRect(dx, uz - dashH / 2, dashW, dashH);
            }
            tctx.restore();
          } else if (m.detail === 3 && pw > 34 && pd > 26) {
            // Precision < > code / silicon socket glyph inside recessed die
            const gw = Math.min(pw, pd) * 0.15;
            const gh = gw * 0.85;
            const offset = gw * 0.72;

            tctx.save();
            tctx.shadowColor = glowColor;
            tctx.shadowBlur = 8;
            tctx.strokeStyle = brightCyan;
            tctx.lineWidth = Math.max(1.8, W / 680);
            tctx.lineCap = "round";
            tctx.lineJoin = "round";

            // Left chevron '<'
            tctx.beginPath();
            tctx.moveTo(ux - offset + gw * 0.45, uz - gh);
            tctx.lineTo(ux - offset - gw * 0.45, uz);
            tctx.lineTo(ux - offset + gw * 0.45, uz + gh);
            tctx.stroke();

            // Right chevron '>'
            tctx.beginPath();
            tctx.moveTo(ux + offset - gw * 0.45, uz - gh);
            tctx.lineTo(ux + offset + gw * 0.45, uz);
            tctx.lineTo(ux + offset - gw * 0.45, uz + gh);
            tctx.stroke();
            tctx.restore();
          }
        }

        // 2. Multi-lane parallel electric blue / cyan circuit bus traces with 45-degree routed corners
        const drawBusRoutes = () => {
          const routes: Array<Array<[number, number]>> = [
            // Foreground left-to-center-right main 3-lane bus
            [
              [-0.48, 0.84],
              [-0.31, 0.84],
              [-0.27, 0.76],
              [-0.02, 0.76],
              [0.02, 0.74],
              [0.14, 0.74],
              [0.09, 0.56],
              [0.24, 0.56],
              [0.21, 0.45],
              [0.36, 0.45],
            ],
            // Midground right bus branch
            [
              [0.18, 0.44],
              [0.26, 0.44],
              [0.24, 0.35],
              [0.35, 0.35],
              [0.37, 0.31],
              [0.46, 0.31],
            ],
            // Left midground secondary trace
            [
              [-0.46, 0.58],
              [-0.32, 0.58],
              [-0.29, 0.52],
              [-0.14, 0.52],
            ],
            // Center-right lower branch
            [
              [0.04, 0.78],
              [0.06, 0.92],
              [0.18, 0.92],
            ],
          ];

          const lanes = [-1, 0, 1];
          const laneSpacing = Math.max(4.5, W / 360);

          tctx.save();
          tctx.lineCap = "round";
          tctx.lineJoin = "round";

          routes.forEach((pts, rIdx) => {
            const activeLanes = rIdx < 2 ? lanes : [-0.5, 0.5];
            activeLanes.forEach((laneOffset, lIdx) => {
              const shift = laneOffset * laneSpacing;
              tctx.beginPath();
              for (let i = 0; i < pts.length; i++) {
                const px = (pts[i][0] + 0.5) * W + shift * 0.85;
                const py = pts[i][1] * H + shift;
                if (i === 0) tctx.moveTo(px, py);
                else tctx.lineTo(px, py);
              }
              tctx.shadowColor = glowColor;
              tctx.shadowBlur = lIdx === 1 ? 10 : 6;
              tctx.strokeStyle = lIdx === 1 ? brightCyan : cyan;
              tctx.lineWidth = Math.max(1.7, W / 740);
              tctx.stroke();

              // inline bus resistor/capacitor Coupling pads along segments
              tctx.fillStyle = brightCyan;
              const padW = Math.max(5, W / 280);
              const padH = Math.max(3.2, W / 440);
              for (let i = 1; i < pts.length - 1; i += 2) {
                const mx = ((pts[i][0] + pts[i + 1][0]) * 0.5 + 0.5) * W + shift * 0.85;
                const my = (pts[i][1] + pts[i + 1][1]) * 0.5 * H + shift;
                tctx.fillRect(mx - padW / 2, my - padH / 2, padW, padH);
              }
            });
          });
          tctx.restore();
        };

        drawBusRoutes();
        traceTex.needsUpdate = true;
      };

      const traceMat = new THREE.MeshBasicMaterial({
        map: traceTex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      });
      const traceGeo = new THREE.PlaneGeometry(spanX, spanZ);
      traceGeo.rotateX(-Math.PI / 2);
      const traceMesh = new THREE.Mesh(traceGeo, traceMat);
      traceMesh.position.set(0, 0.215, 4.0 - spanZ / 2);

      // ---- Subtle floor contact glow/reflection for wolves & contact shadow/reflection for phone ----
      const wolfGlowCanvas = document.createElement("canvas");
      wolfGlowCanvas.width = 256;
      wolfGlowCanvas.height = 256;
      const wgctx = wolfGlowCanvas.getContext("2d")!;
      const wgGrad = wgctx.createRadialGradient(128, 128, 6, 128, 128, 124);
      wgGrad.addColorStop(0, "rgba(0, 207, 255, 0.52)");
      wgGrad.addColorStop(0.45, "rgba(29, 145, 249, 0.26)");
      wgGrad.addColorStop(0.75, "rgba(155, 93, 229, 0.12)");
      wgGrad.addColorStop(1, "rgba(0, 19, 49, 0)");
      wgctx.fillStyle = wgGrad;
      wgctx.fillRect(0, 0, 256, 256);
      const wolfGlowTex = new THREE.CanvasTexture(wolfGlowCanvas);
      const wolfGlowMat = new THREE.MeshBasicMaterial({
        map: wolfGlowTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const wolfGlowGeo = new THREE.PlaneGeometry(3.8, 1.9);
      wolfGlowGeo.rotateX(-Math.PI / 2);
      const wolfGlowMesh = new THREE.Mesh(wolfGlowGeo, wolfGlowMat);
      wolfGlowMesh.position.set(2.25 * side, 0.221, 0.35);

      const phoneContactCanvas = document.createElement("canvas");
      phoneContactCanvas.width = 128;
      phoneContactCanvas.height = 128;
      const pcctx = phoneContactCanvas.getContext("2d")!;
      const pcGrad = pcctx.createRadialGradient(64, 60, 4, 64, 64, 58);
      pcGrad.addColorStop(0, "rgba(0, 10, 28, 0.68)");
      pcGrad.addColorStop(0.45, "rgba(4, 25, 106, 0.32)");
      pcGrad.addColorStop(0.8, "rgba(0, 207, 255, 0.10)");
      pcGrad.addColorStop(1, "rgba(0, 19, 49, 0)");
      pcctx.fillStyle = pcGrad;
      pcctx.fillRect(0, 0, 128, 128);
      const phoneContactTex = new THREE.CanvasTexture(phoneContactCanvas);
      const phoneContactMat = new THREE.MeshBasicMaterial({
        map: phoneContactTex,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      });
      const phoneContactGeo = new THREE.PlaneGeometry(1.15, 0.72);
      phoneContactGeo.rotateX(-Math.PI / 2);
      const phoneContactMesh = new THREE.Mesh(phoneContactGeo, phoneContactMat);
      phoneContactMesh.position.set(1.02 * side, 0.223, 1.7);

      // Holographic wolf pack plane in 3D Hero scene (positioned behind the 3D phone at z = 0.25)
      const wolfPackTex = new THREE.TextureLoader().load("/media/alpha-hologram-pack.webp");
      wolfPackTex.colorSpace = THREE.SRGBColorSpace;
      const wolfPackMat = new THREE.MeshBasicMaterial({
        map: wolfPackTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      });
      const wolfPackMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.85, 2.57), wolfPackMat);
      wolfPackMesh.position.set(2.25 * side, 0.02, 0.25);
      wolfPackMesh.scale.x = side;
      scene.add(wolfPackMesh);

      // Dark and light mode: the floor, the fog and the light change; the Alpha stays blue.
      const applyTheme = () => {
        const light = root.dataset.theme === "light";
        for (let i = 0; i < cells.length; i++) {
          const s = cells[i].shade;
          if (light) {
            // Matching elegant white and soft-blue RAM module surfaces (#FFFFFF to #D9EEF9)
            const v = 0.9 + s * 0.14;
            tint.setRGB(Math.min(1, v * 0.94), Math.min(1, v * 0.97), Math.min(1, v * 1.04));
          } else {
            // Deep Midnight Navy (#001331) and Deep Blue (#04196A) memory module surfaces
            const v = 0.014 + s * 0.034;
            tint.setRGB(v * 0.48, v * 0.92, v * 2.25);
          }
          tiles.setColorAt(i, tint);
        }
        if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
        tileMat.metalness = light ? 0.08 : 0.84;
        tileMat.roughness = light ? 0.34 : 0.26;
        tileMat.envMapIntensity = light ? 0.45 : 0.72;
        tileMat.emissive.setHex(light ? 0xd9eef9 : 0x000000);
        tileMat.emissiveIntensity = light ? 0.38 : 0;
        traceMat.opacity = light ? 0.92 : 0.96;
        wolfGlowMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        wolfGlowMat.opacity = light ? 0.65 : 0.85;
        wolfGlowMat.needsUpdate = true;
        phoneContactMat.opacity = light ? 0.64 : 0.78;
        paintCircuitOverlay(light);
        (scene.fog as InstanceType<typeof THREE.Fog>).color.set(light ? 0xf1f6ff : 0x001331);
        hemi.intensity = light ? 2.35 : 0;
        rim.intensity = light ? 52 : 110;
        key.intensity = light ? 1.55 : 1.5;
        scene.environmentIntensity = light ? 0.88 : 1;
      };
      applyTheme();
      const themeWatch = new MutationObserver(applyTheme);
      themeWatch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      const floor = new THREE.Group();
      floor.add(tiles, traceMesh, wolfGlowMesh, phoneContactMesh);
      scene.add(floor);
      const FLOOR_Y = -1.5;

      // ---- The visitor's project: a sheet of paper that becomes a phone ------
      const PW = 1.25;
      const PH = PW * (SH / SW) * 0.94;
      const slab = new THREE.Shape();
      const rad = 0.17;
      slab.moveTo(-PW / 2 + rad, -PH / 2);
      slab.lineTo(PW / 2 - rad, -PH / 2);
      slab.quadraticCurveTo(PW / 2, -PH / 2, PW / 2, -PH / 2 + rad);
      slab.lineTo(PW / 2, PH / 2 - rad);
      slab.quadraticCurveTo(PW / 2, PH / 2, PW / 2 - rad, PH / 2);
      slab.lineTo(-PW / 2 + rad, PH / 2);
      slab.quadraticCurveTo(-PW / 2, PH / 2, -PW / 2, PH / 2 - rad);
      slab.lineTo(-PW / 2, -PH / 2 + rad);
      slab.quadraticCurveTo(-PW / 2, -PH / 2, -PW / 2 + rad, -PH / 2);
      const slabGeo = new THREE.ExtrudeGeometry(slab, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 8 });
      slabGeo.translate(0, 0, -0.05);
      const slabMat = new THREE.MeshPhysicalMaterial({ clearcoat: 0.5, clearcoatRoughness: 0.25 });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);

      const screenCanvas = document.createElement("canvas");
      screenCanvas.width = SW;
      screenCanvas.height = SH;
      const sctx = screenCanvas.getContext("2d")!;
      const screenTex = new THREE.CanvasTexture(screenCanvas);
      screenTex.colorSpace = THREE.SRGBColorSpace;
      screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(PW * 0.92, PW * 0.92 * (SH / SW)),
        new THREE.MeshBasicMaterial({ map: screenTex, transparent: true, toneMapped: false }),
      );
      screenMesh.position.z = 0.073;
      const project = new THREE.Group();
      project.add(slabMesh, screenMesh);
      scene.add(project);

      const journeyEl = document.querySelector<HTMLElement>('[data-stage="journey"]');
      const labels: Labels = {
        idea: journeyEl?.dataset.idea || "Idea",
        live: journeyEl?.dataset.live || "Live",
        fallback: journeyEl?.dataset.fallback || "",
      };
      let projectName = getProjectName();
      let drawn = -1;
      const stopName = onProjectName((value) => {
        projectName = value;
        drawn = -1;
      });
      document.fonts?.ready.then(() => {
        drawn = -1;
      });
      const PAPER = new THREE.Color(0xf3f6ff);
      const DEVICE = new THREE.Color(0x0a1330);
      // ---- Size -----------------------------------------------------------
      let unitsPerPx = 1;
      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        mobile = w < 900;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        unitsPerPx = (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)) / h;
      };
      resize();
      window.addEventListener("resize", resize);

      // ---- Scenes ---------------------------------------------------------
      const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]")).map((el) => ({
        el,
        name: el.dataset.stage!,
        floor: el.hasAttribute("data-floor"),
      }));

      let px = 0;
      let py = 0;
      const onMove = (e: PointerEvent) => {
        px = e.clientX / window.innerWidth - 0.5;
        py = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const cur: Pose = { ...poseFor(scenes[0]?.name ?? "hero", 0, mobile) };
      for (const key of MIRRORED) cur[key] *= side;
      let mx = 0;
      let my = 0;
      let raf = 0;
      let last = performance.now();
      let frames = 0;
      let slow = 0;
      const t0 = last;

      const frame = (now: number) => {
        if (disposed) return;
        raf = requestAnimationFrame(frame);
        if (document.hidden) {
          last = now;
          return;
        }
        // A device that cannot keep up gets the static poster back.
        if (!force && frames < 120) {
          frames++;
          if (frames > 10 && now - last > 60) slow++;
          if (slow > 8) {
            disposed = true;
            cancelAnimationFrame(raf);
            cleanup();
            return;
          }
        }
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const time = (now - t0) / 1000;
        const vh = window.innerHeight;
        const vc = vh / 2;

        // Which scene are we in, or between?
        let prev: { pose: Pose; d: number } | null = null;
        let next: { pose: Pose; d: number } | null = null;
        let floorShift = Infinity;
        for (const s of scenes) {
          const r = s.el.getBoundingClientRect();
          const span = Math.max(1, r.height - vh);
          const p = Math.min(1, Math.max(0, -r.top / span));
          const d = r.bottom < vc ? r.bottom - vc : r.top > vc ? r.top - vc : 0;
          const pose = poseFor(s.name, p, mobile);
          if (d <= 0) prev = { pose, d };
          else if (!next) next = { pose, d };
          if (s.floor) {
            const shift = r.bottom - vh;
            if (Math.abs(shift) < Math.abs(floorShift)) floorShift = shift;
          }
        }
        let target: Pose;
        if (prev && (prev.d === 0 || !next)) target = prev.pose;
        else if (!prev && next) target = next.pose;
        else if (prev && next) {
          const a = -prev.d;
          const t = a / (a + next.d);
          target = mixPose(prev.pose, next.pose, t * t * (3 - 2 * t));
        } else target = BASE;

        const k = 1 - Math.pow(0.0025, dt); // frame-rate independent damping
        for (const key in BASE) {
          const goal = MIRRORED.includes(key) ? target[key] * side : target[key];
          cur[key] = mix(cur[key], goal, k);
        }
        mx = mix(mx, px, 0.06);
        my = mix(my, py, 0.06);

        const heroFade = clamp01(1 - Math.max(0, -floorShift) / (vh * 0.55));
        const materialize = clamp01(time / 1.35);
        const wolfAlpha = heroFade * materialize * (1 - clamp01(cur.jp * 1.4));
        wolfPackMesh.visible = wolfAlpha > 0.01 && !mobile;
        if (wolfPackMesh.visible) {
          wolfPackMat.opacity = wolfAlpha;
          wolfPackMesh.position.set(
            2.25 * side + mx * 0.14,
            FLOOR_Y - floorShift * unitsPerPx + 1.48 + Math.sin(time * 0.9) * 0.02,
            0.25,
          );
          wolfPackMesh.rotation.set(my * 0.08, mx * 0.16, 0);
        }
        wolfGlowMesh.visible = wolfPackMesh.visible;

        // Hide the extruded 3D A mark in the Hero while the holographic wolves are active, preserving it for later scroll stages.
        const markHeroMask = mobile ? 1 : clamp01(1 - wolfAlpha * 1.25);
        logo.position.set(cur.x, cur.y + Math.sin(time * 0.9) * 0.035, cur.z);
        logo.rotation.set(cur.rx + my * 0.25, cur.ry + mx * 0.55 + Math.sin(time * 0.5) * 0.05, 0);
        logo.scale.setScalar(cur.s * markHeroMask);
        logo.visible = cur.s * markHeroMask > 0.02;
        eye.scale.setScalar((0.24 + 0.04 * Math.sin(time * 2.2)) * cur.eye);

        // The project: paper while it is an idea, a device once it is designed.
        project.visible = cur.ps > 0.02;
        if (project.visible) {
          project.position.set(cur.px, cur.py + Math.sin(time * 1.1 + 1) * 0.03, cur.pz);
          project.rotation.set(cur.prx + my * 0.2, cur.pry + mx * 0.45, cur.prz);
          project.scale.setScalar(cur.ps);
          const made = clamp01(cur.jp - 2);
          slabMesh.scale.z = 0.22 + 0.78 * made;
          screenMesh.position.z = 0.07 * slabMesh.scale.z + 0.004;
          slabMat.color.copy(PAPER).lerp(DEVICE, made);
          slabMat.metalness = 0.6 * made;
          slabMat.roughness = 0.75 - 0.45 * made;
          if (Math.abs(cur.jp - drawn) > 0.006) {
            drawn = cur.jp;
            drawScreen(sctx, cur.jp, projectName, labels, rtl);
            screenTex.needsUpdate = true;
          }
        }

        // The pack: followers chase their place behind the Alpha, or circle the project while it is built.
        pack.visible = packWolves.visible = logo.visible && cur.pack > 0.02;
        if (pack.visible) {
          const fs = mix(cur.s * 0.2, 0.15 * cur.ps, cur.orbit) * cur.pack;
          const ring = 1.15 * Math.max(cur.ps, 0.3);
          for (let n = 0; n < followers.length; n++) {
            const fo = followers[n];
            const kk = 1 - Math.pow(0.0025, dt * Math.max(0.16, 0.62 - fo.row * 0.07));
            const ang = time * 1.1 + (n / followers.length) * Math.PI * 2;
            const tx = mix(logo.position.x + mix(fo.ox, fo.tx, cur.trail) * cur.s, cur.px + Math.cos(ang) * ring, cur.orbit);
            const ty = mix(cur.y - cur.s * 0.8, cur.py + Math.sin(ang * 2 + fo.phase) * 0.55 * cur.ps, cur.orbit);
            const tz = mix(cur.z + mix(fo.oz, fo.tz, cur.trail) * cur.s, cur.pz + Math.sin(ang) * ring, cur.orbit);
            fo.x = mix(fo.x, tx, kk);
            fo.y = mix(fo.y, ty + Math.sin(time * 1.6 + fo.phase) * 0.02 * cur.s, kk);
            fo.z = mix(fo.z, tz, kk);
            fo.ry = mix(fo.ry, mix(logo.rotation.y, -ang, cur.orbit), kk);
            packDummy.position.set(fo.x, fo.y, fo.z);
            packDummy.rotation.set(0, fo.ry, 0);
            packDummy.scale.set(unit * fs, -unit * fs, unit * fs);
            packDummy.updateMatrix();
            pack.setMatrixAt(n, packDummy.matrix);
            packWolves.setMatrixAt(n, packDummy.matrix);
          }
          pack.instanceMatrix.needsUpdate = true;
          packWolves.instanceMatrix.needsUpdate = true;
        }

        const m = Math.min(1.999, Math.max(0, cur.mat));
        const i = Math.floor(m);
        const f = m - i;
        const A = FINISH[i];
        const B = FINISH[i + 1];
        logoMat.color.setScalar(mix(A.tint, B.tint, f));
        logoMat.emissiveIntensity = mix(A.glow, B.glow, f);
        logoMat.metalness = mix(A.metal, B.metal, f);
        logoMat.roughness = mix(A.rough, B.rough, f);
        logoMat.envMapIntensity = mix(A.env, B.env, f);

        floor.visible = Math.abs(floorShift) < vh * 1.3;
        if (floor.visible) {
          floor.position.set(mx * -0.3, FLOOR_Y - floorShift * unitsPerPx, 0);
          phoneContactMesh.visible = project.visible && cur.ps > 0.05;
          if (phoneContactMesh.visible) {
            phoneContactMesh.position.set(cur.px - floor.position.x, 0.223, cur.pz);
            phoneContactMesh.scale.setScalar(cur.ps * 2.1);
          }
        }

        camera.position.x = mx * 0.5;
        camera.position.y = 0.55 - my * 0.25;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };

      root.classList.add("gl-on");
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        themeWatch.disconnect();
        stopName();
        root.classList.remove("gl-on");
        cancelAnimationFrame(raf);
        pmrem.dispose();
        renderer.dispose();
      };
    };

    const timer = window.setTimeout(boot, 200);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} className="stage" aria-hidden="true" />;
}
