"use client";

import { useEffect, useRef, useState } from "react";
/* Type-only: erased at build time, so three is still loaded lazily below and
   never lands in the bundle of a page that does not render a vessel. */
import type * as THREE from "three";
import {
  STATE_STYLE,
  compartmentNoun,
  type CompartmentState,
  type VesselType,
} from "@/lib/cleantrack/types";

/**
 * The vessel as a 3D model.
 *
 * A schematic, not a rendering: the job is to let someone glance at a phone
 * and see which holds are done. Everything here serves that — flat colours
 * straight from the status palette, no textures, no reflections, one light
 * rig that never changes.
 *
 * Models are pre-built per compartment count (see docs/3d-vessel-diagram-prompt.md)
 * and named by contract: `hold_01`…`hold_10`, or `tank_01p`/`tank_01s` for the
 * port/starboard pairs a tanker actually has. Hold 01 is the FORWARDMOST
 * compartment, which is the maritime convention.
 *
 * Compartments are matched to the model BY POSITION, never by parsing the
 * label — an admin can rename "Hold No. 3" to anything, and a lookup that
 * depended on the text would silently colour the wrong hold.
 */

export type Vessel3DCompartment = {
  id: number;
  label: string;
  state: CompartmentState;
};

/** Counts we ship a model for. Anything else falls back to the 2D diagram. */
export const MIN_MODELLED = 4;
export const MAX_MODELLED = 10;

export function canRender3D(type: VesselType, count: number) {
  return (
    (type === "hold" || type === "tank") &&
    count >= MIN_MODELLED &&
    count <= MAX_MODELLED
  );
}

/** The node name for the compartment at `index`, matching the Blender export. */
function nodeNameFor(type: VesselType, index: number) {
  if (type === "tank") {
    const pair = String(Math.floor(index / 2) + 1).padStart(2, "0");
    return `tank_${pair}${index % 2 === 0 ? "p" : "s"}`;
  }
  return `hold_${String(index + 1).padStart(2, "0")}`;
}

export function Vessel3D({
  compartments,
  vesselType,
  className = "",
}: {
  compartments: Vessel3DCompartment[];
  vesselType: VesselType;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  /* Keeps the latest states available to the loader callback without making
     the whole scene tear down and rebuild every time a hold changes colour. */
  const statesRef = useRef(compartments);
  statesRef.current = compartments;

  const count = compartments.length;
  const applyRef = useRef<((next: Vessel3DCompartment[]) => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        if (disposed) return;

        const width = mount.clientWidth || 640;
        const height = mount.clientHeight || 260;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        /* Capped at 2: beyond that costs fill rate on a phone for a schematic
           nobody is inspecting closely. */
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(6.5, 5.2, 8.5);
        camera.lookAt(0, 0, 0);

        /* Two lights and an ambient. Flat and predictable — a moving key light
           would make two holds of the same status look different. */
        scene.add(new THREE.AmbientLight(0xffffff, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 2.0);
        key.position.set(5, 8, 6);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xffffff, 0.8);
        fill.position.set(-6, 3, -4);
        scene.add(fill);

        const root = new THREE.Group();
        scene.add(root);

        /** Paints each compartment from its status. */
        function apply(next: Vessel3DCompartment[]) {
          next.forEach((compartment, index) => {
            const name = nodeNameFor(vesselType, index);
            const node = root.getObjectByName(name);
            if (!node) return;
            const colour = STATE_STYLE[compartment.state].fill;
            node.traverse((child) => {
              const mesh = child as THREE.Mesh;
              if (!mesh.isMesh) return;
              const material = mesh.material as THREE.MeshStandardMaterial;
              if (material?.color) material.color.set(colour);
            });
          });
        }
        applyRef.current = apply;

        const url = `/models/vessel-${vesselType}-${String(count).padStart(2, "0")}.glb`;
        const gltf = await new GLTFLoader().loadAsync(url);
        if (disposed) return;

        root.add(gltf.scene);

        /* Frame the model rather than trusting hardcoded camera numbers, so a
           4-hold and a 10-hold vessel both fill the panel the same way. */
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const centre = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(centre);
        const size = box.getSize(new THREE.Vector3());
        const span = Math.max(size.x, size.z);
        camera.position.set(span * 0.62, span * 0.5, span * 0.82);
        camera.lookAt(0, 0, 0);

        apply(statesRef.current);

        /* Drag to spin. Deliberately only around the vertical axis: free
           orbit lets someone end up under the hull looking at nothing, and
           there is no value in seeing this from below. */
        let dragging = false;
        let lastX = 0;
        const onDown = (e: PointerEvent) => {
          dragging = true;
          lastX = e.clientX;
          renderer.domElement.setPointerCapture(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          root.rotation.y += (e.clientX - lastX) * 0.01;
          lastX = e.clientX;
        };
        const onUp = (e: PointerEvent) => {
          dragging = false;
          try {
            renderer.domElement.releasePointerCapture(e.pointerId);
          } catch {
            /* Pointer already gone; nothing to release. */
          }
        };
        renderer.domElement.addEventListener("pointerdown", onDown);
        renderer.domElement.addEventListener("pointermove", onMove);
        renderer.domElement.addEventListener("pointerup", onUp);
        renderer.domElement.addEventListener("pointercancel", onUp);
        renderer.domElement.style.touchAction = "pan-y";
        renderer.domElement.style.cursor = "grab";

        let frame = 0;
        const tick = () => {
          renderer.render(scene, camera);
          frame = requestAnimationFrame(tick);
        };
        tick();

        const onResize = () => {
          const w = mount.clientWidth || width;
          const h = mount.clientHeight || height;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(mount);

        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          renderer.domElement.removeEventListener("pointerdown", onDown);
          renderer.domElement.removeEventListener("pointermove", onMove);
          renderer.domElement.removeEventListener("pointerup", onUp);
          renderer.domElement.removeEventListener("pointercancel", onUp);
          /* Geometries and materials are not garbage collected on their own —
             leaking them across navigations is how a long session ends with a
             lost WebGL context. */
          scene.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const material = mesh.material;
            if (Array.isArray(material)) material.forEach((m) => m.dispose());
            else material?.dispose();
          });
          renderer.dispose();
          renderer.domElement.remove();
          applyRef.current = null;
        };
      } catch (error) {
        /* No WebGL, a blocked file, a driver that will not create a context.
           The caller shows the 2D diagram, which carries the same information
           — this is an enhancement, never the only way to read the data. */
        console.error("[vessel-3d] falling back to the 2D diagram", error);
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [vesselType, count]);

  /* Recolour in place when a hold changes status, without rebuilding. */
  useEffect(() => {
    applyRef.current?.(compartments);
  }, [compartments]);

  if (failed) return null;

  const noun = compartmentNoun(vesselType, true).toLowerCase();
  return (
    <div
      ref={mountRef}
      className={`h-[260px] w-full sm:h-[320px] ${className}`}
      role="img"
      aria-label={`3D view of the vessel showing ${count} ${noun} and their cleaning status. The same information is in the table below.`}
    />
  );
}
