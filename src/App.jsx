import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Suspense } from "react";
import Modelado3D from "./components/Modelo3D";


function App() {

    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Modelado3D/>
      </div>
  );

}

export default App