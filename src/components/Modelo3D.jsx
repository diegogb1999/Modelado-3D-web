import React, { Component } from "react";
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader } from '@react-three/fiber'
import { useFBX } from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, useGLTF } from '@react-three/drei';

const Modelado3D = () => {
    const xd = useGLTF('../../Bomba Emica 150-40.gltf');

    return (
      <Canvas frameloop="demand" camera={{ position: [-4, 3, 6], fov: 45, near: 0.1, far: 200 }}> 
      <primitive object={xd.scene} scale={2.5} />
      <ambientLight intensity={0.5} />
      </Canvas>
    );
  };

export default Modelado3D;