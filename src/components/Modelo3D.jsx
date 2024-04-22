import React, { Component, useState, useEffect, useRef } from "react";
import { DirectionalLight, PointLight, MeshStandardMaterial, Box3, BoxHelper } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Modelado3D = () => {

  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (event) => {
    setSliderValue(Number(event.target.value));

    
  };

  return (
    <div>
      <Canvas style={{ width: '100vw', height: '100vh' }} className="cursor-pointer" frameloop="always" shadows camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}>
        <SceneComponent setSliderValue={setSliderValue} sliderValue={sliderValue} />
      </Canvas>
      <div style={{ position: 'absolute', top: '10px', left: '800px' }}>
        <button onClick={() => saveKeyframe('start')}>Guardar Keyframe Inicial</button>
        <button onClick={() => saveKeyframe('end')}>Guardar Keyframe Final</button>
      </div>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <input type="range" min="22" max="250" value={sliderValue} onChange={handleSliderChange} style={{ width: '300px', height: '25px' }} />
        <span>Valor del Slider: {sliderValue}</span>
      </div>
    </div>
  );
};

const SceneComponent = ({ setSliderValue, sliderValue }) => {

  const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');

  const circle = nodes.Object_57002;
  const nut = nodes.bolts1002;
  const screw = nodes.Object_57005;

  const nutBox = new Box3().setFromObject(nut);
  const screwBox = new Box3().setFromObject(screw);

  // const nutHelper = useRef(nut);
  // const screwHelper = useRef(screw);

  const rotateNut = (direction) => {
    const delta = 0.05;
    const deltaRotation = 0.1

    if (direction > 0) {
      nut.position.z -= delta;
      nut.rotation.z += deltaRotation;
    }
    else {
      nut.position.z += delta;
      nut.rotation.z -= deltaRotation;
    }
  };

  // useEffect(() => {
  //   nutHelper.current = new BoxHelper(nut, 0xff0000);
  //   screwHelper.current = new BoxHelper(screw, 0x00ff00);

  //   scene.add(nutHelper.current);
  //   scene.add(screwHelper.current);

  //   return () => {
  //     scene.remove(nutHelper.current);
  //     scene.remove(screwHelper.current);
  //   };
  // }, [scene, nut, screw]);

  useFrame(() => {
    const scale = sliderValue / 250;
    const newPositionZ = scale * 3 - 1;
    const newRotationZ = scale * Math.PI * 3;

    // Actualizar posición de la tuerca basado en el slider
    nut.position.z = newPositionZ;
    nut.rotation.z = newRotationZ;

    // // Actualizar los BoxHelpers
    // nutHelper.current.update();
    // screwHelper.current.update();

    // Actualizar la envolvente delimitadora de la tuerca
    nutBox.setFromObject(nut);


  });

  return (
    <>
      <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} minPolarAngle={0} enablePan={true} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 10, -10]} intensity={1} />
      <ambientLight intensity={0.5} />
      <primitive object={scene} scale={1} />
    </>
  );
};

export default Modelado3D;