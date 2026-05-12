"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DoubleSide, Group, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";

const DRONE_MODEL_URL = "/models/drone.glb";
const DRACO_DECODER_PATH = "/draco/";
const exactPropNames = ["Prop_LF", "Prop_RF", "Prop_BL", "Prop_BR"] as const;
const rotorNameKeywords = ["prop", "propeller", "rotor", "blade"];
const PROP_SPIN_SPEED = 24;
const ROTOR_BLUR_RADIUS = 0.23;
const ROTOR_BLUR_OPACITY = 0.12;
const ROTOR_BLUR_Y_OFFSET = 0.018;
const ROTOR_BLUR_COLOR = "#28c7d8";
const ROTOR_BLUR_SEGMENTS = 96;
const ROTOR_BLUR_SPIN_SPEED = 20;
const ROTOR_BLUR_PULSE_SPEED = 8;
const ROTOR_BLUR_PULSE_AMOUNT = 0.025;
const exactPropAliases: Record<(typeof exactPropNames)[number], string[]> = {
  Prop_LF: ["Prop_LF", "Prop_FL"],
  Prop_RF: ["Prop_RF", "Prop_FR"],
  Prop_BL: ["Prop_BL"],
  Prop_BR: ["Prop_BR"],
};
const exactPropDirections: Record<(typeof exactPropNames)[number], 1 | -1> = {
  Prop_LF: 1,
  Prop_RF: -1,
  Prop_BL: -1,
  Prop_BR: 1,
};

type SpinningRotor = {
  object: Object3D;
  direction: 1 | -1;
};

type RotorBlurDefinition = {
  id: string;
  position: [number, number, number];
};

function RotorBlur({
  active,
  position,
  radius = ROTOR_BLUR_RADIUS,
  opacity = ROTOR_BLUR_OPACITY,
}: {
  active: boolean;
  position: [number, number, number];
  radius?: number;
  opacity?: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const blur = ref.current;
    if (!blur) return;

    blur.rotation.z += delta * ROTOR_BLUR_SPIN_SPEED;
    const material = blur.material as MeshBasicMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * ROTOR_BLUR_PULSE_SPEED) * ROTOR_BLUR_PULSE_AMOUNT;
    material.opacity = active ? Math.max(0, opacity + pulse) : 0;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={10}
      visible={active}
    >
      <circleGeometry args={[radius, ROTOR_BLUR_SEGMENTS]} />
      <meshBasicMaterial
        color={ROTOR_BLUR_COLOR}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

function FallbackDrone({ reducedMotion }: { reducedMotion: boolean }) {
  const rotors = useRef<Group[]>([]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    rotors.current.forEach((rotor, index) => {
      rotor.rotation.y += delta * (index % 2 === 0 ? 18 : -18);
    });
  });

  const arms = [
    [1.05, 0, 1.05],
    [-1.05, 0, 1.05],
    [1.05, 0, -1.05],
    [-1.05, 0, -1.05],
  ] as const;

  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 0.28, 1.4]} />
        <meshStandardMaterial color="#1f313b" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[3.05, 0.08, 0.08]} />
        <meshStandardMaterial color="#7f9daf" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[3.05, 0.08, 0.08]} />
        <meshStandardMaterial color="#7f9daf" metalness={0.35} roughness={0.4} />
      </mesh>
      {arms.map((position, index) => (
        <group key={position.join(":")} position={position} ref={(node) => {
          if (node) rotors.current[index] = node;
        }}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
            <meshStandardMaterial color="#263a45" metalness={0.5} roughness={0.25} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 1.0, 0.035]} />
            <meshStandardMaterial color="#69d9ef" emissive="#12333b" roughness={0.24} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.0, 0.08, 0.035]} />
            <meshStandardMaterial color="#f2b15a" emissive="#3b2410" roughness={0.24} />
          </mesh>
          <RotorBlur active={!reducedMotion} position={[0, ROTOR_BLUR_Y_OFFSET, 0]} />
        </group>
      ))}
    </group>
  );
}

export function DroneModel({ reducedMotion }: { reducedMotion: boolean }) {
  const gltf = useGLTF(DRONE_MODEL_URL, DRACO_DECODER_PATH, false);
  const rotors = useRef<SpinningRotor[]>([]);
  const [rotorBlurs, setRotorBlurs] = useState<RotorBlurDefinition[]>([]);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    const exactMatches = exactPropNames
      .map((name) => {
        const object = exactPropAliases[name]
          .map((alias) => scene.getObjectByName(alias))
          .find((match): match is Object3D => Boolean(match));
        return object ? { object, direction: exactPropDirections[name] } : null;
      })
      .filter((rotor): rotor is SpinningRotor => Boolean(rotor));

    const fallbackMatches: SpinningRotor[] = [];
    scene.traverse((object) => {
      const name = object.name.toLowerCase();
      if (rotorNameKeywords.some((keyword) => name.includes(keyword))) {
        fallbackMatches.push({
          object,
          direction: fallbackMatches.length % 2 === 0 ? 1 : -1,
        });
      }
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // Exact prop names from Joseph-Paul's GLB take precedence; keyword matching remains a future-model fallback.
    const matchedRotors = exactMatches.length > 0 ? exactMatches : fallbackMatches;
    rotors.current = matchedRotors;

    scene.updateMatrixWorld(true);
    setRotorBlurs(
      matchedRotors.map((rotor, index) => {
        const worldPosition = new Vector3();
        rotor.object.getWorldPosition(worldPosition);
        const localPosition = scene.worldToLocal(worldPosition.clone());

        return {
          id: `${rotor.object.uuid}:${index}`,
          position: [
            localPosition.x,
            localPosition.y + ROTOR_BLUR_Y_OFFSET,
            localPosition.z,
          ],
        };
      }),
    );
  }, [scene]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    rotors.current.forEach((rotor) => {
      rotor.object.rotation.y += delta * PROP_SPIN_SPEED * rotor.direction;
    });
  });

  return (
    <group>
      <primitive object={scene} />
      {rotorBlurs.map((rotorBlur) => (
        <RotorBlur
          key={rotorBlur.id}
          active={!reducedMotion}
          position={rotorBlur.position}
        />
      ))}
    </group>
  );
}

class ModelBoundary extends React.Component<
  { children: ReactNode; reducedMotion: boolean },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; reducedMotion: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackDrone reducedMotion={this.props.reducedMotion} />;
    }

    return this.props.children;
  }
}

export function DroneModelErrorBoundary({
  children,
  reducedMotion = false,
}: {
  children: ReactNode;
  reducedMotion?: boolean;
}) {
  return <ModelBoundary reducedMotion={reducedMotion}>{children}</ModelBoundary>;
}

useGLTF.preload(DRONE_MODEL_URL, DRACO_DECODER_PATH, false);
