import React, { useState, useEffect, useRef } from "react";
import { Canvas } from '@react-three/fiber';
import NodeSelection from "./NodeSelection";
import Scene from "./Scene";
import ButtonSmallNoIconPrimary from '../importedComponents/ButtonSmallNoIconPrimary';
import ModalBackground from '../importedComponents/ModalBackground';

const Modelado3D = () => {

  const canvasRef = useRef();
  const sceneComponentRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunks = [];

  const [sliderValue, setSliderValue] = useState(22);
  const [nodeNames, setNodeNames] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [keyframes, setKeyframes] = useState({});


  const handleNodesLoaded = (names) => {
    setNodeNames(names);
  };

  const handleSaveStart = () => {
    sceneComponentRef.current.saveKeyframe('start');
  };

  const handleSaveEnd = () => {
    sceneComponentRef.current.saveKeyframe('end');
  };

  const handlePlayAnimation = () => {
    setPlayAnimation(true);
    sceneComponentRef.current.animateKeyframes();
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


  return (
    <div className="h-full w-full justify-center flex-col items-center flex flex-column gap-100">

      <div className="flex justify-around items-center w-full flex-wrap mb-5 mt-5 gap-5">
        <ButtonSmallNoIconPrimary
          text="Guardar Keyframe Inicial"
          setter={handleSaveStart}
          disabled={false}
          fetching={false}
          width="w-auto"
        />
        <ButtonSmallNoIconPrimary
          text="Guardar Keyframe Final"
          setter={handleSaveEnd}
          disabled={false}
          fetching={false}
          width="w-auto"
        />
        <ButtonSmallNoIconPrimary
          text="Reproducir Animación"
          setter={handlePlayAnimation}
          disabled={false}
          fetching={false}
          width="w-auto"
        />
        <ButtonSmallNoIconPrimary
          text="Start Recording"
          setter={startRecording}
          disabled={false}
          fetching={false}
          width="w-auto"
        />
        <ButtonSmallNoIconPrimary
          text="Stop Recording"
          setter={stopRecording}
          disabled={false}
          fetching={false}
          width="w-auto"
        />
        
      </div>

      <div className="h-full w-full flex justify-center">
        <div className="flex w-[95%] h-[95%] flex-col justify-center bg-uktena-white items-center pb-10 rounded-3xl">

          <div className="flex w-[100%] h-[100%] flex-row justify-evenly items-center">

            <div className="flex flex-col items-center justify-center">
              <NodeSelection nodeNames={nodeNames} onSelectNode={onSelectNode} selectedNode={selectedNode} />
            </div>

            <div className="w-[70%] h-[90%] bg-uktena-purple-light-table rounded-3xl shadow-lg overflow-hidden">
              <Canvas ref={canvasRef} className="cursor-pointer" frameloop="always" shadows camera={{ position: [-4, 3, 6], fov: 75, near: 0.1, far: 200 }}>
                <Scene ref={sceneComponentRef} onNodesLoaded={handleNodesLoaded} setSliderValue={setSliderValue} sliderValue={sliderValue} keyframes={keyframes}
                  setKeyframes={setKeyframes}
                  playAnimation={playAnimation} />
              </Canvas>
            </div>

          </div>

          <div className="flex flex-row gap-12 items-center justify-center mt-10">

            <div className="flex flex-col items-center">
              <input type="range" min="22" max="250" value={sliderValue} onChange={handleSliderChange} className="w-72 h-6 accent-uktena-violet hover:bg-uktena-light-red"  />
              <span>Valor del Slider: {sliderValue}</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Modelado3D;