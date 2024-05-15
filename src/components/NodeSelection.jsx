import React from "react";

const NodeSelection = ({ nodeNames, onSelectNode, selectedNode }) => {
    return (
        <div className="flex flex-col items-center w-full">
            {nodeNames.map(name => (
                <button key={name} onClick={() => onSelectNode(name)} className="block m-2 text-black text-xl">
                    {name}
                </button>
            ))}
            {selectedNode && <div className="text-purple-700 text-2xl font-semibold mt-8">
                {selectedNode.name}
            </div>}
        </div>
    );
};

export default NodeSelection;