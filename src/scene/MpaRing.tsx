import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MeshStandardMaterial, type MeshBasicMaterial } from "three";
import { useVisualStore } from "./LerpedVisual";

const BUOYS = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI * 2;
  return [Math.cos(angle) * 6.4, Math.sin(angle) * 6.4] as const;
});

export function MpaRing() {
  const store = useVisualStore();
  const ring = useRef<MeshStandardMaterial>(null);
  const halo = useRef<MeshBasicMaterial>(null);
  const buoy = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0d2a3a",
        emissive: "#7ee7ff",
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
    [],
  );
  const cyan = useMemo(() => new Color("#7ee7ff"), []);
  const coral = useMemo(() => new Color("#ff7a5c"), []);
  const glow = useMemo(() => new Color("#7ee7ff"), []);

  useFrame(({ clock }) => {
    const breach = store.current.mpaBreachIntensity;
    const pulse = 0.75 + Math.sin(clock.elapsedTime * 1.6) * 0.15;
    glow.copy(cyan).lerp(coral, breach);
    if (ring.current) {
      ring.current.emissive.copy(glow);
      ring.current.emissiveIntensity = (0.7 + breach * 2.6) * pulse;
    }
    buoy.emissive.copy(glow);
    buoy.emissiveIntensity = (1.4 + breach * 2.2) * pulse;
    if (halo.current) {
      halo.current.color.copy(glow);
      halo.current.opacity = 0.08 + breach * 0.32;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <torusGeometry args={[6.4, 0.045, 8, 96]} />
        <meshStandardMaterial ref={ring} color="#123848" emissive="#7ee7ff" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[6.15, 6.7, 80]} />
        <meshBasicMaterial ref={halo} color="#7ee7ff" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <torusGeometry args={[6.4, 0.03, 6, 64]} />
        <meshStandardMaterial color="#123848" emissive="#7ee7ff" emissiveIntensity={0.45} toneMapped={false} transparent opacity={0.7} />
      </mesh>
      {BUOYS.map(([x, z]) => (
        <mesh key={`${x.toFixed(2)}-${z.toFixed(2)}`} position={[x, 0.16, z]} material={buoy}>
          <sphereGeometry args={[0.07, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
}
