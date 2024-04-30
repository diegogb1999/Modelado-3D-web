export function getNodesNames(nodes) {
  return Object.keys(nodes);
}

export function getSelectedNode(selectedNode) {
  return selectedNode;
}

export function saveKeyframe(type, value, setKeyframes) {
  const scale = value / 250;
  const positionZ = scale * 3 - 1;
  const rotationZ = scale * Math.PI * 3;

  const newState = {
    positionZ: positionZ,
    rotationZ: rotationZ,
  };

  setKeyframes((prevState) => ({
    ...prevState,
    [type]: newState,
  }));
}

export function animateKeyframes(keyframes, nut, gsap) {
  if (keyframes.start && keyframes.end) {
    console.log("Animating from:", keyframes.start, "to", keyframes.end);

    gsap.fromTo(
      nut.position,
      { z: keyframes.start.positionZ },
      {
        z: keyframes.end.positionZ,
        duration: 2,
        ease: "linear",
      }
    );
    gsap.fromTo(
      nut.rotation,
      { z: keyframes.start.rotationZ },
      {
        z: keyframes.end.rotationZ,
        duration: 2,
        ease: "linear",
      }
    );
  }
}

export function handleSelectNode(
  nodes,
  nodeName,
  selectedNode,
  setSelectedNode,
  originalMaterial,
  setOriginalMaterial,
  MeshStandardMaterial
) {
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
}
