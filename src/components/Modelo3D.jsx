import React, { Component, useState } from "react";
import { DirectionalLight, PointLight, MeshStandardMaterial } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Modelado3D = () => {
  //const model = useGLTF('../../Screw_Nut.gltf');
  const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');
  const [nutPosition, setNutPosition] = useState(0); // Posición inicial de la tuerca
  const [keyframes, setKeyframes] = useState({ start: null, end: null });

  // Asumiendo que los nodos se llaman "Nut" y "Screw" en tu modelo GLTF
  const circle = nodes.Object_57002;
  const nut = nodes.bolts1002;
  const screw = nodes.Object_57005;

  const rotateNut = (direction) => {
    const delta = 0.05; // Este valor representa el incremento de movimiento por cada acción
    const deltaRotation = 0.1

    if (direction > 0) {
        // Enroscar - la tuerca debería moverse hacia una dirección (ej. hacia adentro)
        nut.position.z -= delta; // Suponiendo que 'z' es el eje correcto
        nut.rotation.z += deltaRotation;
    } else {
        // Desenroscar - la tuerca debería moverse hacia la dirección opuesta
        nut.position.z += delta;
        nut.rotation.z -= deltaRotation;
    }
  };

  const saveKeyframe = (type) => {
    const keyframeData = { position: nut.position.clone(), rotation: nut.rotation.clone() };
    setKeyframes((prevKeyframes) => ({
      ...prevKeyframes,
      [type]: keyframeData
    }));
  };

  return (
    <div>
      <Canvas style={{ width: '100vw', height: '100vh' }} className="cursor-pointer" frameloop="always" shadows camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}>
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} minPolarAngle={0} enablePan={true} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, -10]} intensity={1} />
        <ambientLight intensity={0.5} />
        <primitive object={scene} scale={1} />
      </Canvas>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button onClick={() => rotateNut(1)}>Enroscar</button>
        <button onClick={() => rotateNut(-1)}>Desenroscar</button>
        <button onClick={() => saveKeyframe('start')}>Guardar Keyframe Inicial</button>
        <button onClick={() => saveKeyframe('end')}>Guardar Keyframe Final</button>
      </div>
    </div>
  );
};

export default Modelado3D;

//material={new MeshStandardMaterial({color: 'white', roughness: 0.5, metalness: 0.1})}