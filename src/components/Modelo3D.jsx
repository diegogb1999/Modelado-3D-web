//Hooks
import { useState, useEffect, useRef } from "react";
//Three.js
import { Canvas } from "@react-three/fiber";
//Components
import NodeSelection from "./NodeSelection";
import Scene from "./Scene";
//Styles
import "./Modelo3D.css";
//Functions
import {
  getNodesNames,
  getSelectedNode,
  saveKeyframe,
  animateKeyframes,
  handleSelectNode,
} from "../utils/functions";

const Modelado3D = () => {
  //States
  const [sliderValue, setSliderValue] = useState(50);
  const [nodeNames, setNodeNames] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [keyframes, setKeyframes] = useState({
    start: { positionZ: null, rotationZ: null },
    end: { positionZ: null, rotationZ: null },
  });

  //Refs
  const canvasRef = useRef();
  const sceneComponentRef = useRef();
  const mediaRecorderRef = useRef(null);

  const chunks = [];

  const handleNodesLoaded = (names) => {
    setNodeNames(names);
  };

  const handleSaveStart = () => {
    if (sceneComponentRef.current && sceneComponentRef.current.saveKeyframe) {
      sceneComponentRef.current.saveKeyframe("start", sliderValue);
    }
  };

  const handleSaveEnd = () => {
    if (sceneComponentRef.current && sceneComponentRef.current.saveKeyframe) {
      sceneComponentRef.current.saveKeyframe("end", sliderValue);
    }
  };

  const handlePlayAnimation = () => {
    setPlayAnimation(true);
    if (
      sceneComponentRef.current &&
      sceneComponentRef.current.animateKeyframes
    ) {
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
      setSelectedNode(sceneComponentRef.current.getSelectedNode());
    }

    if (canvasRef.current) {
      const stream = canvasRef.current.captureStream(25);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "animation.webm";
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

  return (
    <div className="pantalla">
      <div className="botones">
        <button className="boton" onClick={handleSaveStart}>
          Guardar Keyframe Inicial
        </button>
        <button className="boton" onClick={handleSaveEnd}>
          Guardar Keyframe Final
        </button>
        <button className="boton" onClick={handlePlayAnimation}>
          Reproducir Animación
        </button>
        <button className="boton" onClick={startRecording}>
          Start Recording
        </button>
        <button className="boton" onClick={stopRecording}>
          Stop Recording
        </button>
      </div>

      <div className="nodosCanvas">
        <div className="nodos">
          <NodeSelection
            nodeNames={nodeNames}
            onSelectNode={onSelectNode}
            selectedNode={selectedNode}
          />
        </div>

        <div className="canvas">
          <Canvas
            ref={canvasRef}
            style={{ width: "1500px", height: "700px", background: "black" }}
            className="cursor-pointer"
            frameloop="always"
            shadows
            camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}
          >
            <Scene
              sceneComponentRef={sceneComponentRef}
              onNodesLoaded={handleNodesLoaded}
              setSliderValue={setSliderValue}
              sliderValue={sliderValue}
              keyframes={keyframes}
              setKeyframes={setKeyframes}
              playAnimation={playAnimation}
            />
          </Canvas>
        </div>
      </div>

      <div className="inputs">
        <div className="slider">
          <input
            type="range"
            min="22"
            max="250"
            value={sliderValue}
            onChange={handleSliderChange}
            style={{ width: "300px", height: "25px" }}
          />
          <span>Valor del Slider: {sliderValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Modelado3D;
