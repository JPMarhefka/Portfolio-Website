"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import type { Group, Mesh } from "three";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useScrollProgress(boundsRef: { current: HTMLDivElement | null }) {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const target = boundsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsActive(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setProgress(1);
        }
      },
      {
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [boundsRef]);

  useEffect(() => {
    if (!isActive) return;

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const target = boundsRef.current;
        if (!target) return;

        const sectionTop = target.offsetTop;
        const sectionHeight = target.offsetHeight || 1;
        const p = (window.scrollY - sectionTop) / sectionHeight;
        setProgress(clamp(p, 0, 1));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [boundsRef, isActive]);

  return { progress, isActive };
}

type DroneProps = {
  progress: number;
  modelUrl: string;
  scale?: number;
  rotationOffset?: [number, number, number];
};

function Drone({ progress, modelUrl, scale = 1, rotationOffset = [0, 0, 0] }: DroneProps) {
  const group = useRef<Group>(null);
  const gltf = useGLTF(modelUrl);
  const rotors = useMemo(() => {
    const parts: Mesh[] = [];
    gltf.scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes("rotor") || name.includes("prop") || name.includes("blade")) {
          parts.push(child as Mesh);
        }
      }
    });
    return parts;
  }, [gltf.scene]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const idleY = Math.sin(state.clock.elapsedTime * 1.8) * 0.08;

    // Keep a hover at load; as soon as scrolling starts, arc to the top-left quickly.
    const launchThreshold = 0.01;
    const launchDuration = 0.28; // portion of the scroll to complete the fly-away
    const flightProgress = clamp((progress - launchThreshold) / launchDuration, 0, 1);
    const eased = flightProgress ** 1.1;

    g.position.x = -eased * 3.4;
    g.position.y = 0.6 + idleY + eased * 3.2;
    g.position.z = 0.2 - eased * 4.2;

    g.rotation.x = -0.08 - eased * 0.55 + rotationOffset[0];
    g.rotation.y = rotationOffset[1];
    g.rotation.z = -0.08 + rotationOffset[2];

    g.scale.setScalar(scale * (1 - eased * 0.05));

    const rotorSpeed = 14 + eased * 12;
    rotors.forEach((r) => {
      r.rotation.y += state.clock.getDelta() * rotorSpeed;
    });
  });

  return (
    <group ref={group} castShadow>
      <primitive object={gltf.scene} />
    </group>
  );
}

type ScrollDroneSceneProps = {
  className?: string;
  modelUrl?: string;
  modelScale?: number;
  rotationOffset?: [number, number, number];
};

export default function ScrollDroneScene({
  className,
  modelUrl = "/dronemodel.glb",
  modelScale = 2.0,
  rotationOffset = [0, 0, 0],
}: ScrollDroneSceneProps) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const { progress, isActive } = useScrollProgress(boundsRef);

  return (
    <div ref={boundsRef} className={className ?? "drone-canvas"}>
      <Canvas dpr={[1, 2]} frameloop={isActive ? "always" : "never"} shadows camera={{ position: [4, 2.2, 5], fov: 45 }}>
        <color attach="background" args={["#050915"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <Float speed={0.6} rotationIntensity={0} floatIntensity={0}>
          <Drone progress={progress} modelUrl={modelUrl} scale={modelScale} rotationOffset={rotationOffset} />
        </Float>
        <ContactShadows position={[0, -0.45, 0]} opacity={0.35} scale={8} blur={2.8} far={2.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/dronemodel.glb");
