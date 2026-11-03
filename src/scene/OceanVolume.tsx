import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  FogExp2,
  GLSL3,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  type InstancedMesh,
  type MeshStandardMaterial,
  type ShaderMaterial,
} from "three";
import { useVisualStore } from "./LerpedVisual";
import { hash } from "./hash";

const SNOW = Array.from({ length: 160 }, (_, index) => ({
  x: (hash(index + 3) - 0.5) * 30,
  y: hash(index + 8) * 8 - 7.2,
  z: (hash(index + 13) - 0.5) * 30,
  size: 0.015 + hash(index + 21) * 0.03,
  speed: 0.12 + hash(index + 34) * 0.28,
}));

const waterVertex = /* glsl */ `
  out float vWave;
  uniform float uTime;
  void main() {
    vec3 displaced = position;
    float wave = sin(position.x * 0.32 + uTime * 0.7) * 0.07
      + cos(position.y * 0.26 + uTime * 0.5) * 0.05;
    displaced.z += wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const waterFragment = /* glsl */ `
  precision highp float;
  in float vWave;
  uniform vec3 uColor;
  uniform float uTurbidity;
  out vec4 fragColor;
  void main() {
    float crest = smoothstep(0.0, 0.07, vWave);
    vec3 color = mix(uColor, vec3(0.8, 0.92, 1.0), 0.14 + crest * 0.4);
    color = mix(color, vec3(0.45, 0.52, 0.46), uTurbidity * 0.45);
    float alpha = mix(0.1, 0.32, uTurbidity);
    fragColor = vec4(color, alpha);
  }
`;

export function OceanVolume() {
  const store = useVisualStore();
  const { scene, gl } = useThree();
  const fog = useMemo(() => new FogExp2("#0b3558", 0.02), []);
  const background = useMemo(() => new Color("#071422"), []);
  const surface = useRef<ShaderMaterial>(null);
  const outerFloor = useRef<MeshStandardMaterial>(null);
  const innerFloor = useRef<MeshStandardMaterial>(null);
  const snow = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const snowGeometry = useMemo(() => new SphereGeometry(1, 4, 4), []);
  const snowMaterial = useMemo(
    () => new MeshBasicMaterial({ color: "#e7f3fb", transparent: true, opacity: 0.32, depthWrite: false }),
    [],
  );

  useLayoutEffect(() => {
    scene.fog = fog;
    scene.background = background;
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog, background, gl]);

  useFrame(({ clock }) => {
    const tint = store.current.waterTint;
    const turbidity = store.current.waterTurbidity;
    background.copy(tint).multiplyScalar(0.28);
    fog.color.copy(tint).multiplyScalar(0.62);
    fog.density = 0.012 + turbidity * 0.042;

    if (surface.current) {
      surface.current.uniforms.uTime.value = clock.elapsedTime;
      (surface.current.uniforms.uColor.value as Color).copy(tint);
      surface.current.uniforms.uTurbidity.value = turbidity;
    }
    outerFloor.current?.color.copy(tint).multiplyScalar(0.16);
    innerFloor.current?.color.copy(tint).multiplyScalar(0.32);

    const flakes = snow.current;
    if (!flakes) return;
    const time = clock.elapsedTime;
    SNOW.forEach((flake, index) => {
      const y = ((((flake.y - time * flake.speed) % 8) + 8) % 8) - 7.2;
      dummy.position.set(flake.x, y, flake.z);
      dummy.scale.setScalar(flake.size * (0.45 + turbidity));
      dummy.updateMatrix();
      flakes.setMatrixAt(index, dummy.matrix);
    });
    flakes.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <hemisphereLight args={["#d7ecff", "#0c3044", 0.62]} />
      <ambientLight intensity={0.22} color="#9ec4e8" />
      <directionalLight position={[10, 16, 6]} intensity={1.45} color="#fff6e4" />
      <directionalLight position={[-12, 4, -6]} intensity={0.28} color="#7eb6ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[42, 72]} />
        <shaderMaterial
          ref={surface}
          glslVersion={GLSL3}
          transparent
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new Color("#1a5380") },
            uTurbidity: { value: 0.3 },
          }}
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.15, 0]}>
        <circleGeometry args={[42, 48]} />
        <meshStandardMaterial ref={outerFloor} color="#071018" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.08, 0]}>
        <circleGeometry args={[6.4, 48]} />
        <meshStandardMaterial ref={innerFloor} color="#143044" roughness={0.9} />
      </mesh>

      <LightShafts />

      <instancedMesh ref={snow} args={[snowGeometry, snowMaterial, SNOW.length]} frustumCulled={false} />
    </>
  );
}

function LightShafts() {
  return (
    <group>
      {[-6, -2, 2.5, 6].map((x, index) => (
        <mesh key={x} position={[x, -3.2, -3 + index * 1.4]}>
          <planeGeometry args={[1.4, 7.2]} />
          <meshBasicMaterial color="#d5ebff" transparent opacity={0.035} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
