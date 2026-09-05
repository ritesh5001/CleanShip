/**
 * The 3D vessel view, as plain three.js.
 *
 * WHY NOT react-three-fiber
 *
 * Everything this scene does is imperative and per-instance: clone a module,
 * clone its materials so one hold's colour cannot leak into its neighbour,
 * scale one mesh to a ratio. A reconciler buys nothing here and costs a
 * dependency that has to track React's major versions. So: one dependency,
 * `three`, and a class with a lifecycle the React wrapper drives.
 *
 * The geometry is not per-vessel. `hull-{bulker,tanker}.glb` loads once and
 * caches; `module-{hold,tank}.glb` is cloned per compartment and positioned
 * from `vessel-layout.json`. Any compartment count works, and the download is
 * the same whether the ship has four holds or ten.
 *
 * Authoring is Z-up (+X bow, +Y port); glTF is Y-up. The conversion is
 * (x, z, -y) and it lives in exactly one place: `place()`.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* -------------------------------------------------------------------- */
/* The manifest                                                         */
/* -------------------------------------------------------------------- */

export type LayoutSpec = {
  name: string;
  position: number;
  side?: "p" | "s";
  x: number;
  y: number;
  z: number;
  scaleX: number;
  cargoBaseZ: number;
  cargoHeight: number;
};

export type CountPlan = {
  compartments: LayoutSpec[];
  crossdecks: { x: number; y?: number; z: number }[];
};

export type VesselLayout = {
  version: number;
  labelOffsetZ: number;
  hull: { loa: number; beam: number; depth: number; draft: number };
  types: Record<
    "hold" | "tank",
    {
      hull: string;
      module: string;
      maxCompartments: number;
      counts: Record<string, CountPlan>;
    }
  >;
};

/** What the app hands over per compartment. Colours come from the app so
 *  `STATE_STYLE` stays the only place they are defined. */
export type CompartmentView = {
  id: number;
  label: string;
  position: number;
  /** 0..1, from `progressOf`. */
  ratio: number;
  /** Compartment fill colour for its state. */
  fill: string;
  /** Edge colour — used for the progress bar and the selection outline. */
  edge: string;
  /** Short readout under the label, e.g. "3/5" or "N/A". */
  caption: string;
  /** Open the hatch and show the cargo level. */
  open: boolean;
};

export type SceneOptions = {
  basePath?: string;
  interactive?: boolean;
  showLabels?: boolean;
  onSelect?: (id: number) => void;
  onHover?: (id: number | null) => void;
};

/* -------------------------------------------------------------------- */
/* Asset cache — one fetch per file for the life of the tab              */
/* -------------------------------------------------------------------- */

const gltfCache = new Map<string, Promise<THREE.Group>>();
let layoutCache: Promise<VesselLayout> | null = null;

function loadGltf(url: string): Promise<THREE.Group> {
  let hit = gltfCache.get(url);
  if (!hit) {
    const loader = new GLTFLoader();
    hit = loader.loadAsync(url).then((g) => g.scene);
    gltfCache.set(url, hit);
  }
  return hit;
}

export function loadLayout(basePath = "/models"): Promise<VesselLayout> {
  if (!layoutCache) {
    layoutCache = fetch(`${basePath}/vessel-layout.json`).then((r) => {
      if (!r.ok) throw new Error(`vessel-layout.json: HTTP ${r.status}`);
      return r.json() as Promise<VesselLayout>;
    });
  }
  return layoutCache;
}

/** True when this browser can actually run the view. */
export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2"),
    );
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------- */
/* Helpers                                                              */
/* -------------------------------------------------------------------- */

/** "Hold No. 3" -> "3"; "1p" stays "1p". Ten full labels collide on screen. */
function shortLabel(label: string) {
  const stripped = label.replace(/^\s*(hold|tank)\s*(no\.?)?\s*/i, "").trim();
  return stripped || label;
}

/** Z-up authoring -> Y-up glTF. The only place this conversion happens. */
function place(node: THREE.Object3D, x: number, y: number, z: number) {
  node.position.set(x, z, -y);
}

