import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, MeshStandardMaterial, Object3D, type InstancedMesh } from "three";
import { useVisualStore } from "./LerpedVisual";
import { hash } from "./hash";

const GRID = 10;

interface Floe {
  x: number;
  z: number;
  rot: number;
  rank: number;
  thick: number;
  sx: number;
  sz: number;
}

function buildFloes(): Floe[] {
  const draft: Array<Omit<Floe, "rank"> & { persistence: number }> = [];
  for (let i = 0; i < GRID; i += 1) {
    for (let j = 0; j < GRID; j += 1) {
      const nx = i / (GRID - 1);
      const nz = j / (GRID - 1);
      draft.push({
        x: (nx - 0.5) * 24 + (hash(i * 19 + j) - 0.5) * 0.6,
        z: (nz - 0.5) * 24 + (hash(i + j * 23) - 0.5) * 0.6,
        rot: (hash(i * 3 + j * 11) - 0.5) * 0.55,
        // Low nz is the Antarctic edge, so those floes linger as coverage falls.
        persistence: (1 - nz) * 0.78 + (1 - Math.abs(nx - 0.5) * 2) * 0.22,
        thick: 0.1 + hash(i * 7 + j * 5) * 0.16,
        sx: 1.35 + hash(i * 13 + 2) * 0.55,
        sz: 1.25 + hash(j * 17 + 4) * 0.6,
      });
    }
  }
  return [...draft]
    .sort((a, b) => b.persistence - a.persistence)
    .map((floe, index, list) => ({
      x: floe.x,
      z: floe.z,
      rot: floe.rot,
      thick: floe.thick,
      sx: floe.sx,
      sz: floe.sz,
      rank: index / list.length,
    }));
}

const FLOES = buildFloes();

export function SeaIce() {
  const store = useVisualStore();
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#e7f6ff",
        roughness: 0.38,
        metalness: 0.04,
        emissive: "#d7f4ff",
        emissiveIntensity: 0.35,
      }),
    [],
  );

  useLayoutEffect(() => {
    const ice = mesh.current;
    if (!ice) return;
    const lit = new Color("#f4fbff");
    const shade = new Color("#c5e4f6");
    FLOES.forEach((_, index) => {
      ice.setColorAt(index, index % 4 === 0 ? shade : lit);
    });
    if (ice.instanceColor) ice.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const ice = mesh.current;
    if (!ice) return;
    const coverage = store.current.iceCoverage;
    FLOES.forEach((floe, index) => {
      const fade = Math.min(1, Math.max(0, (coverage - floe.rank) / 0.045));
      dummy.position.set(floe.x, 0.08 + floe.thick * 0.2, floe.z);
      dummy.rotation.set(0, floe.rot, 0);
      dummy.scale.set(floe.sx * fade, floe.thick * fade, floe.sz * fade);
      dummy.updateMatrix();
      ice.setMatrixAt(index, dummy.matrix);
    });
    ice.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, material, FLOES.length]} frustumCulled={false} />
  );
}
