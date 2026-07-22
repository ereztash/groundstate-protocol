import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Tier-2 WebGL expression of the coherence motif: rods that start scattered in
 * 3D and rotate into a single aligned axis, the lead rod in copper. The whole
 * group eases toward the pointer, so it responds to the mouse.
 *
 * Client-only and lazy-loaded (three.js is heavy). It renders as an overlay on
 * top of the CoherenceField SVG, which stays as the static / reduced-motion /
 * prerender fallback (see CoherenceVisual). Purely decorative → aria-hidden.
 */

const COUNT = 7;
const TEAL = "#2C5F70";
const COPPER = "#B87333";
const LEAD = Math.floor(COUNT / 2);

type RodSpec = { y: number; lead: boolean; from: THREE.Euler };

const Rods = () => {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(0);

  const rods = useMemo<RodSpec[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        y: (i - (COUNT - 1) / 2) * 0.4,
        lead: i === LEAD,
        // Deterministic scattered start orientation (no RNG — design-controlled).
        from: new THREE.Euler(
          ((i * 1.9) % 2.6) - 1.3,
          ((i * 2.4) % 3.0) - 1.5,
          ((i * 1.3) % 2.2) - 1.1
        ),
      })),
    []
  );

  useFrame((state, delta) => {
    // Ease alignment factor 0→1 over ~2s, easeOutCubic.
    t.current = Math.min(1, t.current + delta * 0.5);
    const e = 1 - Math.pow(1 - t.current, 3);

    rods.forEach((r, i) => {
      const m = meshes.current[i];
      if (!m) return;
      m.rotation.x = THREE.MathUtils.lerp(r.from.x, 0, e);
      m.rotation.y = THREE.MathUtils.lerp(r.from.y, 0, e);
      m.rotation.z = THREE.MathUtils.lerp(r.from.z, 0, e);
    });

    if (group.current) {
      const targetY = state.pointer.x * 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.06;
      const targetX = -state.pointer.y * 0.25;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <group ref={group}>
      {rods.map((r, i) => (
        <mesh
          key={r.y}
          position={[0, r.y, 0]}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <boxGeometry args={[1.9, 0.055, 0.055]} />
          <meshStandardMaterial
            color={r.lead ? COPPER : TEAL}
            roughness={0.45}
            metalness={0.15}
            emissive={r.lead ? COPPER : "#000000"}
            emissiveIntensity={r.lead ? 0.18 : 0}
          />
        </mesh>
      ))}
    </group>
  );
};

const CoherenceGL = ({ className }: { className?: string }) => {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 3, 4]} intensity={0.55} />
        <Rods />
      </Canvas>
    </div>
  );
};

export default CoherenceGL;
