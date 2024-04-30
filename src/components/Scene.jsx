//Hooks
import { useState, useEffect } from "react";
//Three.js
import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
//Gsap
import gsap from "gsap";
//Functions
import {
  getNodesNames,
  getSelectedNode,
  saveKeyframe,
  animateKeyframes,
  handleSelectNode,
} from "../utils/functions";

export default function Scene({
  sliderValue,
  keyframes,
  setKeyframes,
  playAnimation,
  onNodesLoaded,
  selectedNode,
  setSelectedNode,
  originalMaterial,
  setOriginalMaterial,
  nodes,
}) {
  const nut = nodes.bolts1002;
  //const circle = nodes.Object_57002;
  //const screw = nodes.Object_57005;

  useEffect(() => {
    if (Object.keys(nodes).length > 0 && onNodesLoaded) {
      onNodesLoaded(Object.keys(nodes));
    }
  }, [nodes, onNodesLoaded]);

  useFrame(() => {
    if (!playAnimation) {
      const scale = sliderValue / 250;
      const newPositionZ = scale * 3 - 1;
      const newRotationZ = scale * Math.PI * 3;
      nut.position.z = newPositionZ;
      nut.rotation.z = newRotationZ;
    }
  });

  return (
    <>
      <OrbitControls
        enableZoom={true}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        enablePan={true}
      />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 10, -10]} intensity={1} />
      <ambientLight intensity={0.5} />
      <primitive object={scene} scale={1} />
    </>
  );
}
