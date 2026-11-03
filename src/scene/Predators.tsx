import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useVisualStore } from "./LerpedVisual";

type Kind = "penguin" | "whale" | "seal";

interface PredatorSpec {
  kind: Kind;
  radius: number;
  y: number;
  speed: number;
  phase: number;
  scale: number;
}

const SPECS: PredatorSpec[] = Array.from({ length: 16 }, (_, index) => {
  const kind: Kind = (["penguin", "whale", "seal"] as const)[index % 3];
  if (kind === "whale") {
    return { kind, radius: 8.2 + (index % 4) * 0.55, y: -1.7 - (index % 3) * 0.35, speed: 0.07, phase: index * 0.8, scale: 1.7 };
  }
  if (kind === "seal") {
    return { kind, radius: 3.2 + (index % 4) * 0.55, y: -1.15 - (index % 3) * 0.2, speed: 0.16, phase: index * 0.8, scale: 1.35 };
  }
  return { kind, radius: 2.1 + (index % 5) * 0.4, y: -0.55 - (index % 3) * 0.12, speed: 0.22, phase: index * 0.8, scale: 1.45 };
});

export function Predators() {
  const store = useVisualStore();
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    const root = group.current;
    if (!root) return;
    const count = store.current.predatorCount;
    const time = clock.elapsedTime;
    root.children.forEach((child, index) => {
      const spec = SPECS[index];
      const shown = Math.min(1, Math.max(0, count - index));
      const angle = time * spec.speed + spec.phase;
      child.visible = shown > 0.04;
      child.position.set(
        Math.cos(angle) * spec.radius,
        spec.y + Math.sin(time * 0.55 + index) * 0.1,
        Math.sin(angle) * spec.radius,
      );
      child.rotation.y = -angle;
      child.scale.setScalar(shown * spec.scale);
    });
  });

  return (
    <group ref={group}>
      {SPECS.map((spec, index) => (
        <group key={index}>
          {spec.kind === "penguin" ? <Penguin /> : spec.kind === "whale" ? <Whale /> : <Seal />}
        </group>
      ))}
    </group>
  );
}

function Penguin() {
  return (
    <group>
      <mesh position={[0, 0.16, 0]} scale={[0.32, 0.48, 0.26]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#2a3848" emissive="#1a3044" emissiveIntensity={0.45} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.08, 0.12]} scale={[0.2, 0.3, 0.12]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#f3f7fb" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.5, 0.02]} scale={[0.18, 0.18, 0.16]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#1a2330" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.48, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.16, 5]} />
        <meshStandardMaterial color="#f08a3c" roughness={0.45} />
      </mesh>
      <mesh position={[0.28, 0.16, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.06, 0.26, 0.14]} />
        <meshStandardMaterial color="#151c28" />
      </mesh>
      <mesh position={[-0.28, 0.16, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.06, 0.26, 0.14]} />
        <meshStandardMaterial color="#151c28" />
      </mesh>
    </group>
  );
}

function Whale() {
  return (
    <group>
      <mesh scale={[0.42, 0.36, 1.25]} position={[0, 0, 0.1]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#7f96a8" roughness={0.5} />
      </mesh>
      <mesh scale={[0.28, 0.16, 0.7]} position={[0, -0.16, 0.15]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#d5e3ec" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, -0.15]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.18]} />
        <meshStandardMaterial color="#314556" />
      </mesh>
      <mesh position={[0.36, -0.05, 0.25]} rotation={[0.2, 0.2, 0.8]}>
        <boxGeometry args={[0.28, 0.04, 0.14]} />
        <meshStandardMaterial color="#314556" />
      </mesh>
      <mesh position={[-0.36, -0.05, 0.25]} rotation={[0.2, -0.2, -0.8]}>
        <boxGeometry args={[0.28, 0.04, 0.14]} />
        <meshStandardMaterial color="#314556" />
      </mesh>
      <group position={[0, 0, -1.15]}>
        <mesh position={[0.18, 0, 0]} rotation={[0, 0.4, 0.5]}>
          <boxGeometry args={[0.36, 0.04, 0.16]} />
          <meshStandardMaterial color="#2c3e4e" />
        </mesh>
        <mesh position={[-0.18, 0, 0]} rotation={[0, -0.4, -0.5]}>
          <boxGeometry args={[0.36, 0.04, 0.16]} />
          <meshStandardMaterial color="#2c3e4e" />
        </mesh>
      </group>
    </group>
  );
}

function Seal() {
  return (
    <group>
      <mesh scale={[0.22, 0.18, 0.55]} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#6d7c86" roughness={0.62} />
      </mesh>
      <mesh scale={[0.16, 0.14, 0.16]} position={[0, 0.04, 0.48]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#7e8d97" roughness={0.6} />
      </mesh>
      <mesh position={[0.16, -0.08, 0.1]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.16, 0.035, 0.08]} />
        <meshStandardMaterial color="#5c6b74" />
      </mesh>
      <mesh position={[-0.16, -0.08, 0.1]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.16, 0.035, 0.08]} />
        <meshStandardMaterial color="#5c6b74" />
      </mesh>
    </group>
  );
}
