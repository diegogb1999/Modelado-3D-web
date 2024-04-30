import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import gsap from "gsap";


const Scene = forwardRef(({ sliderValue, keyframes, setKeyframes, playAnimation, onNodesLoaded }, ref) => {

    const { scene, nodes } = useGLTF('../../Screw_Nut.gltf');

    const nut = nodes.bolts1002;
    //const circle = nodes.Object_57002;
    //const screw = nodes.Object_57005;

    const [selectedNode, setSelectedNode] = useState(null);
    const [originalMaterial, setOriginalMaterial] = useState(null);


    const handleSelectNode = nodeName => {
        const node = nodes[nodeName];

        if (selectedNode && originalMaterial) {
            selectedNode.material = originalMaterial;
        }
        
        if (node.material && node.material.isMaterial) {
            setOriginalMaterial(node.material.clone());
            node.material = node.material.clone();
            node.material.color.set(0xff0000);
        } else {
            node.material = new MeshStandardMaterial({ color: 0xff0000 });
            setOriginalMaterial(node.material);
        }
        setSelectedNode(node);
    };


    useImperativeHandle(ref, () => ({

        getNodesNames: () => Object.keys(nodes),

        handleSelectNode,

        getSelectedNode: () => selectedNode,

        saveKeyframe: (type, value) => {
            const scale = value / 250;
            const positionZ = scale * 3 - 1;
            const rotationZ = scale * Math.PI * 3;


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
            <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} minPolarAngle={0} enablePan={true} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-10, 10, -10]} intensity={1} />
            <ambientLight intensity={0.5} />
            <primitive object={scene} scale={1} />
        </>
    );
});

export default Scene;