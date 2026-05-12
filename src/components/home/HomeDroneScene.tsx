"use client";

import { Center, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Group } from "three";
import { DroneModel, DroneModelErrorBoundary } from "@/components/drone/DroneModel";
import { DroneStudioScene } from "@/components/drone/DroneStudioScene";

const HERO_DRONE_ROTATION: [number, number, number] = [-0.34, -0.52, 0.04];

function HomeDroneCameraAim() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function HomeDroneRig({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (reducedMotion) {
      group.position.y += (0 - group.position.y) * 0.08;
      group.rotation.set(...HERO_DRONE_ROTATION);
      return;
    }

    const elapsed = clock.getElapsedTime();
    group.position.y = Math.sin(elapsed * 1.25) * 0.08;
    group.rotation.x += (HERO_DRONE_ROTATION[0] - group.rotation.x) * 0.08;
    group.rotation.y += delta * 0.18;
    group.rotation.z += (HERO_DRONE_ROTATION[2] - group.rotation.z) * 0.08;
  });

  return (
    <group ref={groupRef} rotation={HERO_DRONE_ROTATION} scale={1.82}>
      <Center>
        <DroneModel reducedMotion={reducedMotion} />
      </Center>
    </group>
  );
}

function HomeDroneCanvasFallback() {
  return (
    <div
      className="home-drone-fallback home-drone-fallback--render"
      role="img"
      aria-label="Autonomous drone poster fallback"
    />
  );
}

export function HomeDroneScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="home-drone-scene">
      <DroneStudioScene
        camera={{ position: [0.18, 0.78, 3.35], fov: 34 }}
        dpr={[1, 1.25]}
        enableShadows={false}
        fallback={<HomeDroneCanvasFallback />}
        showContactShadows={false}
      >
        <HomeDroneCameraAim />
        <Suspense
          fallback={
            <Html center>
              <span className="home-drone-loader">Loading drone</span>
            </Html>
          }
        >
          <DroneModelErrorBoundary reducedMotion={reducedMotion}>
            <HomeDroneRig reducedMotion={reducedMotion} />
          </DroneModelErrorBoundary>
        </Suspense>
      </DroneStudioScene>
    </div>
  );
}
