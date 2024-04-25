import React, { Component, useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { DirectionalLight, PointLight, MeshStandardMaterial, Box3, BoxHelper } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import './Modelo3D.css';
import gsap from "gsap";
import { Debug } from "@react-three/cannon";
//import CCapture from "ccapture.js";

function NodeSelection({ nodeNames, onSelectNode, selectedNode }) {
  return (
    <div>
      {nodeNames.map(name => (
        <button key={name} onClick={() => onSelectNode(name)} style={{ display: 'block', margin: '5px' }}>
          {name}
        </button>
      ))}
      {selectedNode && <div className="selected">
        <span>---------------</span>
        <br></br>
        {selectedNode.name}
        </div>}
    </div>
  );
}


const Modelado3D = () => {

  const [sliderValue, setSliderValue] = useState(50);
  const canvasRef = useRef();  // Create a ref for the canvas
  const sceneComponentRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunks = [];

  const [nodeNames, setNodeNames] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const [keyframes, setKeyframes] = useState({
    start: { positionZ: null, rotationZ: null },
    end: { positionZ: null, rotationZ: null }
  });
  const [playAnimation, setPlayAnimation] = useState(false);

  const handleNodesLoaded = (names) => {
    setNodeNames(names);
  };

  // Manejadores para los botones
  const handleSaveStart = () => {
    if (sceneComponentRef.current && sceneComponentRef.current.saveKeyframe) {
      sceneComponentRef.current.saveKeyframe('start', sliderValue);
      console.log('Save Start:', sliderValue); // Verificar que el botón está funcionando
    }
  };

  const handleSaveEnd = () => {
    if (sceneComponentRef.current && sceneComponentRef.current.saveKeyframe) {
      sceneComponentRef.current.saveKeyframe('end', sliderValue);
      console.log('Save End:', sliderValue); // Verificar que el botón está funcionando
    }
  };

  const handlePlayAnimation = () => {
    console.log('Play Animation:', keyframes); // Verificar los keyframes antes de animar
    setPlayAnimation(true);
    if (sceneComponentRef.current && sceneComponentRef.current.animateKeyframes) {
      sceneComponentRef.current.animateKeyframes();
    }
    setTimeout(() => setPlayAnimation(false), 2000);
  };

  const handleSliderChange = (event) => {
    setSliderValue(Number(event.target.value));
  };

  const startRecording = () => {
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const onSelectNode = (nodeName) => {
    sceneComponentRef.current.handleSelectNode(nodeName);
    setTimeout(() => {
      setSelectedNode(sceneComponentRef.current.getSelectedNode());
    }, 0);
  };

  useEffect(() => {
    if (sceneComponentRef.current) {
      setNodeNames(sceneComponentRef.current.getNodesNames());
      // Asigna un nodo seleccionado inicial si es necesario
      setSelectedNode(sceneComponentRef.current.getSelectedNode());
    }


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
  }, [sceneComponentRef.current]);

  return (
    <div className="pantalla">

      <div style={{ position: 'absolute', top: '0px', left: '0px' }}>

        <button className="boton" onClick={handleSaveStart}>Guardar Keyframe Inicial</button>
        <button className="boton" onClick={handleSaveEnd}>Guardar Keyframe Final</button>
        <button className="boton" onClick={handlePlayAnimation}>Reproducir Animación</button>
        <button className="boton" onClick={startRecording}>Start Recording</button>
        <button className="boton" onClick={stopRecording}>Stop Recording</button>

      </div>

      <div className="nodosCanvas">

        <div className="nodos">
          <NodeSelection nodeNames={nodeNames} onSelectNode={onSelectNode} selectedNode={selectedNode} />
        </div>

        <div className="canvas">
          <Canvas ref={canvasRef} style={{ width: '1500px', height: '700px', background: "black" }} className="cursor-pointer" frameloop="always" shadows camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}>
            <SceneComponent ref={sceneComponentRef} onNodesLoaded={handleNodesLoaded} setSliderValue={setSliderValue} sliderValue={sliderValue} keyframes={keyframes}
              setKeyframes={setKeyframes}
              playAnimation={playAnimation} />
              <EffectComposer>
        <Outline
          kernelSize={1} // You can adjust the size of the outline effect
          visibleEdgeColor="white"
          hiddenEdgeColor="black"
          edgeStrength={10}
          pulsePeriod={1}
          height={480}
          width={640}
        />
      </EffectComposer>
          </Canvas>
        </div>

      </div>

      <div className="slider">

        <input type="range" min="22" max="250" value={sliderValue} onChange={handleSliderChange} style={{ width: '300px', height: '25px' }} />
        <span>Valor del Slider: {sliderValue}</span>

      </div>

    </div>
  );
};

const SceneComponent = forwardRef(({ setSliderValue, sliderValue, keyframes, setKeyframes, playAnimation, onNodesLoaded }, ref) => {

  const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');

  const circle = nodes.Object_57002;
  const nut = nodes.bolts1002;
  const screw = nodes.Object_57005;

  const nutBox = new Box3().setFromObject(nut);
  const screwBox = new Box3().setFromObject(screw);

  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelectNode = nodeName => {
    const node = nodes[nodeName];
    if (selectedNode) {
      // Restaurar material previo si es necesario
    }
    // Actualizar el material para resaltar el nodo seleccionado
    setSelectedNode(node);
    // Más lógica si necesitas actualizar algo más al seleccionar
  };


  const saveKeyframe = (type) => {
    const newState = {
      positionZ: nut.position.z,
      rotationZ: nut.rotation.z
    };
    setKeyframes(prevState => ({
      ...prevState,
      [type]: newState
    }));
  };

  const animateKeyframes = () => {
    gsap.to(nut.position, {
      z: keyframes.end.positionZ,
      duration: 2,
      ease: "linear"
    });
    gsap.to(nut.rotation, {
      z: keyframes.end.rotationZ,
      duration: 2,
      ease: "linear"
    });
  };

  useImperativeHandle(ref, () => ({

    getNodesNames: () => Object.keys(nodes), // Función para obtener los nombres de los nodos

    handleSelectNode: nodeName => { // Función para manejar la selección de un nodo
      const node = nodes[nodeName];
      if (selectedNode) {
        // Aquí puedes restablecer el estado visual anterior del nodo si es necesario
      }
      // Actualiza el material para resaltar el nodo seleccionado o cualquier otra lógica necesaria
      setSelectedNode(node);
    },

    getSelectedNode: () => selectedNode,

    saveKeyframe: (type, value) => {
      const scale = value / 250;
      const positionZ = scale * 3 - 1; // Esto calcula la nueva posición Z basada en el slider
      const rotationZ = scale * Math.PI * 3; // Esto calcula la nueva rotación Z basada en el slider


      const newState = {
        positionZ: positionZ,
        rotationZ: rotationZ
      };


      setKeyframes(prevState => ({
        ...prevState,
        [type]: newState
      }));
    },
    animateKeyframes: () => {
      if (keyframes.start && keyframes.end) {
        console.log('Animating from:', keyframes.start, 'to', keyframes.end);

        gsap.fromTo(nut.position,
          { z: keyframes.start.positionZ },
          {
            z: keyframes.end.positionZ,
            duration: 2,
            ease: "linear"
          }
        );
        gsap.fromTo(nut.rotation,
          { z: keyframes.start.rotationZ },
          {
            z: keyframes.end.rotationZ,
            duration: 2,
            ease: "linear"
          }
        );
      }
    }
  }));

  // onUpdate: function() {
  //   // Esto puede ayudar a forzar la actualización de la posición durante la animación
  //   nut.position.z = this.targets()[0].z;
  // }

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