"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { droneHotspots } from "@/data/droneHotspots";
import { DroneModel, DroneModelErrorBoundary } from "./DroneModel";
import { DroneStudioScene } from "./DroneStudioScene";

function interpolateTuple(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ] as [number, number, number];
}

function SceneController({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();
  const lookTarget = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const scaled = Math.min(droneHotspots.length - 1, Math.max(0, progress * (droneHotspots.length - 1)));
    const index = Math.min(droneHotspots.length - 2, Math.floor(scaled));
    const t = reducedMotion ? 0 : scaled - index;
    const from = droneHotspots[index];
    const to = droneHotspots[Math.min(index + 1, droneHotspots.length - 1)];
    const cameraPosition = interpolateTuple(from.cameraPosition, to.cameraPosition, t);
    const target = interpolateTuple(from.target, to.target, t);
    const modelPosition = interpolateTuple(from.modelPosition, to.modelPosition, t);
    const modelRotation = interpolateTuple(from.modelRotation, to.modelRotation, t);
    const modelScale = from.modelScale + (to.modelScale - from.modelScale) * t;

    camera.position.lerp(new Vector3(...cameraPosition), 0.075);
    lookTarget.lerp(new Vector3(...target), 0.09);
    camera.lookAt(lookTarget);

    const group = groupRef.current;
    if (group) {
      group.position.lerp(new Vector3(...modelPosition), 0.08);
      group.rotation.x += (modelRotation[0] - group.rotation.x) * 0.08;
      group.rotation.y += (modelRotation[1] - group.rotation.y) * 0.08;
      group.rotation.z += (modelRotation[2] - group.rotation.z) * 0.08;
      group.scale.lerp(new Vector3(modelScale, modelScale, modelScale), 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <DroneModel reducedMotion={reducedMotion} />
    </group>
  );
}

function DroneSceneCanvasFallback() {
  return (
    <div
      className="drone-canvas-static"
      role="img"
      aria-label="Static rendering of the autonomous laser guided drone"
    />
  );
}

export function DroneScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="drone-canvas-wrap">
      <DroneStudioScene
        background="#dfe7e8"
        camera={{ position: [0, 1.4, 6], fov: 38 }}
        dpr={[1, 1.25]}
        fallback={<DroneSceneCanvasFallback />}
        showContactShadows
      >
        <Suspense
          fallback={
            <Html center>
              <span className="drone-canvas-loader">Loading model</span>
            </Html>
          }
        >
          <DroneModelErrorBoundary reducedMotion={reducedMotion}>
            <SceneController progress={progress} reducedMotion={reducedMotion} />
          </DroneModelErrorBoundary>
        </Suspense>
      </DroneStudioScene>
    </div>
  );
}
