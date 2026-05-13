"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas, useThree, type CanvasProps } from "@react-three/fiber";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

export const droneStudioTuning = {
  background: "#05070a",
  exposure: 1.08,
  rimLightIntensity: 1.25,
  camera: {
    position: [0.25, 0.85, 3.6] as [number, number, number],
    fov: 34,
  },
};

type DroneStudioSceneProps = {
  background?: string | null;
  children: ReactNode;
  className?: string;
  camera?: CanvasProps["camera"];
  dpr?: CanvasProps["dpr"];
  enableShadows?: boolean;
  fallback?: NonNullable<CanvasProps["fallback"]>;
  showContactShadows?: boolean;
};

function WebGLContextLossHandler({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    function handleContextLost(event: Event) {
      event.preventDefault();
      onContextLost();
    }

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost, false);
  }, [gl, onContextLost]);

  return null;
}

export function DroneStudioScene({
  background = droneStudioTuning.background,
  children,
  className,
  camera = droneStudioTuning.camera,
  dpr = [1, 1.25],
  enableShadows = true,
  fallback,
  showContactShadows = true,
}: DroneStudioSceneProps) {
  const [hasLostContext, setHasLostContext] = useState(false);
  const handleContextLost = useCallback(() => setHasLostContext(true), []);

  if (hasLostContext && fallback) return fallback;

  return (
    <Canvas
      className={className}
      camera={camera}
      dpr={dpr}
      fallback={fallback}
      shadows={enableShadows ? { type: PCFShadowMap } : false}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = droneStudioTuning.exposure;
      }}
    >
      <WebGLContextLossHandler onContextLost={handleContextLost} />
      {background ? <color attach="background" args={[background]} /> : null}
      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow={enableShadows}
        position={[4, 5, 3]}
        intensity={2.75}
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        castShadow={enableShadows}
        position={[-3, 3, 5]}
        intensity={1.7}
        angle={0.46}
        penumbra={0.72}
      />
      <pointLight
        position={[2, 2.5, -3]}
        intensity={droneStudioTuning.rimLightIntensity}
        color="#d9f6ff"
      />
      <pointLight position={[0, -1.1, 1.2]} intensity={0.5} color="#28c7d8" />
      {children}
      {enableShadows && showContactShadows ? (
        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.22}
          scale={4.8}
          blur={2.6}
          far={3.2}
          color="#010203"
          frames={1}
        />
      ) : null}
      <Environment preset="city" />
    </Canvas>
  );
}
