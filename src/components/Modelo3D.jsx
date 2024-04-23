import React, { Component, useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { DirectionalLight, PointLight, MeshStandardMaterial, Box3, BoxHelper } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './Modelo3D.css';
import gsap from "gsap";
import { Debug } from "@react-three/cannon";
//import CCapture from "ccapture.js";

const Modelado3D = () => {

  const [sliderValue, setSliderValue] = useState(50);
  const canvasRef = useRef();  // Create a ref for the canvas
  const sceneComponentRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunks = [];

  // const handleAnimate = () => {
  //   if (sceneComponentRef.current) {
  //     sceneComponentRef.current.animateKeyframes();
  //   }
  // };

  // const handleSave = (type) => {
  //   if (sceneComponentRef.current) {
  //     sceneComponentRef.current.saveKeyframe(type);
  //   }
  // };

  // const handleStartRecording = () => {
  //   if (sceneComponentRef.current) {
  //     sceneComponentRef.current.startRecording();
  //   }
  // };

  //const streamRef = useRef(null);


  const handleSliderChange = (event) => {
    setSliderValue(Number(event.target.value));
  };

  useEffect(() => {
    if (canvasRef.current) {
      const stream = canvasRef.current.captureStream(25);
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'animation.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };
    }

    return () => {
      mediaRecorderRef.current = null;
    };
  }, []);

  const startRecording = () => {
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  return (
    <div>
      <Canvas ref={canvasRef} style={{ width: '100vw', height: '700px' }} className="cursor-pointer" frameloop="always" shadows camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}>
        <SceneComponent ref={sceneComponentRef} setSliderValue={setSliderValue} sliderValue={sliderValue} />
      </Canvas>
      <div style={{ position: 'absolute', top: '10px', left: '800px' }}>
        {/* <button className = "boton" onClick={() => handleSave('start')}>Guardar Keyframe Inicial</button>
        <button className = "boton" onClick={() => handleSave('end')}>Guardar Keyframe Final</button> */}
        <button className = "boton" onClick={startRecording}>Start Recording</button>
      <button className = "boton" onClick={stopRecording}>Stop Recording</button>
      </div>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <input type="range" min="22" max="250" value={sliderValue} onChange={handleSliderChange} style={{ width: '300px', height: '25px' }} />
        <span>Valor del Slider: {sliderValue}</span>
      </div>
    </div>
  );
};

const SceneComponent = forwardRef(({ setSliderValue, sliderValue }, ref) => {

  // const animateKeyframes = () => {
  //   //console.log("hola")
  //   // Usar una librería como GSAP para animar entre los estados guardados
  //   gsap.to(nut.position, {
  //     z: keyframes.end.positionZ,
  //     duration: 2,
  //     ease: "linear"
  //   });
  //   gsap.to(nut.rotation, {
  //     z: keyframes.end.rotationZ,
  //     duration: 2,
  //     ease: "linear"
  //   });
  // };

  const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');

  // const [keyframes, setKeyframes] = useState({
  //   start: { positionZ: null, rotationZ: null },
  //   end: { positionZ: null, rotationZ: null }
  // });

  // const saveKeyframe = (type) => {

  //   console.log("Animando keyframes");
  //   const newState = {
  //     positionZ: nut.position.z,
  //     rotationZ: nut.rotation.z
  //   };
  //   setKeyframes(prevState => ({
  //     ...prevState,
  //     [type]: newState
  //   }));
  // };

  // const startRecording = () => {
  //   const capturer = new CCapture({
  //     format: 'webm',
  //     framerate: 30,
  //     verbose: true
  //   });

  //   capturer.start();

  //   // Suponiendo que tienes una función que actualiza tu escena
  //   function render() {
  //     requestAnimationFrame(render);
  //     capturer.capture(canvas);
  //   }

  //   render();

  //   // Supongamos que stopRecording() se llama después de cierto tiempo o evento
  //   setTimeout(() => {
  //     capturer.stop();
  //     capturer.save();
  //   }, 4000); // Duración de la grabación en milisegundos
  // };

  // useImperativeHandle(ref, () => ({
  //   animateKeyframes,
  //   saveKeyframe,
  //   startRecording
  // }));

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
});

export default Modelado3D;