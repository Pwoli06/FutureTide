import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MeshStandardMaterial, Object3D, SphereGeometry, type InstancedMesh } from "three";
import { useVisualStore } from "./LerpedVisual";
import { hash } from "./hash";

const MAX_SWARMS = 56;
const PER_SWARM = 7;
const TOTAL = MAX_SWARMS * PER_SWARM;

const ANCHORS = Array.from({ length: MAX_SWARMS }, (_, index) => ({
  angle: hash(index + 1) * Math.PI * 2,
  lane: hash(index + 20),
  innerR: 1.1 + hash(index + 40) * 4.2,
  outerR: 7.5 + hash(index + 60) * 3.6,
  y: -2.7 + hash(index + 80) * 2.15,
  phase: hash(index + 100) * Math.PI * 2,
}));

export function KrillSwarms() {
  const store = useVisualStore();
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const geometry = useMemo(() => new SphereGeometry(1, 8, 6), []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffb089",
        emissive: "#ff6a32",
        emissiveIntensity: 2.4,
        roughness: 0.35,
        toneMapped: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const krill = mesh.current;
    if (!krill) return;
    const time = clock.elapsedTime;
    const count = store.current.krillSwarmCount;
    const breach = store.current.mpaBreachIntensity;
    material.emissiveIntensity = 2.2 + Math.sin(time * 2.1) * 0.45;

    for (let swarm = 0; swarm < MAX_SWARMS; swarm += 1) {
      const anchor = ANCHORS[swarm];
      const shown = Math.min(1, Math.max(0, count - swarm));
      const outside = anchor.lane < breach;
      const radius = outside ? anchor.outerR : anchor.innerR;
      const cx = Math.cos(anchor.angle) * radius;
      const cz = Math.sin(anchor.angle) * radius;

      for (let particle = 0; particle < PER_SWARM; particle += 1) {
        const wobble = time * 0.7 + anchor.phase + particle * 0.85;
        const ox = Math.cos(wobble) * (0.32 + (particle % 3) * 0.1);
        const oz = Math.sin(wobble * 0.85) * 0.38;
        const oy = Math.sin(wobble * 1.35 + particle) * 0.12;
        const x = cx + ox;
        const y = anchor.y + oy;
        const z = cz + oz;
        dummy.position.set(x, y, z);
        dummy.lookAt(x + Math.cos(wobble), y, z + Math.sin(wobble));
        const body = shown * (particle === 0 ? 0.42 : 0.26);
        dummy.scale.set(body * 0.65, body * 0.42, body * 1.4);
        dummy.updateMatrix();
        krill.setMatrixAt(swarm * PER_SWARM + particle, dummy.matrix);
      }
    }
    krill.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, material, TOTAL]} frustumCulled={false} />
  );
}
