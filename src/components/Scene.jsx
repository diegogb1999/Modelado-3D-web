import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import gsap from "gsap";


const Scene = forwardRef(({ sliderValue, keyframes, setKeyframes, playAnimation, onNodesLoaded, setSliderValue }, ref) => {

    const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');

    //const nut = nodes.bolts1002;
    //const circle = nodes.Object_57002;
    //const screw = nodes.Object_57005;

    const [selectedNode, setSelectedNode] = useState(null);
    const [originalMaterial, setOriginalMaterial] = useState(null);


    const handleSelectNode = nodeName => {
        const node = nodes[nodeName];

        if (selectedNode && originalMaterial) {
            selectedNode.material = originalMaterial;
        }

        if (node.material) {
            setOriginalMaterial(node.material.clone());
            node.material = node.material.clone();
            node.material.color.set(0xff0000);
        }
        setSelectedNode(node);

        const newSliderValue = positionToSliderValue(node.position.z);
        setSliderValue(newSliderValue);
    };

    const positionToSliderValue = (positionZ) => {
        return (positionZ + 1) / 3 * 250;
    };

    useImperativeHandle(ref, () => ({

        getNodesNames: () => Object.keys(nodes),

        handleSelectNode,

        getSelectedNode: () => selectedNode,

        saveKeyframe: (type) => {
            Object.keys(nodes).forEach(nodeName => {
                const node = nodes[nodeName];

                const positionZ = node.position.z;
                const rotationZ = node.rotation.z;

                const newState = {
                    positionZ: positionZ,
                    rotationZ: rotationZ
                };

                setKeyframes(prevState => ({
                    ...prevState,
                    [nodeName]: {
                        ...prevState[nodeName],
                        [type]: newState
                    }
                }));
            });
        },

        animateKeyframes: () => {
            Object.entries(keyframes).forEach(([nodeName, nodeKeyframes]) => {
                if (nodeKeyframes.start && nodeKeyframes.end) {
                    const node = nodes[nodeName];
                    gsap.fromTo(node.position,
                        { z: nodeKeyframes.start.positionZ },
                        {
                            z: nodeKeyframes.end.positionZ,
                            duration: 2,
                            ease: "linear"
                        }
                    );
                    gsap.fromTo(node.rotation,
                        { z: nodeKeyframes.start.rotationZ },
                        {
                            z: nodeKeyframes.end.rotationZ,
                            duration: 2,
                            ease: "linear"
                        }
                    );
                }
            });
        },
    }));


    useEffect(() => {
        if (Object.keys(nodes).length > 0 && onNodesLoaded) {
            onNodesLoaded(Object.keys(nodes));
        }
    }, [nodes, onNodesLoaded]);


    useFrame(() => {
        if (!playAnimation && selectedNode) {
            const node = nodes[selectedNode.name];
            const scale = sliderValue / 250;
            const newPositionZ = scale * 3 - 1;
            const newRotationZ = scale * Math.PI * 3;
            node.position.z = newPositionZ;
            node.rotation.z = newRotationZ;
        }
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

export default Scene;