function labelTexture(label: string, caption: string): THREE.CanvasTexture {
  const w = 512;
  const h = 192;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  const r = 26;
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.strokeStyle = "rgba(15,42,68,0.22)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(6, 6, w - 12, h - 12, r);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0a2e52";
  ctx.font = "600 62px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, caption ? h / 2 - 22 : h / 2);
  if (caption) {
    ctx.fillStyle = "#4c5c6b";
    ctx.font = "500 46px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText(caption, w / 2, h / 2 + 38);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function contactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0, size / 2, size / 2, size / 2,
  );
  g.addColorStop(0, "rgba(12,32,52,0.34)");
  g.addColorStop(0.55, "rgba(12,32,52,0.14)");
  g.addColorStop(1, "rgba(12,32,52,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

type Instance = {
  id: number;
  root: THREE.Object3D;
  spec: LayoutSpec;
  tinted: THREE.MeshStandardMaterial[];
  cover?: THREE.Object3D;
  coverStowed?: THREE.Object3D;
  progress?: THREE.Mesh;
  progressMat?: THREE.MeshStandardMaterial;
  cargo?: THREE.Mesh;
  outline: THREE.LineSegments;
  sprite?: THREE.Sprite;
  hitboxes: THREE.Object3D[];
};

/* -------------------------------------------------------------------- */
/* The scene                                                            */
/* -------------------------------------------------------------------- */

export class VesselScene {
  private readonly container: HTMLElement;
  private readonly opts: Required<Pick<SceneOptions, "basePath" | "interactive" | "showLabels">> &
    SceneOptions;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private pmrem?: THREE.PMREMGenerator;
  private envRT?: THREE.WebGLRenderTarget;

  private shipGroup = new THREE.Group();
  private labelGroup = new THREE.Group();
  private instances: Instance[] = [];
  private byId = new Map<number, Instance>();
  private selectedId: number | null = null;
  private hoveredId: number | null = null;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDownAt: { x: number; y: number } | null = null;

  private frame = 0;
  private renderPending = false;
  private settleUntil = 0;
  private resizeObserver?: ResizeObserver;
  private disposed = false;
  private disposables: { dispose(): void }[] = [];

  constructor(container: HTMLElement, options: SceneOptions = {}) {
    this.container = container;
    this.opts = {
      basePath: options.basePath ?? "/models",
      interactive: options.interactive ?? false,
      showLabels: options.showLabels ?? true,
      ...options,
    };
    this.initRenderer();
  }

  /* ---------------------------------------------------------------- */

  private initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    scene.add(this.shipGroup, this.labelGroup);
    this.scene = scene;

    // A room probe rather than a downloaded HDR: PBR needs an environment or
    // the paint reads as flat plastic, and this costs no network at all.
    this.pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    this.envRT = this.pmrem.fromScene(room, 0.04);
    scene.environment = this.envRT.texture;
    scene.environmentIntensity = 0.85;
    (room as unknown as { dispose?: () => void }).dispose?.();

    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(6, 9, 5);
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xdfeaf4, 0x50606c, 0.55));

    const shadowTex = contactShadowTexture();
    this.disposables.push(shadowTex);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    scene.add(shadow);
    this.disposables.push(shadow.geometry, shadow.material as THREE.Material);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.4, 120);
    this.camera.position.set(9.5, 5.2, 9.5);

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 26;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = 1.44;      // never drop below the waterline
    controls.target.set(0, 0.7, 0);
    controls.addEventListener("change", () => this.requestRender());
    this.controls = controls;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();

    if (this.opts.interactive) this.attachPointer();
    this.loop();
  }

  /* ---------------------------------------------------------------- */

  async load(vesselType: "hold" | "tank", count: number) {
    const base = this.opts.basePath;
    const layout = await loadLayout(base);
    const entry = layout.types[vesselType];
    if (!entry) throw new Error(`no layout for vessel type ${vesselType}`);
    const plan = entry.counts[String(count)];
    if (!plan) {
      throw new Error(
        `no layout for ${count} ${vesselType}s (have ${Object.keys(entry.counts).join(", ")})`,
      );
    }

    const [hull, moduleScene] = await Promise.all([
      loadGltf(`${base}/${entry.hull}`),
      loadGltf(`${base}/${entry.module}`),
    ]);
    if (this.disposed) return;

    this.shipGroup.add(hull.clone(true));

    const compartmentProto = moduleScene.getObjectByName("compartment");
    const crossdeckProto = moduleScene.getObjectByName("crossdeck");
    if (!compartmentProto) throw new Error("module has no `compartment` node");

    for (const spec of plan.compartments) {
      this.instances.push(this.buildCompartment(compartmentProto, spec, layout));
    }
    if (crossdeckProto) {
      for (const cd of plan.crossdecks) {
        const node = crossdeckProto.clone(true);
        node.visible = true;
        node.traverse((o) => (o.visible = true));
        place(node, cd.x, cd.y ?? 0, cd.z);
        this.shipGroup.add(node);
      }
    }

    this.frameCamera();
    this.requestRender();
  }

  private buildCompartment(
    proto: THREE.Object3D,
    spec: LayoutSpec,
    layout: VesselLayout,
  ): Instance {
    const root = proto.clone(true);
    root.name = spec.name;
    place(root, spec.x, spec.y, spec.z);
    root.scale.set(spec.scaleX, 1, 1);   // X only — never Y or Z
    root.visible = true;

    const tinted: THREE.MeshStandardMaterial[] = [];
    const hitboxes: THREE.Object3D[] = [];
    const inst: Partial<Instance> = { hitboxes };
    let coaming: THREE.Mesh | undefined;

    root.traverse((o) => {
      o.visible = true;
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Clone the material per instance. Without this, recolouring one hold
      // recolours every hold, because glTF clones share materials.
      const cloned = (mesh.material as THREE.MeshStandardMaterial).clone();
      mesh.material = cloned;

      const part = o.name.split("__").pop() ?? "";
      if (part === "coaming" || part === "hatch_cover" || part === "hatch_cover_stowed") {
        tinted.push(cloned);
        hitboxes.push(mesh);
      }
      if (part === "coaming") coaming = mesh;
      if (part === "hatch_cover") inst.cover = mesh;
      if (part === "hatch_cover_stowed") inst.coverStowed = mesh;
      if (part === "compartment_progress") {
        // The 2D plan fills a cell with the edge colour at low opacity rather
        // than replacing it. Same here, or a finished hold would read as
        // saturated green instead of the pale "complete" the grid shows.
        cloned.transparent = true;
        cloned.opacity = 0.34;
        cloned.depthWrite = false;
        cloned.roughness = 0.75;
        inst.progress = mesh;
        inst.progressMat = cloned;
      }
      if (part === "cargo_fill") inst.cargo = mesh;
    });

    // Selection outline: a wireframe box round the hatch in the app's own
    // selection colour. Measured from the coaming alone — a box round the whole
    // module would swallow `cargo_fill`, which reaches down to the tank top.
    const size = new THREE.Vector3(1, 0.2, 1);
    const centre = new THREE.Vector3();
    if (coaming) {
      coaming.geometry.computeBoundingBox();
      const bb = coaming.geometry.boundingBox;
      if (bb) {
        bb.getSize(size);
        bb.getCenter(centre);
        centre.add(coaming.position);
      }
    }
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(
          Math.max(size.x, 0.05) * 1.03,
          Math.max(size.y, 0.10) * 1.9,
          Math.max(size.z, 0.05) * 1.05,
        ),
      ),
      new THREE.LineBasicMaterial({ color: 0x014ba8, transparent: true, opacity: 0.95 }),
    );
    outline.position.copy(centre);
    outline.visible = false;
    root.add(outline);

    this.shipGroup.add(root);

    let sprite: THREE.Sprite | undefined;
    if (this.opts.showLabels) {
      sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ transparent: true, depthTest: false }),
      );
      sprite.renderOrder = 10;
      sprite.scale.set(0.62, 0.233, 1);
      place(sprite, spec.x, spec.y, spec.z + layout.labelOffsetZ);
      this.labelGroup.add(sprite);
    }

    const instance: Instance = {
      id: -1,
      root,
      spec,
      tinted,
      outline,
      hitboxes,
      sprite,
      cover: inst.cover,
      coverStowed: inst.coverStowed,
      progress: inst.progress,
      progressMat: inst.progressMat,
      cargo: inst.cargo,
    };
    return instance;
  }

  /* ---------------------------------------------------------------- */

  /**
   * Apply live status. Called on every poll, so it must be cheap and must not
   * allocate geometry — only colours, scales and visibility change.
   *
   * Compartments arrive in the app's own order and are matched to hull
   * positions by `position` ascending: No. 1 is the forwardmost compartment,
   * which is maritime convention and the opposite of the 2D plan view.
   */
  update(compartments: CompartmentView[]) {
    const ordered = [...compartments].sort((a, b) => a.position - b.position);
    this.byId.clear();

    ordered.forEach((c, index) => {
      const inst = this.instances[index];
      if (!inst) return;
      inst.id = c.id;
      this.byId.set(c.id, inst);

      for (const mat of inst.tinted) {
        mat.color.setStyle(c.fill);
        mat.needsUpdate = false;
      }

      if (inst.progress && inst.progressMat) {
        const visible = c.ratio > 0.001;
        inst.progress.visible = visible;
        inst.progress.scale.x = Math.max(c.ratio, 1e-4);
        inst.progressMat.color.setStyle(c.edge);
      }

      if (inst.cover) inst.cover.visible = !c.open;
      if (inst.coverStowed) inst.coverStowed.visible = c.open;
      if (inst.cargo) {
        inst.cargo.visible = c.open && c.ratio > 0.001;
        inst.cargo.scale.z = Math.max(c.ratio, 1e-4);
      }

      if (inst.sprite) {
        const previous = inst.sprite.material.map;
        inst.sprite.material.map = labelTexture(shortLabel(c.label), c.caption);
        inst.sprite.material.needsUpdate = true;
        previous?.dispose();
      }

      inst.outline.visible = inst.id === this.selectedId;
    });

    this.requestRender();
  }

  setSelected(id: number | null) {
    this.selectedId = id;
    for (const inst of this.instances) inst.outline.visible = inst.id === id;
    this.requestRender();
  }

  /** Frame the whole ship, whatever its size. */
  private frameCamera() {
    const box = new THREE.Box3().setFromObject(this.shipGroup);
    if (box.isEmpty()) return;
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);
    this.controls.target.set(centre.x, centre.y * 0.82, centre.z);
    // Fit the longer of the two screen axes; a ship is far wider than it is
    // tall, so fitting height alone leaves it a speck in the middle.
    const fov = (this.camera.fov * Math.PI) / 180;
    const aspect = Math.max(this.camera.aspect, 0.4);
    const radius = Math.hypot(size.x, size.z) * 0.5;
    const fitHeight = size.y / 2 / Math.tan(fov / 2);
    const fitWidth = radius / Math.tan(fov / 2) / aspect;
    const distance = Math.max(fitHeight, fitWidth) * 1.15;
    // Normalise the direction, or the offsets quietly shorten the distance and
    // the bow ends up cropped.
    const dir = new THREE.Vector3(0.52, 0.40, 0.58).normalize();
    this.camera.position.copy(this.controls.target).addScaledVector(dir, distance);
    this.controls.minDistance = distance * 0.45;
    this.controls.maxDistance = distance * 2.1;
    this.controls.update();
  }

  /* ---------------------------------------------------------------- */

  private attachPointer() {
    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerleave", this.onPointerLeave);
  }

  private setPointer(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private pick(): Instance | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets = this.instances.flatMap((i) =>
      i.hitboxes.filter((h) => h.visible),
    );
    const hit = this.raycaster.intersectObjects(targets, false)[0];
    if (!hit) return null;
    let node: THREE.Object3D | null = hit.object;
    while (node && !this.instances.some((i) => i.root === node)) node = node.parent;
    return this.instances.find((i) => i.root === node) ?? null;
  }

  private onPointerDown = (e: PointerEvent) => {
    this.pointerDownAt = { x: e.clientX, y: e.clientY };
  };

  private onPointerUp = (e: PointerEvent) => {
    const down = this.pointerDownAt;
    this.pointerDownAt = null;
    if (!down) return;
    // An orbit drag must not select. Anything under ~6px is a tap.
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    this.setPointer(e);
    const inst = this.pick();
    if (inst && inst.id >= 0) this.opts.onSelect?.(inst.id);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.pointerDownAt) return;             // orbiting, not hovering
    this.setPointer(e);
    const inst = this.pick();
    const id = inst?.id ?? null;
    if (id !== this.hoveredId) {
      this.hoveredId = id;
      this.renderer.domElement.style.cursor = id === null ? "grab" : "pointer";
      this.opts.onHover?.(id);
    }
  };

  private onPointerLeave = () => {
    this.hoveredId = null;
    this.renderer.domElement.style.cursor = "grab";
    this.opts.onHover?.(null);
  };

  /* ---------------------------------------------------------------- */

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }

  /** Render on demand. A continuous loop on a phone is a battery bill for a
   *  picture that is not moving. */
  private requestRender() {
    this.renderPending = true;
    this.settleUntil = performance.now() + 900;   // let damping finish
  }

  private loop = () => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.loop);
    if (document.hidden) return;
    const settling = performance.now() < this.settleUntil;
    if (!this.renderPending && !settling) return;
    this.renderPending = false;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  /* ---------------------------------------------------------------- */

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();

    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("pointerup", this.onPointerUp);
    el.removeEventListener("pointermove", this.onPointerMove);
    el.removeEventListener("pointerleave", this.onPointerLeave);

    this.controls.dispose();
    for (const d of this.disposables) d.dispose();

    // Only dispose what this instance owns. Geometry and textures inside the
    // cached glTF are shared with other mounts and must survive.
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && Array.isArray(mesh.material)) return;
      const sprite = o as THREE.Sprite;
      if (sprite.isSprite) {
        sprite.material.map?.dispose();
        sprite.material.dispose();
      }
      const line = o as THREE.LineSegments;
      if (line.isLineSegments) {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }
    });
    for (const inst of this.instances) {
      for (const mat of inst.tinted) mat.dispose();
      inst.progressMat?.dispose();
    }

    this.envRT?.dispose();
    this.pmrem?.dispose();
    this.renderer.dispose();
    el.remove();
    this.instances = [];
    this.byId.clear();
  }
}
