import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows, SoftShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- V15 "LIVING ATMOSPHERE" EDITION ---
// User Request: "Some more good"
// Additions:
// 1. Dynamic Lighting: Lights rotate slowly to show off material curves.
// 2. Upward Particles: Contrast to downward motion.
// 3. Mouse Parallax: Interactive depth.

const LivingRunner = (props) => {
    const group = useRef();
    const { scene, animations } = useGLTF('https://threejs.org/examples/models/gltf/Soldier.glb');
    const { actions } = useAnimations(animations, group);

    // 1. ANIMATION
    useEffect(() => {
        if (actions['Run']) {
            actions['Run'].reset().fadeIn(1).play();
            actions['Run'].timeScale = 1.0;
        }
    }, [actions]);

    // 2. ORGANIC MOTION LOOP
    useFrame((state, delta) => {
        if (group.current) {
            const time = state.clock.getElapsedTime();

            // Descent Speed
            group.current.position.y -= 2.0 * delta;

            // "Liquid" Drift - Sine Wave on X axis
            group.current.position.x = Math.sin(time * 0.5) * 1.5;

            // Subtle Rotation Sway
            group.current.rotation.y = Math.sin(time * 0.5) * 0.3;

            // Boundary Loop
            if (group.current.position.y < -7) {
                group.current.position.y = 7;
            }
        }
    });

    // 3. MATERIALS: "Ultra Satin"
    useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material = new THREE.MeshPhysicalMaterial({
                    color: "#f97316",
                    roughness: 0.25,
                    metalness: 0.1,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.15,
                    sheen: 1.0,
                    sheenColor: "#ffedd5"
                });
            }
        });
        return clone;
    }, [scene]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group rotation={[-0.2, 0, 0]}>
                <primitive
                    object={scene}
                    scale={3}
                    rotation={[-Math.PI / 2, 0, 0]}
                />
            </group>
        </group>
    );
};

const DynamicLights = () => {
    const lightsRef = useRef();

    // Rotate lights slowly to make the object feel "alive"
    useFrame((state) => {
        if (lightsRef.current) {
            lightsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group ref={lightsRef}>
            {/* Warm Rim - Right */}
            <spotLight
                position={[8, 0, 5]}
                intensity={8}
                color="#ffedd5"
                angle={0.6}
                penumbra={1}
                castShadow
            />

            {/* Cool Rim - Left */}
            <spotLight
                position={[-8, 5, -5]}
                intensity={10}
                color="#e0f2fe"
                angle={0.8}
            />
        </group>
    )
}

const CameraRig = () => {
    // Subtle Mouse Parallax
    useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.05);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

const Walksy3DModel = () => {
    return (
        <div className="w-full h-full relative" style={{ minHeight: '800px' }}>
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 10], fov: 32 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1
                }}
            >
                <SoftShadows size={10} samples={16} focus={0.5} />
                <ambientLight intensity={1} color="#ffffff" />

                {/* Static Key Light */}
                <rectAreaLight width={15} height={15} position={[5, 10, 10]} color="#ffffff" intensity={2.5} lookAt={[0, 0, 0]} />

                {/* Moving Lights */}
                <DynamicLights />

                <Environment preset="studio" blur={1} />

                {/* Interactive Camera */}
                <CameraRig />

                {/* SCENE */}
                <group position={[0, 0, 0]}>
                    <LivingRunner />
                    {/* Upward Flowing Particles - "Energy Rising" */}
                    <Sparkles
                        count={40}
                        scale={12}
                        size={4}
                        speed={0.4}
                        opacity={0.4}
                        color="#fff7ed"
                        position={[0, 0, 2]}
                    />
                </group>

                <ContactShadows resolution={1024} scale={40} blur={3} opacity={0.3} far={15} color="#000000" position={[0, -5, 0]} />
            </Canvas>
        </div>
    );
};

export default Walksy3DModel;
